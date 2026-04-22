export function parseApiError(err) {
  const validationErrors = err.response?.data?.errors;
  if (validationErrors) {
    return Object.values(validationErrors).flat().join(' · ');
  }
  return err.response?.data?.message ?? 'Error inesperat';
}