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
    courses.save()
      .then(() => res.redirect('/'))
      .catch(err => {
      });
  },
  delete(req, res, next) {
    const { UserId, GroupId } = req.body
    console.log(UserId, GroupId)
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
                console.log("can't not find")
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
  addUserGroup(req, res){
    const { body } = req
    const form ={
      UserId: body?._id,
      GroupId: body?.GroupIdAdd,
      Name: body?.Name
    }
    const courses = new UserGroupSchema(form)
    courses.save()
    .then(()=>{
      const IdGroup = body?.GroupId
      IdGroup.push(body?.GroupIdAdd)
      UserSchema.updateOne({_id: body?._id }, {GroupId: IdGroup})
      .then((data)=>{
        res.status(200).json({
          statusCode: 200,
          message: "Get data for user successfully",
          data: data,
          success: true,
        })
      })
    })
    .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find id: ${body.UserId}.`,
        })
      );
  }
}

