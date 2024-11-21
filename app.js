import express from 'express';
import userRoutes from './routes/route.js'
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('',userRoutes);


app.listen(PORT, ()=> console.log(`server is running on http://localhost:${PORT}`));