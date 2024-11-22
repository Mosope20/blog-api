import express from 'express';
import { newUser, userLogin, newComment, deleteComment,viewAllPosts } from '../controllers/users.js';
import {newAdmin,adminLogin,creatPost} from '../controllers/admin.js';


const router = express.Router();

router.get('/',(req,res)=>{
    res.send('Hello from express');
})

router.post('/signup',newUser);

router.post('/login',userLogin);

router.post('/comment', newComment);

router.post('/delete_comment', deleteComment);

router.get('/posts', viewAllPosts);

//admin

router.post('/admin/signup',newAdmin);

router.post('/admin/login',adminLogin);

router.post('/admin/post_content',creatPost);

export default router;