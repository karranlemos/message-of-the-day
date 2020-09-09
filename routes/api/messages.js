const express = require('express');
const Messages = require('../../model/messages');

const router = express.Router();

const messages = Messages.getInstance();

router.get('/', (req, res) => {
    res.status(400).json({
        message: 'Add a user id to the route.'
    });
});

router.get('/:id', async (req, res) => {
    messages.getMessage(req.params.id)
        .then(message => {
            if (!message) {
                return res.status(404).json({
                    message: `Message from user of id ${req.params.id} not found.`
                });
            }
            return res.json({
                message: message
            });
        })
        .catch (error => {
            console.log('error');
            return res.status(500).json({
                message: "Couldn't fetch message."
            });
        })
    ;
});

router.post('/:id', (req, res) => {
    if (!req.body || !req.body.new_message)
        return res.status(400).json({
            message: "Must provide a JSON with a 'new_message'."
        });
    
    const id = req.params.id;
    const message = req.body.new_message;

    messages.createMessage(id, message)
        .then(data => {
            return res.status(201).json({
                message: "Message created successfully!"
            });
        })
        .catch(error => {
            if (error.code === 'ER_DUP_ENTRY')
                return res.status(400).json({
                    message: `Entry for user '${id}' already exists...`
                });
            
            return res.status(500).json({
                message: 'Could not post message'
            })
        })
    ;
})

router.put('/:id', (req, res) => {
    if (!req.body || !req.body.new_message) {
        return res.status(400).json({
            message: "Must provide a JSON with a 'new_message'."
        });
    }

    const id = req.params.id;
    const new_message = req.body.new_message;

    messages.updateMessage(id, new_message)
        .then(data => {
            if (data.affectedRows === 0)
                return res.status(404).json({
                    message: `Message of ID '${id}' not found...`
                });
            return res.json({
                message: "Message updated successfully!"
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: "Could not update message"
            });
        })
    ;
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    messages.deleteMessage(id)
        .then(data => {
            if (data.affectedRows === 0)
                return res.status(404).json({
                    message: `Message of ID '${id}' not found...`
                });
            return res.json({
                message: 'Current message deleted successfully.'
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: "Could not delete message."
            });
        })
    ;
});



module.exports = router;