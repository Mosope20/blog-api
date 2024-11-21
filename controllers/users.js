import express from 'express';
import {v4 as uuid4} from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import'dotenv/config';
const saltRounds = 10;


const users = [];
export const blacklistedTokens = [];


export const newUser = async (req,res)=>{

    const {username,email,password} = req.body;
    if(!username && !password && !email){return res.status(500).send("Username, email and password are required! ")};

    const existingUsername = users.find(user=> user.username === username);
    if(existingUsername){return res.status(400).send('Username already exists')};

    const existingEmail = users.find(user=> user.email === email);
    if(existingEmail){return res.status(400).send('Email already exists')};

    try{
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const user = {id:uuid4(), username:username, email:email, password:hashedPassword}
        users.push(user);
        res.status(201).send('Account Created!');
        console.log(users)
    }
    catch(err){
        res.status(500).send('Error Creating Account!');
    }
}

export const userLogin = async(req,res)=>{

    const {email,username,password} = req.body;
    if((!email || !username) && !password){return res.status(500).send("Email/Username and password required");}

    const currentUser = users.find((user=>user.username === username)||(user=>user.email === email));
    try{
        const isMatch = await bcrypt.compare(password,currentUser.password);

        if(isMatch){
            const accessToken = jwt.sign({id:currentUser.id,username:currentUser.username},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h'  });
        res.json({message: `Welcome ${currentUser.username}`,
        accessToken});
            }
            else{res.status(401).send('Incorrect details');}
    }
    catch(error){
        console.error('Error in login process:',error)
        res.status(500).send('Something went wrong');
    }
}


