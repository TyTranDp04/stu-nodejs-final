import { UserSchema } from "../schemas/User.schemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const authController = {

  //Function
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        // isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },
  //LOGIN
  loginUser: async (req, res) => {
    try {
      
      const user = await UserSchema.findOne({ Gmail: req.body.Gmail });
      if (user ==="") {
        return res.status(402).json({
          statusCode: "402",
          message: "UserName is empty. UserName required",
          data: null,
          success: false,
        });
      }
      if (!user) {
        return res.status(400).json({
          statusCode: "400",
          message: "Incorrect UserName",
          data: null,
          success: false,
        });
      }
      const validPassword = await UserSchema.findOne({ Password: req.body.Password });
      if (validPassword === "") {
        return res.status(402).json({
          statusCode: "402",
          message: "Password is empty. Password required",
          data: null,
          success: false,
        });
      }
      if (!validPassword) {
        return res.status(400).json({
          statusCode: "400",
          message: "Incorrect Password",
          data: null,
          success: false,
        });
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        // res.cookie("accessToken", accessToken, {
        //   httpOnly: true,
        //   secure: false,
        //   path: "/",
        //   sameSite: "strict",
        // });
        const { password, ...others } = user._doc;
        return res.status(200).json({
          statusCode: "200",
          message: "Login Success",
          data: {
            accessToken: accessToken,
            user: {
              id: user.id,
              Gmail: user.Gmail,
              Name : user.Name,
              Avatar : user.Avatar,
              RoleID : user.RoleID,
            },
          },
          success: true,
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },


  //log out
  userLogout: async (req, res) => {
    res.clearCookie("accessToken");
    return res.status(200).json("logOut!")
  }
};



