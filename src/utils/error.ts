export function getErrorMessage(err: any, fallback: string = "Something went wrong. Please try again."): string {
  if (!err) return fallback;

  if (err.response?.data) {
    const data = err.response.data;

    // Standard string message
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    // Spring Boot validation errors array: [{ field: "email", defaultMessage: "..." }]
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0];
      if (typeof first === "string") return first;
      if (first?.defaultMessage) return first.defaultMessage;
      if (first?.message) return first.message;
    }

    // Single error string
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }

    // RFC 7807 Problem Detail
    if (typeof data.detail === "string" && data.detail.trim()) {
      return data.detail;
    }
  }

  if (typeof err.message === "string" && err.message.trim()) {
    return err.message;
  }

  return fallback;
}
