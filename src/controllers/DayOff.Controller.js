import { TableDayOffSchema } from '../schemas/TableDayOff.Schemas.js'
import { UserSchema } from '../schemas/User.schemas.js';
import { DpRoleSchema } from '../schemas/TableRole.schemas.js';
import axios from 'axios';
import { UserGroupSchema } from '../schemas/UserGroup.schemas.js';
import { checkMaster } from '../services/CheckMaster.services.js';
import dotenv from 'dotenv'
dotenv.config()
const LINK_URL_API = process.env.LINK_URL_API


export const DayOffController = {
  // [GET]
  get(req, res, next) {
    TableDayOffSchema.find({ UserId: req.params.id })
      .then(data => {
        res.json(data)
      })
      .catch(next)
  },
  show(req, res) {
    const { UserId, RoleId, GroupId } = req.body
    const idGroup = []
    const idMaster = []
    UserGroupSchema.find({ UserId: UserId })
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
                if (e.RoleId === "2" && !idMaster.includes(e._id.toString())) {
                  idMaster.push(e._id.toString())
                }
              })
            })
            DpRoleSchema.find({ Id: RoleId })
              .then((data) => {
                switch (data[0]?.RoleName) {
                  case 'Staff':
                    TableDayOffSchema.find({ UserId: UserId })
                      .then((data) =>
                        res.status(200).json({
                          statusCode: 200,
                          message: "Get data for user successfully",
                          data: data,
                          success: true,
                          idMaster: idMaster
                        })
                      )
                      .catch(() =>
                        res.status(404).json({
                          success: false,
                          message: `Can't find id: ${UserId}.`,
                        })
                      );
                    break;
                  case 'Manager':
                    UserGroupSchema.find({})
                      .then((data) => {
                        let request = []
                        const newData = data.filter(function (e) {
                          return GroupId?.includes(e.GroupId)
                        })
                        newData.map((e) => {
                          request.push(e.UserId)
                        })
                        TableDayOffSchema.find({})
                          .then((data) => {
                            const Data = data.filter(function (e) {
                              return request.includes(e.UserId)
                            })
                            res.status(200).json({
                              statusCode: 200,
                              message: "Get data for master successfully",
                              data: Data,
                              success: true,
                              idMaster: idMaster
                            })
                          })
                      })
                      .catch(() =>
                        res.status(404).json({
                          success: false,
                          message: `Can't find data.`,
                        })
                      );
                    break;
                  case 'Admin':
                    TableDayOffSchema.find({})
                      .then((data) =>
                        res.status(200).json({
                          statusCode: 200,
                          message: "Get data for hr successfully",
                          data: data,
                          success: true,
                        })
                      )
                      .catch(() =>
                        res.status(404).json({
                          success: false,
                          message: `Can't find data.`,
                        })
                      );
                    break;
                  default:
                    TableDayOffSchema.find({})
                      .then((data) =>
                        res.status(200).json({
                          statusCode: 200,
                          message: "Get data successfully",
                          data: data,
                          success: true,
                          idMaster: idMaster
                        })
                      )
                      .catch(() =>
                        res.status(404).json({
                          success: false,
                          message: `Can't find data.`,
                        })
                      );
                }
              })
          })

      })


  },
  showItem(req, res, next) {
    TableDayOffSchema.findByIdAndUpdate({ _id: req.params.id })
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
  update(req, res) {
    const { body } = req
    const newRequest = body?.Approve?.includes(body?.UserId) ? {
      ...body,
      Approve: [body?.UserId],
      Status: 1
    } :
      {
        ...body,
        Approve: [],
        Status: 1
      }
    const formData = {
      RequestId: body?._id,
      UserActionId: body?.UserId,
      Status: 1,
      Parent: [
        newRequest,
      ]
    }
    TableDayOffSchema.updateOne({ _id: req.params.id }, newRequest)
      .then((data) => {
        axios.post(LINK_URL_API + '/notification', newRequest)
        axios.post(LINK_URL_API + '/history-update', formData)
        res.status(200).json({
          statusCode: 200,
          message: "Update data successfully",
          data: data,
          success: true,
        })
      })
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find id: ${req.params.id}.`,
        })
      );

  },
  delete(req, res, next) {

    TableDayOffSchema.deleteOne({ _id: req.params.id })
      .then((data) =>
        res.status(200).json({
          statusCode: 200,
          message: "Delete data successfully",
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
  upload(req, res, next) {
    const { UserId, Name, RoleId } = req.body
    if (RoleId === '2') {
      (checkMaster(UserId, req, Name, res))
    } else {
      const formData = {
        ...req.body,
        Status: 1,
        Name,
      }
      const courses = new TableDayOffSchema(formData)
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
  },
  approve(req, res, next) {
    const { RequestId, UserId, UserActionId, Master } = req.body
    const idGroup = []
    const idMaster = []
    const formData = {
      RequestId: RequestId,
      UserActionId: UserActionId,
      Status: 2,
      Parent: [
      ]
    }
    axios.post(LINK_URL_API + '/history', formData)
    UserGroupSchema.find({ UserId: UserId })
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
                  if (idMaster.includes(e._id)) {
                  } else {
                    idMaster.push(e._id)
                  }
                }
              })
            })
            TableDayOffSchema.findById({ _id: RequestId })
              .then((data) => {
                const idAprove = data.Approve
                idAprove.push(UserActionId)
                if (idAprove.length <= idMaster.length) {
                  TableDayOffSchema.updateOne({ _id: RequestId }, { Approve: idAprove })
                    .then(() =>
                      res.status(200).json({
                        statusCode: 200,
                        message: "Reject successfully",
                        data: null,
                        success: true,
                      })
                    )
                    .catch(
                  );
                  if (idAprove.length === idMaster.length) {
                    TableDayOffSchema.updateOne({ _id: RequestId }, { Status: 2 })
                      .then(() => {
                        const formNoti = {
                         ...data?._doc,
                         Status: 2,
                        
                        }
                        axios.post(LINK_URL_API + '/notification', formNoti)
                      })
                      .catch((error) => {
                      })
                  }
                } else {
                }
              })
          })
      }).catch(() => {
        res.status(404).json({
          success: false,
        })
      })


  },
  reject(req, res, next) {
    const { body } = req
    const newData = {
      RequestId: body?._id,
      Status: 3,
      DayOffFrom: body?.DayOffFrom,
      DayOffTo: body?.DayOffTo,
      UserId: body?.UserId,
      Reason: body?.Reason,
      Name: body?.Name,
      Time: body?.Time,
      Quantity: body?.Quantity,
      Type: body?.Type,
      ReasonChange: body?.ReasonChange,
      UserActionId: body?.UserActionId,
    }
    axios.post(LINK_URL_API + '/history', newData)
    axios.post(LINK_URL_API + '/notification', newData)
    TableDayOffSchema.updateOne({ _id: body?._id }, { Status: 3 })
      .then(() =>
        res.status(200).json({
          statusCode: 200,
          message: "Reject successfully",
          data: null,
          success: true,
        })
      )
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find id: ${RequestId}.`,
        })
      );
  },
  requestChange(req, res) {
    const { body } = req
    const newData = {
      RequestId: body?._id,
      Status: 4,
      DayOffFrom: body?.DayOffFrom,
      DayOffTo: body?.DayOffTo,
      UserId: body?.UserId,
      Reason: body?.Reason,
      Name: body?.Name,
      Time: body?.Time,
      Quantity: body?.Quantity,
      Type: body?.Type,
      ReasonChange: body?.ReasonChange,
      UserActionId: body?.UserActionId,
    }
    TableDayOffSchema.updateOne({ _id: body._id }, { Status: 4 })
      .then(() => {
        axios.post(LINK_URL_API + '/notification', newData)
        axios.post(LINK_URL_API + '/history', newData)
        res.status(200).json({
          statusCode: 200,
          message: "Request change successfully",
          data: newData,
          success: true,
        })
      })
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find id: ${body?._id}.`,
        })
      );
  },
  revert(req, res) {
    const { body } = req
    const newData = {
      RequestId: body?._id,
      Status: 5,
      DayOffFrom: body?.DayOffFrom,
      DayOffTo: body?.DayOffTo,
      UserId: body?.UserId,
      Reason: body?.Reason,
      Name: body?.Name,
      Time: body?.Time,
      Quantity: body?.Quantity,
      Type: body?.Type,
      ReasonChange: body?.ReasonChange,
      UserActionId: body?.UserId,
    }
    const today = new Date
    const dayOff = new Date(body?.DayOffFrom)
    const time = (((dayOff - today) / 360 / 24 / 10000) + 1)
    if (time > 1) {
      TableDayOffSchema.updateOne({ _id: body._id }, { Status: 5 })
        .then(() => {
          axios.post(LINK_URL_API + '/history', newData)
          axios.post(LINK_URL_API + '/notification', newData)
          res.status(200).json({
            statusCode: 200,
            message: "Revert successfully",
            data: newData,
            success: true,
          })
        })
        .catch(() =>
          res.status(404).json({
            success: false,
            message: `Can't find id: ${body?._id}.`,
          })
        );
    } else {
      res.status(404).json({
        success: false,
        message: `over day.`,
      })
    }
  }
}

