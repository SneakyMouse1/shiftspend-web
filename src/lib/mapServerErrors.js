// The axios interceptor rejects with `error.response?.data` directly,
// so errors arrive as { message, errors: { field: ["msg"] } } at the top level.
export function mapServerErrors(error, setError) {
  const errors = error?.errors;
  if (!errors) return false;

  Object.entries(errors).forEach(([field, messages]) => {
    setError(field, { type: "server", message: messages[0] });
  });
  return true;
}