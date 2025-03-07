const express = require('express');
const {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  bulkUpdateCards,
  togglePriceVisibility
} = require('../controllers/cardController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllCards);
router.get('/:id', getCardById);

// Protected routes - admin only
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createCard);
router.patch('/:id', updateCard);
router.delete('/:id', deleteCard);
router.patch('/bulk/update', bulkUpdateCards);
router.patch('/bulk/toggle-visibility', togglePriceVisibility);

module.exports = router;
