const Card = require('../models/Card');
const Price = require('../models/Price');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get all cards with optional filtering
 * @route GET /api/cards
 */
exports.getAllCards = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      search: req.query.search || '',
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'asc',
      filters: {
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.setName && { set_name: req.query.setName }),
      }
    };

    const result = await Card.getAll(options);

    res.status(200).json({
      status: 'success',
      data: result.cards,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single card by ID
 * @route GET /api/cards/:id
 */
exports.getCardById = async (req, res, next) => {
  try {
    const card = await Card.getById(req.params.id);
    
    if (!card) {
      return next(new AppError('Card not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: card
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new card
 * @route POST /api/cards
 */
exports.createCard = async (req, res, next) => {
  try {
    // Extract card data from request
    const {
      name,
      set_name,
      set_code,
      card_code,
      description,
      category,
      image_url,
      prices,
      ...otherFields
    } = req.body;

    // Validate required fields
    if (!name || !category) {
      return next(new AppError('Name and category are required', 400));
    }

    // Create card first
    const cardData = {
      name,
      set_name,
      set_code,
      card_code,
      description,
      category,
      image_url,
      ...otherFields
    };

    const newCard = await Card.create(cardData);

    // Create prices if provided
    if (prices && Array.isArray(prices) && prices.length > 0) {
      const pricePromises = prices.map(price => {
        return Price.create({
          card_id: newCard.id,
          condition: price.condition,
          cost_price: price.cost_price || 0,
          market_price: price.market_price || 0,
          quantity: price.quantity || 0,
          show_buy_price: price.show_buy_price || false,
          show_sell_price: price.show_sell_price || false
        });
      });

      await Promise.all(pricePromises);
    }

    // Get the card with prices
    const cardWithPrices = await Card.getById(newCard.id);

    res.status(201).json({
      status: 'success',
      data: cardWithPrices
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a card
 * @route PATCH /api/cards/:id
 */
exports.updateCard = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    
    // Check if card exists
    const existingCard = await Card.getById(cardId);
    if (!existingCard) {
      return next(new AppError('Card not found', 404));
    }

    // Update card
    const updatedCard = await Card.update(cardId, req.body);

    res.status(200).json({
      status: 'success',
      data: updatedCard
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a card
 * @route DELETE /api/cards/:id
 */
exports.deleteCard = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    
    // Check if card exists
    const existingCard = await Card.getById(cardId);
    if (!existingCard) {
      return next(new AppError('Card not found', 404));
    }

    // Delete card
    await Card.delete(cardId);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Bulk update cards
 * @route PATCH /api/cards/bulk
 */
exports.bulkUpdateCards = async (req, res, next) => {
  try {
    const { cards } = req.body;
    
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return next(new AppError('No cards provided for bulk update', 400));
    }

    const updatedCards = await Card.bulkUpdate(cards);

    res.status(200).json({
      status: 'success',
      data: updatedCards
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle price visibility for multiple cards
 * @route PATCH /api/cards/toggle-visibility
 */
exports.togglePriceVisibility = async (req, res, next) => {
  try {
    const { cardIds, showBuyPrice, showSellPrice } = req.body;
    
    if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0) {
      return next(new AppError('No card IDs provided', 400));
    }

    const toggleData = {};
    if (showBuyPrice !== undefined) toggleData.show_buy_price = showBuyPrice;
    if (showSellPrice !== undefined) toggleData.show_sell_price = showSellPrice;

    if (Object.keys(toggleData).length === 0) {
      return next(new AppError('No visibility options provided', 400));
    }

    await Card.togglePriceVisibility(cardIds, toggleData);

    res.status(200).json({
      status: 'success',
      message: `Visibility updated for ${cardIds.length} cards`
    });
  } catch (err) {
    next(err);
  }
};
