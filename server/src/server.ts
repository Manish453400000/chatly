import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config({
  path: "./.env",
});

const app = express();

const PORT = process.env.PORT || 8000;


app.use(express.json());
app.use(cors())


const start = async () => {
  try{
    //connect to database first
    app.listen(PORT, () => {
      console.log(`server listening on http://localhost:${PORT}`);
      
    })
  }catch(err){
    console.log(`somthing went wrong while starting server: ${err}`);
  }
}