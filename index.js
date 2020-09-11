if (process.env.NODE_ENV.trim() === 'development') {
    require('dotenv').config();
}

const express = require('express');
const app = express();

require('./config/middlewares')(app);
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));