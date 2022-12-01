import { UserSchema } from "../schemas/User.schemas.js";

export const ChangePasswordController = {
  update(req, res, next) {
    try {
      const { body } = req;
      UserSchema.findById({ _id: req.params.id }).then((data) => {
        if (body.confirmPassword != "" || body.newPassword != "") {
          if (body.confirmPassword === body.newPassword) {
            if (body.oldPassword != "") {
              if (body.oldPassword != body.newPassword) {
                if (body.oldPassword === data.Password) {
                  UserSchema.updateOne(
                    { _id: req.params.id },
                    { Password: body.newPassword }
                  )

                    .then((data) =>
                      res.json({
                        statusCode: "200",
                        message: "Change Password Success",
                        success: true,
                      })
                    )
                    .catch((next) => {});
                } else {
                  return res.status(402).json({
                    statusCode: "402",
                    message: "Old password is incorrect !",
                    data: null,
                    success: false,
                  });
                }
              } else {
                return res.status(402).json({
                  statusCode: "402",
                  message: "New password and Old Password is not the same !",
                  data: null,
                  success: false,
                });
              }
            } else {
              return res.status(400).json({
                statusCode: "400",
                message: "Old password cannot be blank !",
                data: null,
                success: false,
              });
            }
          } else {
            return res.status(402).json({
              statusCode: "402",
              message: "New password and Confirm Password is not the same !",
              data: null,
              success: false,
            });
          }
        } else {
          return res.status(400).json({
            statusCode: "400",
            message: "New password and Confirm Password cannot be blank !",
            data: null,
            success: false,
          });
        }
      });
    } catch (error) {
      return res.status(500).json(err);
    }
  },
};
