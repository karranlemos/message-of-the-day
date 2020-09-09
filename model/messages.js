const Database = require('./database');

const table = 'messages';

var messagesSingleton;

class Messages {
    
    constructor() {
        // throws async exception
        this.db = Database.getInstance();

        this.checkTable();
    }

    checkTable() {
        this.db.query(
            `SHOW TABLES LIKE '${table}'`,
            (err, results) => {
                if (err)
                    throw `Could not check '${table}'...\n\n${err}`;
                if (results.length === 0)
                    throw `Table ${table} doesn't exist.`;
            }
        );
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