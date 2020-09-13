module.exports = () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development') {
        require('dotenv').config();
    }

    if (!process.env.SESSION_SECRET)
        throw 'Environment variable "SESSION_SECRET" not provided...';
};