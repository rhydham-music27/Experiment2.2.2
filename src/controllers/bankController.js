const Account = require('../models/Account');

// @desc    Get current user's account details
// @route   GET /api/bank/account
// @access  Private
exports.getAccount = async (req, res, next) => {
    try {
        // Find account associated with the logged-in user
        const account = await Account.findOne({ user: req.user.id });

        if (!account) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        res.status(200).json({
            success: true,
            data: account,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// @desc    Deposit money
// @route   PUT /api/bank/deposit
// @access  Private
exports.deposit = async (req, res, next) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Please provide a valid amount' });
    }

    try {
        const account = await Account.findOne({ user: req.user.id });

        if (!account) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        account.balance += amount;
        await account.save();

        res.status(200).json({
            success: true,
            data: account,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};
