import { GroupSchema } from "../schemas/Group.schemas.js";
import { UserGroupSchema } from "../schemas/UserGroup.schemas.js";


export const GroupController = {
  get(req, res, next) {
    GroupSchema.find({})
      .then(data => {
        res.status(200).json({
          statusCode: 200,
          message: "Get data for user successfully",
          data: data,
          success: true,
        })
      })
      .catch(next)
  },
  create(req, res) {
    const { body } = req
    const courses = new GroupSchema(body)
    courses.save()
      .then((data) => {
        res.status(200).json({
          statusCode: 200,
          message: "Get data for user successfully",
          data: data,
          success: true,
        })
      })
      .catch(err => {
      });
  },
  delete(req, res, next) {
    UserGroupSchema.deleteMany({ GroupId: req.params.id })
      .then(() => {
        GroupSchema.deleteOne({ _id: req.params.id })
          .then((data) =>
            res.status(200).json({
              statusCode: 200,
              message: "Get data for user successfully",
              data: data,
              success: true,
            }))
      })
      .catch(next)
  },
  update(req, res, next) {
    const { body } = req
    GroupSchema.updateOne({ _id:body.id }, body.Name)
      .then(() => res.redirect('/'))
      .catch(next => {
      });

  }
}

