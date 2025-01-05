import express from 'express';
import { newUser, userLogin, newComment, deleteComment,viewAllPosts, updateUser} from '../controllers/users.js';
import {newAdmin,adminLogin,createPost, deletePost} from '../controllers/admin.js';
import { authenticateToken } from '../middlewares/authmiddleware.js';


const router = express.Router();

router.get('/',(req,res)=>{
    res.send('Hello from express');
})

//users

router.post('/signup',newUser);

router.post('/login',userLogin);

router.post('/comment',authenticateToken, newComment);

router.post('/deleteComment',authenticateToken, deleteComment);

router.get('/posts', viewAllPosts);

router.get('/update', authenticateToken, updateUser)

//admin

router.post('/admin/signup',newAdmin);

router.post('/admin/login',adminLogin);

router.post('/admin/postContent',createPost);

router.delete('/admin/deletePost', deletePost);

export default router;

