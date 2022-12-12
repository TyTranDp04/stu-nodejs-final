import { GroupSchema } from "../schemas/Group.schemas.js";
import { UserGroupSchema } from "../schemas/UserGroup.schemas.js";
import { UserSchema } from "../schemas/User.schemas.js";

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
    console.log(req.params.id)
    UserGroupSchema.deleteMany({ GroupId: req.params.id })
      .then(() => { })
    GroupSchema.deleteOne({ _id: req.params.id })
      .then(() => { })
    UserSchema.find({})
      .then((user) => {
        const GroupIdArray = []
        user?.map((e) => {
          if (e.GroupId.includes(req.params.id)) {
            e.GroupId?.map((id) => {
              if (id !== req.params.id && !GroupIdArray.includes(req.params.id)) {
                GroupIdArray.push(id)
              }
            })
            UserSchema.updateOne({ _id: e._id }, { GroupId: GroupIdArray })
              .then(() => {
              })
            console.log(GroupIdArray)
          }
        })
        res.status(200).json({
          statusCode: 200,
          message: "Notification Slack successfully",
          success: true,
        })
      })
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find id: ${req.params.id}.`,
        })
      );
  },
  update(req, res, next) {
    const { body } = req
    GroupSchema.updateOne({ _id: body.id }, body.Name)
      .then(() => res.redirect('/'))
      .catch(next => {
      });

  }
}

