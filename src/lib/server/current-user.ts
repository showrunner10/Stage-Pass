import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/server/supabase-env';

type AuthIdentity = {
  email: string | null;
  authUserId: string | null;
};

function deriveHandleBase(email: string) {
  return (
    email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || `creator-${Date.now()}`
  );
}

async function getCurrentAuthIdentity(): Promise<AuthIdentity> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sp_access_token')?.value?.trim() ?? null;
  const emailCookie = cookieStore.get('sp_email')?.value?.trim().toLowerCase() ?? null;

  if (!accessToken) {
    return {
      email: emailCookie,
      authUserId: null,
    };
  }

  const supabaseUrl = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();
  if (!supabaseUrl || !publishableKey) {
    return {
      email: emailCookie,
      authUserId: null,
    };
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        email: emailCookie,
        authUserId: null,
      };
    }

    const user = (await response.json().catch(() => ({}))) as {
      email?: string;
      id?: string;
    };

    return {
      email: typeof user.email === 'string' ? user.email.toLowerCase() : emailCookie,
      authUserId: typeof user.id === 'string' ? user.id : null,
    };
  } catch {
    return {
      email: emailCookie,
      authUserId: null,
    };
  }
}

async function ensureCurrentCreatorProfile(email: string, authUserId: string | null) {
  const existingProfile = await prisma.creatorProfile.findFirst({
    where: { user: { email } },
    include: { user: true },
  });
  if (existingProfile) return existingProfile;

  let user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, clerkId: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: authUserId ?? `oauth_${email.replace(/[^a-z0-9]+/gi, '_')}`,
        email,
        role: 'CREATOR',
      },
      select: { id: true, role: true, clerkId: true },
    });
  } else if (authUserId && user.clerkId !== authUserId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { clerkId: authUserId },
    }).catch(() => null);
  }

  if (user.role !== 'CREATOR') return null;

  let handle = deriveHandleBase(email);
  let counter = 1;
  while (await prisma.creatorProfile.findUnique({ where: { handle }, select: { id: true } })) {
    counter += 1;
    handle = `${deriveHandleBase(email).slice(0, Math.max(1, 40 - String(counter).length - 1))}-${counter}`;
  }

  return prisma.creatorProfile.create({
    data: {
      userId: user.id,
      handle,
      displayName: email.split('@')[0],
      tier: 'DEFAULT',
    },
    include: { user: true },
  });
}

export async function getCurrentUserEmail() {
  const identity = await getCurrentAuthIdentity();
  return identity.email;
}

export async function getCurrentCreatorProfile() {
  const identity = await getCurrentAuthIdentity();

  try {
    if (identity.email) {
      const ensured = await ensureCurrentCreatorProfile(identity.email, identity.authUserId);
      if (ensured) return ensured;
    }

    return await prisma.creatorProfile.findFirst({
      orderBy: { createdAt: 'asc' },
      include: { user: true },
    });
  } catch {
    return null;
  }
}

export async function getCurrentPromoterOrg() {
  const email = await getCurrentUserEmail();

  try {
    if (email) {
      const membership = await prisma.promoterOrgMember.findFirst({
        where: { user: { email } },
        include: { org: true },
        orderBy: { createdAt: 'asc' },
      });
      if (membership?.org) return membership.org;
    }

    return await prisma.promoterOrg.findFirst({
      orderBy: { createdAt: 'asc' },
    });
  } catch {
    return null;
  }
}
