const Database = require('./helpers/database');

const table = 'messages';

var messagesSingleton;

class Messages {
    
    constructor() {
        // throws async exception
        this.db = Database.getInstance();
    }

    getMessage(id) {
        return new Promise((resolve, reject) => {
            this.db.query(
                'SELECT user_id, message FROM ?? WHERE user_id = ?',
                [table, id],
                (err, rows, fields) => {
                    if (err)
                        return reject(err);
                    if (rows.length === 0)
                        return resolve(false);

                    return resolve(rows[0].message);
                }
            );
        });
    }

    createMessage(id, message) {
        return new Promise((resolve, reject) => {
            this.db.query(
                'INSERT INTO ?? (user_id, message) VALUES (?, ?)',
                [table, id, message],
                (err, data) => {
                    if (err)
                        return reject(err);
                    resolve(data);
                }
            );
        });
    }

    updateMessage(id, new_message) {
        return new Promise((resolve, reject) => {
            this.db.query(
                'UPDATE ?? SET message = ? WHERE user_id = ?',
                [table, new_message, id],
                (err, data) => {
                    if (err)
                        return reject(err);
                    
                    if (data.affectedRows > 0)
                        return resolve(data);
                    
                    this.createMessage(id, new_message)
                        .then(data => resolve(data))
                        .catch(err => reject(err))
                    ;
                }
            );
        });
    }

    deleteMessage(id) {
        return new Promise((resolve, reject) => {
            this.db.query(
                'DELETE FROM ?? WHERE user_id = ?',
                [table, id],
                (err, data) => {
                    if (err)
                        return reject(err);
                    resolve(data);
                }
            );
        });
    }

    static getInstance() {
        if (!messagesSingleton)
            messagesSingleton = new Messages()
        return messagesSingleton;
    }
}

module.exports = Messages;