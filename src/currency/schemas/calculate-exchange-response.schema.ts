export const CalculateExchangeResponseSchema = {
  type: 'object',
  properties: {
    originalAmount: { type: 'number' },
    exchangedAmount: { type: 'number' },
    fromCurrency: { type: 'string' },
    toCurrency: { type: 'string' },
    rate: { type: 'number' },
  },
  example: {
    originalAmount: 100,
    exchangedAmount: 91,
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: 0.91,
  },
};
