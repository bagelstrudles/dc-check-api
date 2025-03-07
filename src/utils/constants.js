/**
 * Constants used throughout the application
 */

// Card condition types
exports.CARD_CONDITIONS = {
  UNGRADED: 'Ungraded',
  PSA_1: 'PSA 1',
  PSA_2: 'PSA 2',
  PSA_3: 'PSA 3',
  PSA_4: 'PSA 4',
  PSA_5: 'PSA 5',
  PSA_6: 'PSA 6',
  PSA_7: 'PSA 7',
  PSA_8: 'PSA 8',
  PSA_9: 'PSA 9',
  PSA_10: 'PSA 10',
  CGC_10: 'CGC 10',
  BGS_10: 'BGS 10',
  BGS_10_BL: 'BGS 10 BL',
  CGC_10_PR: 'CGC 10 PR'
};

// Card categories
exports.CARD_CATEGORIES = {
  POKEMON: 'Pokemon',
  MAGIC: 'Magic: The Gathering',
  YUGIOH: 'Yu-Gi-Oh!',
  SPORTS: 'Sports',
  OTHER: 'Other'
};

// Featured conditions to always display
exports.FEATURED_CONDITIONS = [
  'Ungraded',
  'PSA 10',
  'BGS 10 BL',
  'CGC 10 PR'
];

// Pricing calculation constants
exports.PRICING = {
  MIN_PROFIT_MARGIN: 0.3, // 30%
  COST_MULTIPLIER: 1.45,
  MARKET_SALE_MULTIPLIER: 1.05,
  MARKET_BUY_MULTIPLIER: 0.75,
  NO_COST_MULTIPLIER: 1.1
};

// User roles
exports.USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};
