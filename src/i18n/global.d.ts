import EN from "./dictionaries/en";

type Messages = typeof EN;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
