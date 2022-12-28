import { UserSchema } from "../schemas/User.schemas.js"
import { that } from "../middlewares/Upload.model.js"
import { UserGroupSchema } from "../schemas/UserGroup.schemas.js";

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
        const configUser = user.map(item => ({
          _id: item?._id,
          RoleId: item?.RoleId,
          Avatar: item?.Avatar,
          Name: item?.Name,
          GroupId: item?.GroupId,
          Gmail: item?.Gmail,
          Address: item?.Address,
          Phone: item?.Phone,
          isDeleted: item?.isDeleted,
          deleteAt: item?.deleteAt,
          createdAt: item?.createdAt,
          updateAt: item?.updateAt,
        }))
        res.json(configUser);
      })
      .catch(next);
  },
  getone(req, res, next) {
    UserSchema.findOne({ _id: req.params.id })
      .then(user => {
        res.json(user)
      })
      .catch(next)
  },
  create(req, res) {
    const { body } = req;
    const data = {
      ...body,
      Password: "123456",
      Avatar: null
        // "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg",

    };
    const courses = new UserSchema(data);
    courses
      .save()
      .then(() => res.redirect("/"))
      .catch((err) => { });
  },
  getDelete(req, res, next) {
    UserSchema.deleteOne({ _id: req.params.id })
      .then((course) => {
        res.json(course);
      })
      .catch(next);
  },
  DeleteGroupuser(req, res, next) {
    UserSchema.deleteOne({ _id: req.params.id })
    .then((course) => {
      UserGroupSchema.deleteMany({ UserId: req.params.id })
      .then((course) => {
        res.json("ok ");
      })
      .catch(next); 
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
          .catch((next) => { });
      });
    } else {
      UserSchema.updateOne({ _id: req.params.id }, body)
        .then(() => res.redirect("/"))
        .catch((next) => { });
    }
  },
  updateProfile(req, res, next) {
    const { file, body } = req    
    if (file) {
      that.uploadFileDriver({ shared: true }, file)
        .then(result => {
          const formData = {
            ...body,
            Avatar: result?.data?.webContentLink
          }
          UserSchema.updateOne({ _id: req.params.id }, formData)
            .then((response) => {
              res.json(formData)
            })
            .catch(next => {
            });
        })
    } else {
      const body1 = {
        ...body,
        Avatar: "https://drive.google.com/uc?id=1txw0Dakn-jSwxtWGym8brACeBYCQiDOx&export=download"
      }
      UserSchema.updateOne({ _id: req.params.id }, body1)
        .then(() => res.redirect('/'))
        .catch(next => {
        });
    }
  }
};
