import { redirect } from 'next/navigation';

const allowedSteps = new Set(['brief', 'format', 'customise', 'distribute', 'launch']);

export default async function BuilderStepRoute({
  params,
}: {
  params: Promise<{ campaign: string; step: string }>;
}) {
  const resolvedParams = await params;
  const step = allowedSteps.has(resolvedParams.step) ? resolvedParams.step : 'brief';
  redirect(`/app/builder?campaign=${encodeURIComponent(resolvedParams.campaign)}&step=${encodeURIComponent(step)}`);
}
