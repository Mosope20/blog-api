import { createPool } from 'mysql2';
import 'dotenv/config';

const pool = createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONNECTIONLIMIT
})

export function viewAllBlogPosts(){
    const viewQuery =`
    SELECT * FROM blog_posts INNER JOIN user_comments ON blog_posts.postId = user_comments.postId;
    `;
    return new Promise((resolve,reject)=>{
        pool.query(viewQuery,(err, results)=>{
            if(err){console.log("error getting blog posts", err);
            return reject(err)
        }
        console.log("post gotten successfully:", results);
        resolve(results); // Resolve the Promise on success
        });
    });
}


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
            console.log("User added successfully:", results);
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

export function insertUserCommentsIntoDb(comment){
    const insertQuery = `INSERT INTO user_comments(commentId,userId,postId,comment,username)
    VALUES (?, ?, ?, ?, ?);`;

    return new Promise((resolve,reject)=>{
        pool.query(insertQuery,[comment.commentId, comment.userId, comment.postId, comment.comment, comment.username],(err,results)=>{
            if(err){
                console.error("Error inserting into user_comments:", err);
                return reject(err); //Reject the Promise on error
            }
            console.log("user comment uploaded successfully:", results);
            resolve(results); //Resolve the Promise with results
        });
    });
}

export function deleteUserCommentFromDb(commentId, postId, userId){
    const deleteQuery = `DELETE FROM user_comments WHERE commentId = (?) AND postId = (?) AND userId = (?)`;

    return new Promise((resolve,reject)=>{
        pool.query(deleteQuery,[commentId, postId, userId], (err,results)=>{
            if(err){
                console.error("Error deleting user comments", err);
                return reject(err);
            }
            console.log("user comment deleted successfully:", results);
            resolve(results);
        });
    });
}

export function updateUserUsernameFromDb(newUsername,username){
    const updateQuery = `UPDATE users SET username = (?) WHERE username = (?);`

    return new Promise((resolve,reject)=>{
        pool.query(updateQuery,[newUsername,username],(err,results)=>{
            if(err){
                console.error("Error updating username", err);
                return reject(err);
            }
            console.log("username updated successfully:", results);
            resolve(results);
        });
    });
}