/**
 * Service for calculating card prices based on business rules
 */
class PriceCalculator {
  /**
   * Calculate sale price based on cost and market price
   * @param {number} costPrice - The cost price of the card
   * @param {number} marketPrice - The market price of the card
   * @returns {Object} - Calculated prices and margins
   */
  calculateSalePrice(costPrice, marketPrice) {
    // If no cost price is available, use market x 1.1
    if (!costPrice || costPrice <= 0) {
      return {
        salePrice: parseFloat((marketPrice * 1.1).toFixed(2)),
        method: 'NO_COST',
        profitMargin: 9.09 // (1.1 - 1) / 1.1 * 100
      };
    }

    // Calculate default sale price with minimum 30% profit margin
    const minProfitMargin = 0.3; // 30%
    
    // Calculate profit margin: (Sale - Cost) / Sale
    const idealSalePrice = parseFloat((costPrice / (1 - minProfitMargin)).toFixed(2));
    
    // Calculate Cost-Based Sale Price (CBSP)
    const costBasedSalePrice = parseFloat((costPrice * 1.45).toFixed(2));
    
    // Calculate Market-Based Sale Price (MBSP)
    const marketBasedSalePrice = parseFloat((marketPrice * 1.05).toFixed(2));
    
    // Determine which price to use
    const actualProfitMargin = (idealSalePrice - costPrice) / idealSalePrice;
    
    // If ideal price provides at least 30% margin, use it
    if (actualProfitMargin >= minProfitMargin) {
      return {
        salePrice: idealSalePrice,
        method: 'IDEAL',
        profitMargin: parseFloat((actualProfitMargin * 100).toFixed(2))
      };
    }
    
    // Otherwise use the higher of CBSP or MBSP
    const higherPrice = Math.max(costBasedSalePrice, marketBasedSalePrice);
    const method = higherPrice === costBasedSalePrice ? 'CBSP' : 'MBSP';
    const resultingMargin = (higherPrice - costPrice) / higherPrice;
    
    return {
      salePrice: higherPrice,
      method,
      profitMargin: parseFloat((resultingMargin * 100).toFixed(2))
    };
  }

  /**
   * Calculate buy price based on market price
   * @param {number} marketPrice - The market price of the card
   * @returns {number} - The buy price
   */
  calculateBuyPrice(marketPrice) {
    return parseFloat((marketPrice * 0.75).toFixed(2));
  }

  /**
   * Calculate all prices for a card
   * @param {Object} card - Card data with cost and market prices
   * @returns {Object} - Complete price calculations
   */
  calculateAllPrices(card) {
    const { costPrice, marketPrice } = card;
    
    const { salePrice, method, profitMargin } = this.calculateSalePrice(costPrice, marketPrice);
    const buyPrice = this.calculateBuyPrice(marketPrice);
    
    return {
      costPrice: costPrice || 0,
      marketPrice,
      salePrice,
      buyPrice,
      pricingMethod: method,
      profitMargin
    };
  }
}

module.exports = new PriceCalculator();
