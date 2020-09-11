const mysql = require('mysql');

const dbValues = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'message_of_the_day'
};

var dbSingleton;

class Database {    
    constructor() {        
        this.connection = mysql.createConnection(dbValues);
        this.connection.connect(err => {
            if (err)
                throw 'Could not connect to the database...';
            console.log('Connected to MySQL database...');
        });
    }

    query(sql, params, callback=undefined) {
        if (!callback) {
            callback = params;
            params = [];
        }
        this.connection.query(sql, params, callback);
    }

    static getInstance() {
        if (!dbSingleton)
            dbSingleton = new Database();
        return dbSingleton;
    }
}

module.exports = Database;