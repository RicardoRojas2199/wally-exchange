export const ExchangeRatesResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      fromCurrency: { type: 'string' },
      toCurrency: { type: 'string' },
      rate: { type: 'number' },
    },
    example: {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      rate: 0.91,
    },
  },
};
