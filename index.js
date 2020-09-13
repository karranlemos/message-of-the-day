const express = require('express');
const app = express();

require('./config/env')();

require('./config/middlewares')(app);
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));