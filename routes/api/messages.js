const express = require('express');

const router = express.Router();



router.get('/', (req, res) => {
    res.status(400).json({
        message: 'Add a user id to the route.'
    });
});

router.get('/:id', (req, res) => {
    return res.json({
        id: 12,
        message: 'Make this day worth it!'
    });
});

router.post('/:id', (req, res) => {
    if (!req.body || !req.body.new_message)
        return res.status(400).json({
            message: "Must provide a JSON with a 'new_message'."
        });

    return res.json({
        message: 'Message added successfully.'
    });
})

router.put('/:id', (req, res) => {
    if (!req.body || !req.body.new_message) {
        return res.status(400).json({
            message: "Must provide a JSON with a 'new_message'."
        });
    }

    // TODO put new message
    
    return res.json({
        message: 'Message updated successfully.'
    });
})

router.delete('/:id', (req, res) => {
    return res.json({
        message: 'Current message deleted successfully.'
    });
});



module.exports = router;