/**
 * Required disclaimer: BrainCare is not a medical device and its cognitive
 * exercises do not diagnose, prevent, cure, reverse, or treat dementia or
 * Alzheimer's disease. Rendered on auth pages directly and available for any
 * other module to include (e.g. footer of AppLayout, dashboard).
 */
export function MedicalDisclaimer() {
  return (
    <p className="max-w-md text-center text-sm text-neutral-500">
      BrainCare offers cognitive exercises and brain-training activities for general mental
      stimulation. It is not a medical device and does not diagnose, treat, or replace advice
      from a qualified healthcare professional.
    </p>
  );
}
