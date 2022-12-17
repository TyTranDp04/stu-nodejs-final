import { UserSchema } from "../schemas/User.schemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Helper } from "../helper/index.js";
import { ChangePasswordService } from "../services/ChangePassword.services.js";

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
    const passwordInput = req.body.Password;
    try {
      const user = await UserSchema.findOne({ Gmail: req.body.Gmail });
      const validPassword = user?.Password;

      if (!user || passwordInput !== validPassword) {
        return res.status(400).json({
          statusCode: "400",
          message: "Username or Password is incorrect",
          data: null,
          success: false,
        });
      } else {
        const accessToken = authController.generateAccessToken(user);
        return res.status(200).json({
          statusCode: "200",
          message: "Login Success",
          data: {
            accessToken: accessToken,
            user: {
              id: user.id,
              Gmail: user.Gmail,
              Name: user.Name,
              Avatar: user.Avatar,
              RoleId: user.RoleId,
              GroupId: user.GroupId,
              Password: user.Password
            },
          },
          success: true,
        });
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },

  //log out
  userLogout: async (req, res) => {
    res.clearCookie("accessToken");
    return res.status(200).json("logOut!")
  },

  update(request, response) {
    const id = request.params;
    const updateObj = request.body;
    ChangePasswordService.update({ _id: id }, { $set: updateObj })
      .then((data) => {
        Helper.responseJsonHandler(data, null, response);
      })
      .catch((error) => {
        Helper.responseJsonHandler(null, error, response);
      });
  },
};



