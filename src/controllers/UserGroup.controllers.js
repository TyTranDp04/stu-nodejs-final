import { UserSchema } from "../schemas/User.schemas.js";
import { UserGroupSchema } from "../schemas/UserGroup.schemas.js";
import dotenv from 'dotenv'
dotenv.config()
const LINK_URL_API = process.env.LINK_URL_API
import axios from 'axios';

export const UserGroupController = {
  get(req, res, next) {
    UserGroupSchema.find({})
      .then((data) =>
        res.status(200).json({
          statusCode: 200,
          message: "Get user group successfully",
          data: data,
          success: true,
        }))
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't get.`,
        })
      );
  },
  create(req, res) {
    const { body } = req
    const courses = new UserGroupSchema(body)
    courses.save()
      .then((data) =>
        res.status(200).json({
          statusCode: 200,
          message: "Create data user group successfully",
          data: data,
          success: true,
        }))
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find.`,
        })
      );
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
                    UserSchema.updateOne({ _id: UserId }, { GroupId: GroupIdArray })
                      .then(() => {
                        res.status(200).json({
                          statusCode: 200,
                          message: "delete user group successfully",
                          success: true,
                        })
                      }).catch(() =>
                      res.status(404).json({
                        success: false,
                        message: `Can't find id: ${UserId}.`,
                      })
                    );
                  })
              })
          }
        })
      })
  },
  update(req, res, next) {
    const { body } = req
    UserGroupSchema.updateOne({ _id: req.params.id }, body)
      .then((data) =>
        res.status(200).json({
          statusCode: 200,
          message: "update user group successfully",
          data: data,
          success: true,
        }))
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find id: ${req.params.id}.`,
        })
      );
  },
  addUserGroup(req, res) {
    const { body } = req
    const form = {
      UserId: body?._id,
      GroupId: body?.GroupIdAdd,
      Name: body?.Name
    }
    const courses = new UserGroupSchema(form)
    courses.save()
      .then(() => {
        const formNoti = {
          Status: 6,
          UserId: body?._id,
          GroupId: body?.GroupIdAdd,
        }
        axios.post(LINK_URL_API + '/notification', formNoti)
        const IdGroup = body?.GroupId
        IdGroup.push(body?.GroupIdAdd)
        UserSchema.updateOne({ _id: body?._id }, { GroupId: IdGroup })
          .then((data) => {
            res.status(200).json({
              statusCode: 200,
              message: "add user group successfully",
              data: data,
              success: true,
            })
          })
      })
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find id: ${body?._id}.`,
        })
      );
  }
}

