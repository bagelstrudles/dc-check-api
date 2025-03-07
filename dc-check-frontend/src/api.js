// Prices API
const pricesAPI = {
  getByCardId: (cardId) => api.get(`/prices/card/${cardId}`),
  getById: (id) => api.get(`/prices/${id}`),
  create: (priceData) => api.post('/prices', priceData),
  update: (id, priceData) => api.patch(`/prices/${id}`, priceData),
  bulkUpdate: (pricesData) => api.patch('/prices/bulk/update', { prices: pricesData }),
  toggleVisibility: (priceIds, toggleData) => api.patch('/prices/bulk/toggle-visibility', {
    priceIds,
    ...toggleData,
  }),
  getPriceHistory: (cardId, condition, startDate, endDate) => api.get(`/prices/history/${cardId}`, {
    params: {
      condition,
      startDate,
      endDate
    }
  }),
  getLatestPrices: (cardId) => api.get(`/prices/latest/${cardId}`),
  getPriceComparison: (cardId) => api.get(`/prices/comparison/${cardId}`)
}; 