import { TableDayOffSchema } from '../schemas/TableDayOff.schemas.js'
import { UserSchema } from '../schemas/User.schemas.js';
import { DpRoleSchema } from '../schemas/TableRole.schemas.js';
import axios from 'axios';
import { UserGroupSchema } from '../schemas/UserGroup.schemas.js';
import dotenv from 'dotenv'
dotenv.config()
const LINK_URL_API= process.env.LINK_URL_API


export const DayOffController = {
  // [GET]
  show(req, res, next) {
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
                if (e.RoleId === "2") {
                  idMaster.push(e._id)
                }
              })
            })
            DpRoleSchema.find({ Id: RoleId })
              .then((data) => {
                switch (data[0]?.RoleName) {
                  case 'user':
                    console.log('user')
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
                  case 'master':
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
                  case 'hr':
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
    console.log(body);
    const newRequest = body.Approve.includes(body.UserId)?{
      ...body,
      Approve: [body.UserId],
      Status: 1
    }:
    {
      ...body,
      Approve: [],
      Status: 1
    }
    TableDayOffSchema.updateOne({ _id: req.params.id }, newRequest)
      .then((data) =>
        res.status(200).json({
          statusCode: 200,
          message: "Update data successfully",
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
  softDelete(req, res, next) {
    TableDayOffSchema.findOne({ _id: req.params.id })
      .then((data) => {
        if (data.Status === 3) {
          TableDayOffSchema.deleteOne({ _id: req.params.id })
            .then((data) =>
              res.status(200).json({
                statusCode: 200,
                message: "Soft Delete data successfully",
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
        } else {
          TableDayOffSchema.softDelete({ _id: req.params.id })
            .then((data) =>
              res.status(200).json({
                statusCode: 200,
                message: "Soft Delete data successfully",
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
        }
      }).catch((error) => error)
  },
  upload(req, res, next) {
    const { UserId, DayOffFrom, DayOffTo, Reason, Name, RoleId } = req.body
    const formData = RoleId === "2" ? {
      ...req.body,
      Status: 1,
      Name,
      Approve: [UserId],
      Type: 1,
      Quantity: 1,
    } : {
      ...req.body,
      Status: 1,
      Name,
      Type: 1,
      Quantity: 1,
    }
    const courses = new TableDayOffSchema(formData)
    courses.save()
      .then((data) => {
        const formData = {
          Name,
          DayOffFrom,
          UserId,
          DayOffTo,
          Reason,
          Type: 1,
          Quantity: 1,
        }
        axios.post(LINK_URL_API+'/notification', formData)
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
  },
  getDeleted(req, res) {
    TableDayOffSchema.findDeleted({UserId:req.body.UserId })
      .then((data)=>{
        const newData = data.filter(function (user) {
          return user.UserId === req.body.UserId
        })
        console.log(newData)
        res.status(200).json({
          statusCode: 200,
          message: "Get deleted data successfully",
          data: newData,
          success: true,
        })
      } 
      )
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find.`,
        })
      );
  },
  restore(request, response) {
    const id = request.params.id;
    TableDayOffSchema.restore({ _id: id })
      .then(() => response.status(200).json({
        statusCode: 200,
        message: "Restore data successfully",
        success: true
      }))
      .catch(() => response.status(404).json({
        success: false,
        message: `Can't find id: ${id}.`
      }));
  },
  approve(req, res, next) {
    const { RequestId, UserId, UserAproveId, Master } = req.body
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
                if (e.RoleId === "2") {
                  if(idMaster.includes(e._id)){
                  }else {
                    idMaster.push(e._id)
                  }
                }
              })
              console.log(idMaster)
            })
            TableDayOffSchema.findById({ _id: RequestId })
              .then((data) => {
                const idAprove = data.Approve
                idAprove.push(UserAproveId)
                if (idAprove.length <= idMaster.length) {
                  TableDayOffSchema.updateOne({ _id: RequestId }, { Approve: idAprove } )
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
                  if (idAprove.length === idMaster.length) {
                    TableDayOffSchema.updateOne({ _id: RequestId }, { Status: 2 })
                      .then((data) => {
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
    const { RequestId } = req.body
    TableDayOffSchema.updateOne({ _id: RequestId }, { Status: 3 })
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
}

