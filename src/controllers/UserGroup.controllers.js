import { UserSchema } from "../schemas/User.schemas.js";
import { UserGroupSchema } from "../schemas/UserGroup.schemas.js";

export const UserGroupController = {
  get(req, res, next) {
    UserGroupSchema.find({})
      .then(user => {
        res.json(user)
      })
      .catch(next)
  },
  create(req, res) {
    const { body } = req
    const courses = new UserGroupSchema(body)
    console.log(courses)
    courses.save()
      .then(() => res.redirect('/'))
      .catch(err => {
      });
  },
  delete(req, res, next) {
    const { UserId, GroupId } = req.body
    UserGroupSchema.find({ GroupId: GroupId })
      .then(course => {
        course?.map((e) => {
          if (e.UserId === UserId) {
            UserGroupSchema.deleteOne({ _id: e._id })
              .then(() => {
                UserSchema.find({ _id: UserId })
                  .then((user) => {
                    const GroupIdArray = []
                    user[0]?.GroupId?.map((e) => {
                      if (e !== GroupId) {
                        GroupIdArray.push(e)
                      }
                    })
                    console.log(GroupIdArray)
                    UserSchema.updateOne({ _id: UserId}, {GroupId: GroupIdArray})
                    .then(()=>{
                      res.redirect('/')
                    })
                  })
              })
              .catch(next => {
              });
          }
        })
      })
      .catch(next)
  },
  update(req, res, next) {
    const { body } = req
    UserGroupSchema.updateOne({ _id: req.params.id }, body)
      .then(() => res.redirect('/'))
      .catch(next => {
      });
  },
}

