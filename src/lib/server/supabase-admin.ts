import { prisma } from '@/lib/prisma';

function getAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error('Supabase admin env missing');
  }
  return { url, serviceRole };
}

function extractSupabaseUserId(clerkId: string) {
  const directUuid = clerkId.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  return directUuid?.[0] ?? null;
}

async function getSupabaseAuthUserIdByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, clerkId: true },
  });

  const localAuthUserId = user?.clerkId ? extractSupabaseUserId(user.clerkId) : null;
  if (localAuthUserId) return localAuthUserId;

  const { url, serviceRole } = getAdminConfig();
  const res = await fetch(`${url}/auth/v1/admin/users?page=1&per_page=1000`, {
    method: 'GET',
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const json = (await res.json().catch(() => ({}))) as {
    users?: Array<{ id?: string; email?: string }>;
    msg?: string;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(json.msg || json.error || 'Could not read auth users');
  }

  const authUser = json.users?.find((row) => row.email?.toLowerCase() === normalizedEmail);
  if (!authUser?.id) return null;

  // Keep the app DB in sync so future password resets and auth actions are direct.
  if (user?.id) {
    await prisma.user
      .update({
        where: { id: user.id },
        data: { clerkId: authUser.id },
      })
      .catch(() => null);
  }

  return authUser.id;
}

export async function updateSupabasePasswordByEmail(email: string, password: string) {
  const userId = await getSupabaseAuthUserIdByEmail(email);
  if (!userId) {
    throw new Error('No auth user found for this email');
  }

  const { url, serviceRole } = getAdminConfig();
  const res = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  const json = (await res.json().catch(() => ({}))) as { msg?: string; error?: string };
  if (!res.ok) {
    throw new Error(json.msg || json.error || 'Could not update password');
  }

  return { userId };
}

export function canUseSupabaseAdmin() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
