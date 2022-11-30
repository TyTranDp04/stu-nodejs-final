import { auth } from 'google-auth-library';
import jwt from 'jsonwebtoken'

export const middlewareController = {
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers.authorization.replace('Bearer','').trim();
      if (token) {
        jwt.verify(token,process.env.JWT_ACCESS_KEY, (err, user) => {
          if (err) {
            return res.status(403).json("Token is not valid!");
          }
          req.user = user; 
          next();
        });
      } else {
        return res.status(401).json("You're not authenticated");
      }
    } catch (error) {
      // req.direct('http://localhost:5035/login')
      return res.status(401).json("You're not authenticated");
    }


  }
}
