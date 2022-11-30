import { GroupSchema } from "../schemas/Group.schemas.js";


export const GroupController = {
  get(req, res, next) {
    GroupSchema.find({})
      .then(user => {
        res.json(user)
      })
      .catch(next)
  },
  create(req, res) {
    const { body } = req
    const courses = new GroupSchema(body)
    console.log(courses)
    courses.save()
      .then(() => res.redirect('/'))
      .catch(err => {
      });
  },
  getDelete(req, res, next) {
    GroupSchema.deleteOne({ _id: req.params.id })
      .then(course => {
        res.json(course)
      })
      .catch(next)
  },
  update(req, res, next) {
    const { body } = req
    GroupSchema.updateOne({ _id: req.params.id }, body)
      .then(() => res.redirect('/'))
      .catch(next => {
      });
  }
}

