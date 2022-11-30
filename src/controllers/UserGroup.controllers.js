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
  getDelete(req, res, next) {
    UserGroupSchema.deleteOne({ _id: req.params.id })
      .then(course => {
        res.json(course)
      })
      .catch(next)
  },
  update(req, res, next) {
    const { body } = req
    UserGroupSchema.updateOne({ _id: req.params.id }, body)
      .then(() => res.redirect('/'))
      .catch(next => {
      });
  }
}

