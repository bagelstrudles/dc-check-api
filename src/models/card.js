const { supabase, handleSupabaseError } = require('../services/supabaseService');
const priceCalculator = require('../services/priceCalculator');

/**
 * Card model for interacting with the cards table in Supabase
 */
class Card {
  /**
   * Get all cards with optional filtering
   * @param {Object} options - Query options
   * @returns {Array} - Array of card objects
   */
  async getAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        search = '',
        sortBy = 'name',
        sortOrder = 'asc',
        filters = {}
      } = options;

      // Calculate pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Start query builder
      let query = supabase
        .from('cards')
        .select('*', { count: 'exact' });

      // Apply search if provided
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      // Apply additional filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        cards: data,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Get a single card by ID
   * @param {string} id - Card ID
   * @returns {Object} - Card object
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          prices:card_prices(*)
        `)
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
   * Create a new card
   * @param {Object} cardData - Card data
   * @returns {Object} - Created card
   */
  async create(cardData) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([cardData])
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
   * Update a card
   * @param {string} id - Card ID
   * @param {Object} cardData - Updated card data
   * @returns {Object} - Updated card
   */
  async update(id, cardData) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .update(cardData)
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
   * Delete a card
   * @param {string} id - Card ID
   * @returns {boolean} - Success status
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }

  /**
   * Bulk update cards
   * @param {Array} cardsData - Array of card updates with IDs
   * @returns {Array} - Updated cards
   */
  async bulkUpdate(cardsData) {
    try {
      // Separate data into individual updates
      const updates = cardsData.map(card => ({
        id: card.id,
        ...card.data
      }));

      const { data, error } = await supabase
        .from('cards')
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
   * Toggle visibility of buy or sell prices for multiple cards
   * @param {Array} cardIds - Array of card IDs
   * @param {Object} toggleData - What to toggle (e.g., {showBuyPrice: true})
   * @returns {boolean} - Success status
   */
  async togglePriceVisibility(cardIds, toggleData) {
    try {
      const { error } = await supabase
        .from('cards')
        .update(toggleData)
        .in('id', cardIds);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }
}

module.exports = new Card();
