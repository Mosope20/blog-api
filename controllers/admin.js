import express from 'express';
import {v4 as uuid4} from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import'dotenv/config';
const saltRounds = 10;

export const blogPosts = [];
const admins = [];



export const newAdmin = async (req,res)=>{

    const {username,email,password} = req.body;
    if((!username && !password) && !email){return res.status(500).send("Username, email and password are required! ")};

    const existingUsername = admins.find(admin=> admin.username === username);
    if(existingUsername){return res.status(400).send('Username already exists')};

    const existingEmail = admins.find(admin=> admin.email === email);
    if(existingEmail){return res.status(400).send('Email already exists')};

    try{
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const admin = {id:uuid4(), username:username, email:email, password:hashedPassword}
        admins.push(admin);
        res.status(201).send('Account Created!');
    }
    catch(err){
        res.status(500).send('Error Creating Account!');
    }
}


export const adminLogin = async(req,res)=>{

    const {email,username,password} = req.body;
    if((!email || !username) && !password){return res.status(500).send("Email/Username and password required");}

    const currentUser = admins.find(user=>user.email === email);
    //console.log(currentUser);
    if(!email){return res.status(500).send("Incorrect Username");}
    try{
        const isMatch = await bcrypt.compare(password,currentUser.password);

        if(isMatch){
            const accessToken = jwt.sign({id:currentUser.id,username:currentUser.username},process.env.ACCESS_TOKEN_SECRET2,{ expiresIn: '1h'  });
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

export const createPost = async(req,res)=>{
    const{content} = req.body;
    if(!content){return res.status(500).send("content cannot be empty");}
    
    try{
    const blogContent = {postId:uuid4(), content:content, comments: {}};
     
    blogPosts.push(blogContent);
    console.log(blogPosts);
    res.status(201).send(blogContent);
    }
    catch(error){
        res.status(500).send('Something went wrong');
    }
}

export const deletePost = async(req,res)=>{
    const{postId} = req.body;
     
    try{
        const postIndex = blogPosts.findIndex(post => post.postId === postId);

        if (postIndex === -1) {
            return res.status(404).send('Post not found');
        }

        // Remove the post from the array
        blogPosts.splice(postIndex, 1);

        console.log(blogPosts); // For debugging

        res.status(200).send('Post successfully deleted');
    }

        catch(error){
            res.status(500).send('Something went wrong');
        }
}