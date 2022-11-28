import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import router from './routes/index.js';


dotenv.config();
const port = process.env.PORT || 3636;

try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected successfully to MongoDB");
} catch (error) {
  console.log(error);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());


app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Project Support'
  });
});
app.use(router);

app.listen(port, (req, res) => {
  console.log(`Our server is live on http://localhost:${port}`);
});