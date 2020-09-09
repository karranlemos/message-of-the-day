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
                        return reject(String(err));
                    if (rows.length === 0)
                        return resolve(false);

                    if (!rows[0].message)
                        return reject('Missing content');
                    return resolve(rows[0].message);
                }
            )
        });
    }

    static getInstance() {
        if (!messagesSingleton)
            messagesSingleton = new Messages()
        return messagesSingleton;
    }
}

module.exports = Messages;