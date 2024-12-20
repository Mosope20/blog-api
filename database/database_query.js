import { createPool } from 'mysql2';
import 'dotenv/config';

const pool = createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONNECTIONLIMIT
})
//work
// pool.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err);
//       return;
//     }
//     console.log('Connected to MySQL!');
//   });


export function checkIfUserUsernameExists(username){
    const checkQuery = `
    SELECT * FROM users WHERE username = (?);
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

export function checkIfUserEmailExists(email){
    const checkQuery = `
    SELECT * FROM users WHERE email = (?);
    `;
    return new Promise((resolve, reject) => {
        pool.query(checkQuery, [email], (err, results) => {
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

export function insertNewUserIntoDb(user){
    const insertQuery = `
    INSERT INTO users (userId, username, email, password, banned)
    VALUES (?, ?, ?, ?, ?);
    `;

    return new Promise((resolve, reject)=>{
        pool.query(insertQuery, [user.id, user.username, user.email, user.password, user.banned], (err,results)=>{
            if(err) {
                console.error("Error inserting into users:", err);
                return reject(err); //Reject the Promise on error
            }
            console.log("Seminar added successfully:", results);
            resolve(results); // Resolve the Promise on success
        });
    });
}

export function getUserFromDb(email){
    const getQuery = `
    SELECT * FROM users
    WHERE email = (?);
    `;
    return new Promise((resolve, reject)=>{
        pool.query(getQuery,email, (err,results)=>{
            if(err){
                console.error("Error getting user", err);
                return reject(err); //Reject the Promise on error
            }

            console.log("user retrived successfully:", results);
            resolve(results); //Resolve the Promise wirh results
        });
    });
}