import jwt from 'jsonwebtoken'

export const middlewareController = {
  verifyToken: (req, res, next) => {
    //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
    try {
      const token = req.headers.cookie.slice(12);
      if (token) {
        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
          if (err) {
            return res.status(403).json("Token is not valid!");
          }
          req.user = user;
          next();
        });
      } else {
        return res.status(401).json("You're not authenticated ");
      }
    } catch (error) {
      return res.status(401).json("You're not authenticated");
    }


  }
}
