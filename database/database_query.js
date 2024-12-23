import { createPool } from 'mysql2';
import 'dotenv/config';

const pool = createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
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


export function checkIfUserEmailAndUsernameExists(email, username){
    const checkQuery = `
    SELECT * FROM users WHERE email = (?) OR username = (?);
    `;
    return new Promise((resolve, reject) => {
        pool.query(checkQuery, [email, username], (err, results) => {
            if (err) {
                console.error("Error getting Username:", err);
                return reject(err); // Reject the Promise on error
            }
            // Determine existence of email and username
            const emailExists = results.some((row) => row.email === email);
            const usernameExists = results.some((row) => row.username === username);

            resolve({ emailExists, usernameExists });
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

export function getUserFromDb(email, username){
    const getQuery = `
    SELECT * FROM users
    WHERE email = (?) OR username = (?);
    `;
    return new Promise((resolve, reject)=>{
        pool.query(getQuery,[email,username], (err,results)=>{
            if(err){
                console.error("Error getting user", err);
                return reject(err); //Reject the Promise on error
            }

            console.log("user retrived successfully:", results);
            resolve(results); //Resolve the Promise with results
        });
    });
}