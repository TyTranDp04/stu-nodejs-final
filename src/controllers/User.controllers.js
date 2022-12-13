import { UserSchema } from "../schemas/User.schemas.js";
import { that } from "../middlewares/Upload.model.js";
import bcrypt from "bcrypt";

export const UserController = {
  searchUser: async (req, res) => {
    let result = await UserSchema.find({
      $or: [
        { Name: { $regex: req.params.key } },
        { Phone: { $regex: req.params.key } },
        { Address: { $regex: req.params.key } },
      ],
    });
    res.send(result);
  },

  get(req, res, next) {
    UserSchema.find({})
      .then((user) => {
        res.json(user);
      })
      .catch(next);
  },
  create(req, res) {
    const { body } = req;
    console.log(body);
    const data = {
      ...body,
      Password: "12345678",
      Avatar:
        "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",
      
    };
    const courses = new UserSchema(data);
    console.log(courses);
    courses
      .save()
      .then(() => res.redirect("/"))
      .catch((err) => {});
  },
  getDelete(req, res, next) {
    UserSchema.deleteOne({ _id: req.params.id })
      .then((course) => {
        res.json(course);
      })
      .catch(next);
  },
  showItem(req, res, next) {
    UserSchema.findByIdAndUpdate({ _id: req.params.id })
      .then((data) =>
        res.status(200).json({
          statusCode: 200,
          message: "Get data successfully",
          data: data,
          success: true,
        })
      )
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find id: ${req.params.id}.`,
        })
      );
  },
  update(req, res, next) {
    const { file, body } = req;
    if (file) {
      that.uploadFileDriver({ shared: true }, file).then((result) => {
        const formData = {
          ...body,
          Avatar: result.data.webContentLink,
        };
        UserSchema.updateOne({ _id: req.params.id }, formData)
          .then(() => res.redirect("/"))
          .catch((next) => {});
      });
    } else {
      UserSchema.updateOne({ _id: req.params.id }, body)
        .then(() => res.redirect("/"))
        .catch((next) => {});
    }
  },
};
