import express from 'express';
import { newUser, userLogin, newComment, deleteComment,viewAllPosts } from '../controllers/users.js';
import {newAdmin,adminLogin,createPost, deletePost} from '../controllers/admin.js';


const router = express.Router();

router.get('/',(req,res)=>{
    res.send('Hello from express');
})

router.post('/signup',newUser);

router.post('/login',userLogin);

router.post('/comment', newComment);

router.post('/deleteComment', deleteComment);

router.get('/posts', viewAllPosts);

//admin

router.post('/admin/signup',newAdmin);

router.post('/admin/login',adminLogin);

router.post('/admin/postContent',createPost);

router.delete('/admin/deletePost', deletePost);

export default router;