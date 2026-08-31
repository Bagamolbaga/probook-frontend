export function formatCurrency(
  totalPrice: number | string,
  {
    currency,
    locale,
    shouldOmitFractions,
    style,
  }: {
    style?: Intl.NumberFormatOptions["style"];
    currency?: string;
    locale?: string;
    shouldOmitFractions?: boolean;
  } = { style: "currency", currency: "RUB", locale: "ru-RU", shouldOmitFractions: false }
) {
  const price = Number(totalPrice);

  if (shouldOmitFractions && price % 1 === 0) {
    return new Intl.NumberFormat(locale, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      style,
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  return new Intl.NumberFormat(locale, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    style,
    currency,
  }).format(price);
}
