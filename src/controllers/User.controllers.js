import { UserSchema } from "../schemas/User.schemas.js";
import { that } from "../middlewares/Upload.model.js"


export const UserController = {
    get(req,res,next){
        UserSchema.find({})
        .then(user => {
            res.json(user)
        })
        .catch(next)
    },
    create(req, res) {
        const { body, file } = req
        if (file) {
          that.uploadFileDriver({ shared: true }, file)
            .then(result => {
              const formData = {
                ...body,
                Avatar: result.data.webContentLink
              }
              const courses = new UserSchema(formData)
              courses.save()
                // .then(() => res.redirect('/'))
                // .catch(err => {
                // });
            })
        } else {
          const courses = new UserSchema(body)
          console.log(courses)
          courses.save()
            .then(() => res.redirect('/'))
            .catch(err => {
            });
        }
    
      },
      getDelete(req, res, next) {
        UserSchema.deleteOne({ _id: req.params.id })
          .then(course => {
            res.json(course)
          })
          .catch(next)
      },
      update(req, res, next) {
        const { file, body } = req
        if (file) {
          that.uploadFileDriver({ shared: true }, file)
            .then(result => {
              const formData = {
                ...body,
                Avatar: result.data.webContentLink
              }
              UserSchema.updateOne({ _id: req.params.id }, formData)
                .then(() => res.redirect('/'))
                .catch(next => {
                });
            })
        } else {
          UserSchema.updateOne({ _id: req.params.id }, body)
            .then(() => res.redirect('/'))
            .catch(next => {
            });
        }
      }
}

 