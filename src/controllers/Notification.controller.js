import { NotificationDayOffSchema } from '../schemas/Notification.Schemas.js'
import { UserGroupSchema } from '../schemas/UserGroup.schemas.js';
import { UserSchema } from '../schemas/User.schemas.js';
import dotenv from 'dotenv'
import {SlackBot} from '../services/SlackBot.services.js'
dotenv.config()
const LINK_URL_CHANNEL_DAYOFF = process.env.LINK_URL_CHANNEL_DAYOFF
const LINK_URL_CHANNEL_HR = process.env.LINK_URL_CHANNEL_HR
const LINK_URL_CHANNEL_GENERAL = process.env.LINK_URL_CHANNEL_HR

export const NotificationController = {
  get(req, res, next) {
    UserSchema.find({ _id: req.params.id })
      .then((groupId) => {
        UserGroupSchema.find({})
          .then((data) => {
            let arrayIdUserNoti = []
            const newData = data.filter(function (e) {
              return groupId[0].GroupId?.includes(e.GroupId)
            })
            newData.map((e) => {
              arrayIdUserNoti.push(e.UserId)
            })
            NotificationDayOffSchema.find({IsRead: 0})
              .then((data) => {
                const Data = data.filter(function (e) {
                  return arrayIdUserNoti.includes(e.UserId)
                })
                res.status(200).json({
                  statusCode: 200,
                  message: "Get data for master successfully",
                  data: Data,
                  success: true,
                })
              })
          })
          .catch(() =>
            res.status(404).json({
              success: false,
              message: `Can't find data.`,
            })
          );
      })
  },
  update(req, res, next) {
    NotificationDayOffSchema.updateOne({ _id: req.params.id }, { IsRead: true })
      .then(data => {
        res.status(200).json({
          statusCode: 200,
          message: "Get data for master successfully",
          data: data,
          success: true,
        })
      })
      .catch(next)
  },
  upload(req, res, next) {
    const { body } = req
    const coursesNoti = new NotificationDayOffSchema(body)
    coursesNoti.save()
      .then((data) => {
        SlackBot(LINK_URL_CHANNEL_HR,body)
        res.status(200).json({
          statusCode: 200,
          message: "Notification Slack successfully",
          data: data,
          success: true,
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

