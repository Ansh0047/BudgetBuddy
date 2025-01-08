const express = require('express')
const Transaction = require('../models/transaction')
const passport = require('passport')
const router = express.Router()


// *************** FETCH ALL TRANSACTIONS OF A USER **************************
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({user: userId});
        res.json({transactions})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// ************* ADD NEW TRANSACTION *******************
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {

    // create a new transaction.
    try {
        const newTransaction = await Transaction.create({...req.body, user: req.user.id});
        res.json({newTransaction})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// *************** UPDATE EXISTING TRANSACTION *************************************************
router.patch('/:transactionId', passport.authenticate('jwt', {session: false}), async (req, res) => {

    try {
        // find note to update it.

        const existingTransaction = await Transaction.findById(req.params.transactionId);

        if(!existingTransaction) {
            // if note not found, return "NOT FOUND" error
            return res.status(404).json({ error: 'Not Found' });
        }

        if(existingTransaction.user.toString() !== req.user.id) {
            // if userId doesn't match with note's userId, don't allow to update it.
            return res.status(401).json({error: 'You are not allowed to update it.'})
        }

        // update the transaction.

        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.transactionId, {$set: req.body}, {new: true})
        
        res.json({updatedTransaction})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// *************** DELETE EXISTING TRANSACTION *************************************************
router.delete('/:transactionId', passport.authenticate('jwt', {session: false}), async (req, res) => {

    try {

        // find note to delete it.

        const existingTransaction = await Transaction.findById(req.params.transactionId);

        if(!existingTransaction) {
            // if transaction not found, return "NOT FOUND" error
            return res.status(404).json({ error: 'Not Found' });
        }

        if(existingTransaction.user.toString() !== req.user.id) {
            // if userId doesn't match with transaction's userId, don't allow to delete it.
            return res.status(401).json({error: 'You are not allowed to delete it.'})
        }

        // delete the note.
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.transactionId);
        res.json({message : "Transaction deleted successfully", deletedTransaction})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router