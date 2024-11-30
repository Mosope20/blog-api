import { createPool } from 'mysql2';
import 'dotenv/config';

const pool = createPool({
    host: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONNECTIONLIMIT
})


export function checkIfUserUsernameExists(username){
    const checkQuery = `
    SELECT title FROM users WHERE username = (?);
    `;
    return new Promise((resolve, reject) => {
        pool.query(checkQuery, [username], (err, results) => {
            if (err) {
                console.error("Error getting Username:", err);
                return reject(err); // Reject the Promise on error
            }
            const exists = results.length > 0;
            console.log("Username exists:", exists);
            resolve(exists); // Resolve with true or false
        });
    });
}