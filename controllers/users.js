import express from 'express';
import {v4 as uuid4} from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import'dotenv/config';
import { checkIfUserEmailAndUsernameExists, insertNewUserIntoDb, getUserFromDb, insertUserCommentsIntoDb, deleteUserCommentFromDb} from '../database/database_query.js';
const saltRounds = 10;
import 'dotenv/config';

import { blogPosts } from './admin.js';
const users = [];
//const AllUserComments = [];

// const liveUser = [];

// export const blacklistedTokens = [];


export const newUser = async (req,res)=>{

    const {username,email,password} = req.body;
    if((!username && !password) && !email){return res.status(500).send("Username, email and password are required! ")};
    console.log(checkIfUserEmailAndUsernameExists(email,username));

    try{
        const { emailExists, usernameExists } = await checkIfUserEmailAndUsernameExists(email, username);

        if (emailExists && usernameExists) {
            return res.status(400).send('Email and Username already exist');
        } else if (emailExists) {
            return res.status(400).send('Email already exists');
        } else if (usernameExists) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const user = {id:uuid4(), username:username, email:email, password:hashedPassword, banned: false};
        const result = await insertNewUserIntoDb(user);
        if(result){return res.status(201).send(`Account with username ${user.username} successfully created`).redirect('/login')};
        // users.push(user);
        // res.status(201).send('Account Created!');
        // console.log(users)
    }
    catch(err){
        res.status(500).send('Error Creating Account!. Try Again Later.');
    }
}

export const userLogin = async(req,res)=>{

    const {email,username,password} = req.body;
    if((!email || !username) && !password){return res.status(500).send("Email/Username and password required");}
    
    try{
        const currentUser = await getUserFromDb(email, username);
        console.log(currentUser[0].banned);
        console.log(currentUser[0].userId);
        //const currentUser = users.find((user=>user.username === username)||(user=>user.email === email));
        if(currentUser[0].banned == 1){return res.status(500).send("Your Account Has been banned");}
        const isMatch = await bcrypt.compare(password,currentUser[0].password);

        if(isMatch){
            const accessToken = await jwt.sign({userId:currentUser[0].userId,username:currentUser[0].username, email: currentUser[0].email},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h'  });
            res.cookie('auth_token', accessToken, {
                httpOnly: true, // Prevent JavaScript from accessing the cookie
                secure: false,   // Ensures the cookie is sent only over HTTPS (set true in production)
                sameSite: 'Strict', // Prevents CSRF (use 'Lax' if requests come from other domains)
                maxAge: 3600000, // Cookie expiration in milliseconds (1 hour)
            });
            
            res.json({ message: `Welcome ${currentUser[0].username}` });
            }
            else{res.status(401).send('Incorrect password');}
    }
    catch(error){
        console.error('Error in login process:',error)
        res.status(500).send('Something went wrong');
    }
}



export const newComment = async(req,res)=>{
    const {comment,postId} = req.body;
    if(!comment){return res.status(500).send("You cannot send an empty comment");}

    const{username,userId} = req.user;
    try{
        
        const userComment = {commentId:uuid4(),comment:comment,userId:userId,username:username, postId:postId};

        const result = await insertUserCommentsIntoDb(userComment);

        
        if(result){res.status(201).send('comment successful');}
        
    }
    catch(error){
        console.error('Error in comment process:',error)
        res.status(500).send('Could not post comment');
    }
}

export const deleteComment = async(req,res)=>{
    const{postId, commentId} = req.body;
    
    const{username,email,userId} = req.user;
    try{
        const currentUser = await getUserFromDb(email, username);
        if(currentUser[0].banned == 1){return res.status(500).send("Your Account Has been banned");}

       const result = await deleteUserCommentFromDb(commentId, postId, userId);
       if(result){res.status(201).send('deleted successfully')};
    }
    catch(error){

    }

}

//all posts
export const viewAllPosts = (req,res)=>{
    if (blogPosts.length === 0) {
        return res.status(404).json({ message: 'No posts found' });
    }

    const allPosts = blogPosts.map(blogPost => blogPost.content);
    res.status(200).json(allPosts);
}