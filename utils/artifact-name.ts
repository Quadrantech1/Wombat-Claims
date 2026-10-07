export function createArtifactName(
  batchId: string,
  label: string,
  documentType: string | null,
  suffix: string,
): string {
  const safeLabel = label.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '');
  const type = documentType ?? 'document';
  const safeType = type.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  return `${batchId}_${safeLabel}_${safeType}_${suffix}`;
}
