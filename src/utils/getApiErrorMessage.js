export default function getApiErrorMessage(error, fallbackMessage) {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;

  return message || fallbackMessage;
}
