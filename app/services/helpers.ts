import { CurrenciesParams, CurrencySymbol } from "../interfaces/currency.model";

export function getSymbol(
  currencies: CurrenciesParams
): CurrencySymbol {
  return (
    currencies.base + currencies.quote
  ) as CurrencySymbol;
}