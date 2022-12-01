import { UserSchema } from "../schemas/User.schemas.js";

export const ChangePasswordController = {
  update(req, res, next) {
    const { body } = req;
    console.log(body);
    UserSchema.findById({ _id: req.params.id }).then((data) => {
      console.log(data);
      if (body.confirmPassword === body.newPassword) {
        if (body.oldPassword === data.Password) {
          UserSchema.updateOne({ _id: req.params.id }, {Password : newPassword})
            .then(() => res.redirect("/"))

            .catch((next) => {});
        } else {
          return res.status(200).json("Old password is incorrect !");
        }
      } else {
        return res
          .status(200).json("New password and Confirm Password is not the same !");
      }
    });
  },
};
