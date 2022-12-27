import { NotificationDayOffSchema } from '../schemas/Notification.Schemas.js'
import { UserGroupSchema } from '../schemas/UserGroup.schemas.js';
import { UserSchema } from '../schemas/User.schemas.js';
import dotenv from 'dotenv'
import { SlackBot } from '../services/SlackBot.services.js'
dotenv.config()
const LINK_URL_CHANNEL_DAYOFF = process.env.LINK_URL_CHANNEL_DAYOFF
const LINK_URL_CHANNEL_HR = process.env.LINK_URL_CHANNEL_HR

export const NotificationController = {
  get(req, res, next) {
    console.log(req.params.id)
    const idUser = req.params.id
    NotificationDayOffSchema.find({})
      .then(data => {
        const dataNoti = data.filter(function (noti) {
          return noti.UserRead.includes(idUser)
        })
        res.json({
          statusCode: 200,
          message: "Get data for master successfully",
          data: dataNoti,
          success: true,
        })
      }
      )
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find data.`,
        })
      );

  },
  update(req, res, next) {
    const { UserRead, NotifyId } = req.body;
    const newArrayUserRead = []
    NotificationDayOffSchema.find({ _id: NotifyId })
      .then(data => {
        const arrayUserRead = data[0]?.UserRead;
        arrayUserRead?.map((e) => {
          if (e !== UserRead) {
            newArrayUserRead.push(e)
          }
        })
        NotificationDayOffSchema.updateOne({ _id: NotifyId }, { UserRead: newArrayUserRead })
          .then(data => {
            if (arrayUserRead?.length === 1) {
              NotificationDayOffSchema.deleteOne({ _id: NotifyId })
                .then(() => {
                }).catch(err => { })
            } else {
            }
            res.status(200).json({
              statusCode: 200,
              message: "Get data for master successfully",
              data: data,
              success: true,
            })
          }).catch(err => { })
      })
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find data.`,
        })
      );
  },
  delete(req, res, next) {
    NotificationDayOffSchema.deleteOne({ _id: req.params.id })
      .then(data => {
        res.json(data);
      })
      .catch(next)
  },
  upload(req, res) {
    const { body } = req
    const idGroup = []
    const idMaster = []
    if (body?.Status !== 1) {
      const fromData = {
        ...body,
        UserRead: body?.UserId
      }
      const coursesNoti = new NotificationDayOffSchema(fromData)
      coursesNoti.save()
        .then((data) => {
          if (body?.Status === 2 || body?.Status === 3) {
            SlackBot(LINK_URL_CHANNEL_DAYOFF, body)
            SlackBot(LINK_URL_CHANNEL_HR, body)
          }
          res.status(200).json({
            statusCode: 200,
            message: "Notification Slack successfully",
            data: data,
            success: true,
          })
        })
        .catch(() => { }
        );
    } else {
      UserGroupSchema.find({ UserId: body.UserId })
        .then((Data) => {
          Data.map((e) => {
            idGroup.push(e.GroupId)
          })
          UserSchema.find({})
            .then((data) => {
              idGroup.map((id) => {
                const masterId = data.filter(function (user) {
                  return user.GroupId.includes(id)
                })
                masterId.map((e) => {
                  if (e.RoleId === "2") {
                    if (idMaster.includes(e._id.toString())) {
                    } else {
                      const idSlice = e?._id.toString()
                      idMaster.push(idSlice)
                    }
                  }
                })
              })
              const fromData = {
                Status: body?.Status,
                DayOffFrom: body?.DayOffFrom,
                DayOffTo: body?.DayOffTo,
                UserId: body?.UserId,
                Reason: body?.Reason,
                Name: body?.Name,
                Time: body?.Time,
                Quantity: body?.Quantity,
                Type: body?.Type,
                UserRead: idMaster
              }
              const coursesNoti = new NotificationDayOffSchema(fromData)
              coursesNoti.save()
                .then((data) => {
                  if (body?.Status === 1) {
                    SlackBot(LINK_URL_CHANNEL_DAYOFF, body)
                    SlackBot(LINK_URL_CHANNEL_HR, body)
                  }
                  res.status(200).json({
                    statusCode: 200,
                    message: "Notification Slack successfully",
                    data: data,
                    success: true,
                  })
                })
                .catch(() => { }
                );
            })
        }).catch(() =>
          res.status(404).json({
            success: false,
            message: `Can't find id: ${body.UserId}.`,
          })
        );
    }
  },
  readAll(req, res) {
    NotificationDayOffSchema.find({})
      .then(data => {
        const newData = data?.filter(function (noti) {
          return noti.UserRead.includes(req.params.id)
        })
        newData?.map((data) => {
          const arrayUserRead = data?.UserRead;
          const newArrayUserRead = []
          arrayUserRead?.map((e) => {
            if (e !== req.params.id) {
              newArrayUserRead.push(e)
            }
          })
          NotificationDayOffSchema.updateOne({ _id: data?._id }, { UserRead: newArrayUserRead })
            .then((noti) => {
              console.log('A', noti)
              if (newArrayUserRead?.length === 0) {
                NotificationDayOffSchema.deleteOne({ _id: data?._id })
              } else {
              }
            })
        })
        res.status(200).json({
          statusCode: 200,
          message: "Get data for master successfully",
          data: data,
          success: true,
        })
      })
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find data.`,
        })
      );
  }
}

