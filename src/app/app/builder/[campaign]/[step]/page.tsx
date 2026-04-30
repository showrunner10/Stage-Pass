import { redirect } from 'next/navigation';

const allowedSteps = new Set(['brief', 'format', 'customise', 'distribute', 'launch']);

export default function BuilderStepRoute({ params }: { params: { campaign: string; step: string } }) {
  const step = allowedSteps.has(params.step) ? params.step : 'brief';
  redirect(`/app/builder?campaign=${encodeURIComponent(params.campaign)}&step=${encodeURIComponent(step)}`);
}
