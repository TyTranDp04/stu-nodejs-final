import axios from "axios"
import { TableDayOffSchema } from "../schemas/TableDayOff.Schemas.js"
import { UserSchema } from "../schemas/User.schemas.js"
import { UserGroupSchema } from "../schemas/UserGroup.schemas.js"
import dotenv from 'dotenv'
dotenv.config()
const LINK_URL_API = process.env.LINK_URL_API

export const checkMaster = (UserId, req, Name, res) => {
  const idGroup = []
  UserGroupSchema.find({ UserId: UserId })
    .then((Data) => {
      Data.map((e) => {
        idGroup.push(e.GroupId)
      })
      UserSchema.find({})
        .then((data) => {
          const idMaster = []
          idGroup.map((id) => {
            const masterId = data.filter(function (user) {
              return user.GroupId.includes(id)
            })
            masterId.map((e) => {
              if (e.RoleId === "2" && !idMaster.includes(e._id.toString())) {
                idMaster.push(e._id.toString())
              }
            })
          })
          if (idMaster?.length === 1 && idMaster[0] === UserId) {
            const formDataDayOff = {
              ...req.body,
              Status: 2,
              Name,
              Approve: [UserId]
            }
            const courses = new TableDayOffSchema(formDataDayOff)
            courses.save()
              .then((data) => {
                const formData = {
                  RequestId: data?._id,
                  UserActionId: data?.UserId,
                  Status: data?.Status,
                  Parent: [
                    data,
                  ]
                }
                axios.post(LINK_URL_API + '/notification', data)
                axios.post(LINK_URL_API + '/history', formData)
                res.status(200).json({
                  statusCode: 200,
                  message: "upload data successfully",
                  data: data,
                  success: true,
                })
              }).catch(() =>
                res.status(404).json({
                  success: false,
                  message: `Can't find id: ${UserId}.`,
                })
              );
          } else {
            const formDataDayOff = {
              ...req.body,
              Status: 1,
              Name,
              Approve: [UserId]
            }
            const courses = new TableDayOffSchema(formDataDayOff)
            courses.save()
              .then((data) => {
                const formData = {
                  RequestId: data?._id,
                  UserActionId: data?.UserId,
                  Status: data?.Status,
                  Parent: [
                    data,
                  ]
                }
                axios.post(LINK_URL_API + '/notification', data)
                axios.post(LINK_URL_API + '/history', formData)
                res.status(200).json({
                  statusCode: 200,
                  message: "upload data successfully",
                  data: data,
                  success: true,
                })
              }).catch(() =>
                res.status(404).json({
                  success: false,
                  message: `Can't find id: ${UserId}.`,
                })
              );
          }
        })
    })
}

