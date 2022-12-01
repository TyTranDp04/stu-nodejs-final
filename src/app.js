import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import router from './routes/index.js';
import passport from 'passport';
import session from 'express-session';
import './middlewares/PassportGoogle.js';
// import passportGoogle from 'passport-google-oauth20';

// const GoogleStrategy = passportGoogle.Strategy;

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
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: "GET,POST,PATCH,DELETE",
  credentials: true,
}));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  })
)
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
app.get('/auth/google/callback', passport.authenticate('google'));

app.use(passport.initialize());

app.use(passport.session());
app.use(router);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Project Support'
  });
});

app.listen(port, (req, res) => {
  console.log(`Our server is live on http://localhost:${port}`);
});