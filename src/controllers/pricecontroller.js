const Price = require('../models/Price');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get all prices for a card
 * @route GET /api/prices/card/:cardId
 */
exports.getPricesByCardId = async (req, res, next) => {
  try {
    const prices = await Price.getByCardId(req.params.cardId);
    
    res.status(200).json({
      status: 'success',
      data: prices
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single price by ID
 * @route GET /api/prices/:id
 */
exports.getPriceById = async (req, res, next) => {
  try {
    const price = await Price.getById(req.params.id);
    
    if (!price) {
      return next(new AppError('Price record not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: price
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a price
 * @route PATCH /api/prices/:id
 */
exports.updatePrice = async (req, res, next) => {
  try {
    const priceId = req.params.id;
    
    // Validate input
    const { cost_price, market_price, quantity } = req.body;
    if (
      (cost_price !== undefined && (isNaN(cost_price) || cost_price < 0)) ||
      (market_price !== undefined && (isNaN(market_price) || market_price < 0)) ||
      (quantity !== undefined && (isNaN(quantity) || quantity < 0))
    ) {
      return next(new AppError('Invalid price or quantity values', 400));
    }

    const updatedPrice = await Price.update(priceId, req.body);

    res.status(200).json({
      status: 'success',
      data: updatedPrice
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new price record
 * @route POST /api/prices
 */
exports.createPrice = async (req, res, next) => {
  try {
    const { card_id, condition, cost_price, market_price, quantity } = req.body;

    // Validate required fields
    if (!card_id || !condition) {
      return next(new AppError('Card ID and condition are required', 400));
    }

    // Validate price and quantity
    if (
      (cost_price !== undefined && (isNaN(cost_price) || cost_price < 0)) ||
      (market_price !== undefined && (isNaN(market_price) || market_price < 0)) ||
      (quantity !== undefined && (isNaN(quantity) || quantity < 0))
    ) {
      return next(new AppError('Invalid price or quantity values', 400));
    }

    const newPrice = await Price.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newPrice
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Bulk update prices
 * @route PATCH /api/prices/bulk
 */
exports.bulkUpdatePrices = async (req, res, next) => {
  try {
    const { prices } = req.body;
    
    if (!prices || !Array.isArray(prices) || prices.length === 0) {
      return next(new AppError('No prices provided for bulk update', 400));
    }

    // Validate each price entry
    for (const price of prices) {
      if (!price.id) {
        return next(new AppError('Each price must have an ID', 400));
      }
      
      if (
        (price.cost_price !== undefined && (isNaN(price.cost_price) || price.cost_price < 0)) ||
        (price.market_price !== undefined && (isNaN(price.market_price) || price.market_price < 0)) ||
        (price.quantity !== undefined && (isNaN(price.quantity) || price.quantity < 0))
      ) {
        return next(new AppError(`Invalid price or quantity values for price ID ${price.id}`, 400));
      }
    }

    const updatedPrices = await Price.bulkUpdate(prices);

    res.status(200).json({
      status: 'success',
      data: updatedPrices
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle visibility of prices
 * @route PATCH /api/prices/toggle-visibility
 */
exports.togglePriceVisibility = async (req, res, next) => {
  try {
    const { priceIds, showBuyPrice, showSellPrice } = req.body;
    
    if (!priceIds || !Array.isArray(priceIds) || priceIds.length === 0) {
      return next(new AppError('No price IDs provided', 400));
    }

    const toggleData = {};
    if (showBuyPrice !== undefined) toggleData.show_buy_price = showBuyPrice;
    if (showSellPrice !== undefined) toggleData.show_sell_price = showSellPrice;

    if (Object.keys(toggleData).length === 0) {
      return next(new AppError('No visibility options provided', 400));
    }

    await Price.toggleVisibility(priceIds, toggleData);

    res.status(200).json({
      status: 'success',
      message: `Visibility updated for ${priceIds.length} price records`
    });
  } catch (err) {
    next(err);
  }
};
