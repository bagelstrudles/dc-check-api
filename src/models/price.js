const { supabase, handleSupabaseError } = require('../services/supabaseService');
const priceCalculator = require('../services/priceCalculator');

/**
 * Price model for interacting with the card_prices table in Supabase
 */
class Price {
  /**
   * Get all prices for a card
   * @param {string} cardId - Card ID
   * @returns {Array} - Array of price objects
   */
  async getByCardId(cardId) {
    try {
      const { data, error } = await supabase
        .from('card_prices')
        .select('*')
        .eq('card_id', cardId);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Get a single price by ID
   * @param {string} id - Price ID
   * @returns {Object} - Price object
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('card_prices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Update price for a card condition
   * @param {string} id - Price ID
   * @param {Object} priceData - Updated price data
   * @returns {Object} - Updated price
   */
  async update(id, priceData) {
    try {
      // Get existing price record to calculate
      const { data: existingPrice, error: fetchError } = await supabase
        .from('card_prices')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Merge existing price with updates
      const updatedPriceData = {
        ...existingPrice,
        ...priceData,
      };

      // Calculate sale and buy prices if cost or market price changed
      if (priceData.cost_price !== undefined || priceData.market_price !== undefined) {
        const costPrice = priceData.cost_price !== undefined ? 
          priceData.cost_price : existingPrice.cost_price;
        
        const marketPrice = priceData.market_price !== undefined ? 
          priceData.market_price : existingPrice.market_price;

        const { salePrice, profitMargin } = priceCalculator.calculateSalePrice(costPrice, marketPrice);
        const buyPrice = priceCalculator.calculateBuyPrice(marketPrice);

        // Update calculated prices
        updatedPriceData.sale_price = salePrice;
        updatedPriceData.buy_price = buyPrice;
        updatedPriceData.profit_margin = profitMargin;
      }

      // Update the price record
      const { data, error } = await supabase
        .from('card_prices')
        .update(updatedPriceData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Create a new price record
   * @param {Object} priceData - Price data
   * @returns {Object} - Created price
   */
  async create(priceData) {
    try {
      // Calculate prices
      const costPrice = priceData.cost_price || 0;
      const marketPrice = priceData.market_price || 0;
      
      const { salePrice, profitMargin } = priceCalculator.calculateSalePrice(costPrice, marketPrice);
      const buyPrice = priceCalculator.calculateBuyPrice(marketPrice);

      // Prepare data with calculated prices
      const newPriceData = {
        ...priceData,
        sale_price: salePrice,
        buy_price: buyPrice,
        profit_margin: profitMargin
      };

      // Insert into database
      const { data, error } = await supabase
        .from('card_prices')
        .insert([newPriceData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Bulk update prices
   * @param {Array} pricesData - Array of price updates with IDs
   * @returns {Array} - Updated prices
   */
  async bulkUpdate(pricesData) {
    try {
      // Process each price update with calculations
      const updates = await Promise.all(pricesData.map(async (priceUpdate) => {
        const { id, ...updateData } = priceUpdate;
        
        // Get existing price data if needed
        let existingPrice = null;
        if (updateData.cost_price === undefined || updateData.market_price === undefined) {
          const { data, error } = await supabase
            .from('card_prices')
            .select('cost_price, market_price')
            .eq('id', id)
            .single();
            
          if (error) throw error;
          existingPrice = data;
        }
        
        // Determine prices to use for calculation
        const costPrice = updateData.cost_price !== undefined ? 
          updateData.cost_price : (existingPrice?.cost_price || 0);
        
        const marketPrice = updateData.market_price !== undefined ? 
          updateData.market_price : (existingPrice?.market_price || 0);
        
        // Calculate new prices
        const { salePrice, profitMargin } = priceCalculator.calculateSalePrice(costPrice, marketPrice);
        const buyPrice = priceCalculator.calculateBuyPrice(marketPrice);
        
        // Return complete update object
        return {
          id,
          ...updateData,
          cost_price: costPrice,
          market_price: marketPrice,
          sale_price: salePrice,
          buy_price: buyPrice,
          profit_margin: profitMargin
        };
      }));

      // Perform bulk update
      const { data, error } = await supabase
        .from('card_prices')
        .upsert(updates)
        .select();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Toggle visibility of buy or sell prices for multiple price records
   * @param {Array} priceIds - Array of price IDs
   * @param {Object} toggleData - What to toggle (e.g., {show_buy_price: true})
   * @returns {boolean} - Success status
   */
  async toggleVisibility(priceIds, toggleData) {
    try {
      const { error } = await supabase
        .from('card_prices')
        .update(toggleData)
        .in('id', priceIds);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }
}

module.exports = new Price();
