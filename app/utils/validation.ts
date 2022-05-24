export const hasValidationErrors = (error: {message: string}): boolean =>
  error.message.includes('Decoding value failed');

export const getFieldValidationError = (
  field: string,
  errors: any,
): string | undefined => errors[field];
