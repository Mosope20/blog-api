import express from 'express';
import {v4 as uuid4} from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import'dotenv/config';
import { checkIfUserUsernameExists, checkIfUserEmailExists, insertNewUserIntoDb, getUserFromDb} from '../database/database_query.js';
const saltRounds = 10;

import { blogPosts } from './admin.js';
const users = [];
//const AllUserComments = [];

export const blacklistedTokens = [];


export const newUser = async (req,res)=>{

    const {username,email,password} = req.body;
    if((!username && !password) && !email){return res.status(500).send("Username, email and password are required! ")};

    console.log(checkIfUserUsernameExists(username));
    const existingUsername = await checkIfUserUsernameExists(username);
    if(existingUsername){return res.status(400).send('Username already exists')};

    console.log(checkIfUserUsernameExists(email));
    const existingEmail = await checkIfUserEmailExists(email);
    if(existingEmail){return res.status(400).send('Email already exists')};

    try{
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const user = {id:uuid4(), username:username, email:email, password:hashedPassword, banned: false};
        const result = await insertNewUserIntoDb(user);
        if(result){return res.status(201).send(`Account with username ${user.username} successfully created`)};
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
    const currentUser = getUserFromDb(email);
    //const currentUser = users.find((user=>user.username === username)||(user=>user.email === email));
    if(currentUser.banned == true || 1){return res.status(500).send("Your Account Has been banned");}
    try{
        const isMatch = await bcrypt.compare(password,currentUser.password);

        if(isMatch){
            const accessToken = jwt.sign({id:currentUser.id,username:currentUser.username},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h'  });
        res.json({message: `Welcome ${currentUser.username}`,
        accessToken});
            }
            else{res.status(401).send('Incorrect password');}
    }
    catch(error){
        console.error('Error in login process:',error)
        res.status(500).send('Something went wrong');
    }
}



export const newComment = async(req,res)=>{
    const {comment,postId,id} = req.body;
    if(!comment){return res.status(500).send("You cannot send an empty comment");}

    const existingUser = users.find(user=> user.id === id);
    const currentPost = blogPosts.find(post=> post.postId === postId);

    try{
        
        const comment = {comment: comment,userId:existingUser.id,username:existingUser.username};

        if (!blogPost.comments[userId]) {
            blogPost.comments[userId] = [];
        }

        currentPost.comments[postId].push(comment);
        
        res.status(201).send('comment successful');
        
        
        // const comment = {postId:postId,comments:{comment:AllUserComments.userComment,username:AllUserComments.userName}}
        // blogPosts.push(blogPost);
        

        // const userComment = {postId:postId,comment:comment,userDetails:{
        //     userId:existingUser.id, userName:existingUser.username
        // }}
        2
        // AllUserComments.push(userComment);
    }
    catch(error){
        res.status(500).send('Could not post comment');
    }
}

export const deleteComment = async(req,res)=>{
    const{postId} =req.body;
    const existingUser = users.find(user=> user.username === username);
    try{
        if(comment.userDetails.userId === existingUser.id)
        {const commentToDDelete = AllUserComments.find(comment => (comment.postId === postId && comment.userDetails.userId));}
        AllUserComments.pop(commentToDDelete);
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