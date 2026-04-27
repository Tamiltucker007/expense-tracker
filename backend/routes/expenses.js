const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

// All routes are protected with auth middleware
router.post('/', auth, createExpense);
router.get('/', auth, getExpenses);
router.get('/:id', auth, getExpense);
router.put('/:id', auth, updateExpense);
router.delete('/:id', auth, deleteExpense);

module.exports = router;