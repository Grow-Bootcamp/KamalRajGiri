const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'List of users'
    });
});

router.get('/:id', (req, res) => {
    res.json({
        message: 'User details',
        id: req.params.id
    });
});

router.post('/', (req, res) => {
    res.status(201).json({
        message: 'User created',
        user: req.body
    });
});

module.exports = router;