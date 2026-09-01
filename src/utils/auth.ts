export const getSafeCallbackUrl = (
  callbackUrl: string | null | undefined,
  locale: string
) => {
  const fallbackUrl = `/${locale}/dashboard`;

  if (
    !callbackUrl?.startsWith("/") ||
    callbackUrl.startsWith("//") ||
    callbackUrl.includes("\\")
  ) {
    return fallbackUrl;
  }

  return callbackUrl;
};
