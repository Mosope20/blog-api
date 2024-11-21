import express from 'express';
import { newUser, userLogin } from '../controllers/users.js';


const router = express.Router();

router.get('/',(req,res)=>{
    res.send('Hello from express');
})

router.post('/signup',newUser);

router.post('/login',userLogin);

export default router;