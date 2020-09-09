const express = require('express');
const path = require('path');

const messagesAPI = require('./routes/api/messages');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.use('/api/messages', messagesAPI);

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));