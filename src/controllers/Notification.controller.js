import { NotificationDayOffSchema } from '../schemas/Notification.Schemas.js'
import { UserGroupSchema } from '../schemas/UserGroup.schemas.js';
import { UserSchema } from '../schemas/User.schemas.js';
import dotenv from 'dotenv'
import { SlackBot } from '../services/SlackBot.services.js'
import axios from 'axios';
dotenv.config()
const LINK_URL_CHANNEL_DAYOFF = process.env.LINK_URL_CHANNEL_DAYOFF
const LINK_URL_CHANNEL_HR = process.env.LINK_URL_CHANNEL_HR
const LINK_URL_CHANNEL_GENERAL = process.env.LINK_URL_CHANNEL_GENERAL
const LINK_URL_API = process.env.LINK_URL_API

export const NotificationController = {
  get(req, res, next) {
    const masterId = req.params.id
    UserSchema.find({ _id: req.params.id })
      .then((data) => {
        switch (data[0]?.RoleId) {
          case '1':
            NotificationDayOffSchema.find({ UserId: req.params.id })
              .then((data) =>
                res.status(200).json({
                  statusCode: 200,
                  message: "Get data for user successfully",
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
            break;
          case '2':
            NotificationDayOffSchema.find({})
              .then(data => {
                const dataNoti = data.filter(function (noti) {
                  return noti.UserRead.includes(masterId)
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
            break;
        }

      })

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
    console.log('aaa', body)
    const idGroup = []
    const idMaster = []
    if (body?.Status === 4 || body?.Status === 3) {
      const fromData = {
        ...body,
        UserRead: body?.UserId
      }
      const coursesNoti = new NotificationDayOffSchema(fromData)
      coursesNoti.save()
        .then((data) => {
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
                  // SlackBot(LINK_URL_CHANNEL_DAYOFF,body)
                  // SlackBot(LINK_URL_CHANNEL_HR,body)
                  // SlackBot(LINK_URL_CHANNEL_GENERAL,body)
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
  }
}

