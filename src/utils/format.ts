export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    currencyDisplay: 'narrowSymbol', // shows "Rs." instead of "LKR"
  }).format(value);
