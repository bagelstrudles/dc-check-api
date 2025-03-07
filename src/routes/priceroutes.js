const express = require('express');
const {
  getPricesByCardId,
  getPriceById,
  createPrice,
  updatePrice,
  bulkUpdatePrices,
  togglePriceVisibility
} = require('../controllers/priceController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/card/:cardId', getPricesByCardId);
router.get('/:id', getPriceById);

// Protected routes - admin only
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createPrice);
router.patch('/:id', updatePrice);
router.patch('/bulk/update', bulkUpdatePrices);
router.patch('/bulk/toggle-visibility', togglePriceVisibility);

module.exports = router;
