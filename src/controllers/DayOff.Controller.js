import { TableDayOffSchema } from '../schemas/TableDayOff.schemas.js'
import { UserSchema } from '../schemas/User.schemas.js';
import { DpRoleSchema } from '../schemas/TableRole.schemas.js';
import { Helper } from '../helper/index.js';
import axios from 'axios';
import { UserGroupSchema } from '../schemas/UserGroup.schemas.js';
export const DayOffController = {
  // [GET]
  show(req, res, next) {
    const { body } = req
    DpRoleSchema.find({ Id: body.RoleId })
      .then((data) => {
        switch (data[0].RoleName) {
          case 'user':
            console.log('user')
            TableDayOffSchema.find({ UserId: body._id })
              .then((data) => {
                Helper.responseJsonHandler(data, null, res)
              }).catch((error) => {
                Helper.responseJsonHandler(null, error, res)
              })
            break;
          case 'master':
            UserGroupSchema.find({})
              .then((data) => {
                const newdata = data.filter(function (e) {
                  return body.GroupId.includes(e.GroupId)
                })
                res.json(newdata)
              })
              .catch((error) => {
              })
            break;
          case 'hr':
            console.log('hr')
            TableDayOffSchema.find({})
              .then((data) => {
                Helper.responseJsonHandler(data, null, res)
              }).catch((error) => {
                Helper.responseJsonHandler(null, error, res)
              })
            break;
          default:
            console.log('default')
            TableDayOffSchema.find({})
              .then((data) => {
                Helper.responseJsonHandler(data, null, res)
              }).catch((error) => {
                Helper.responseJsonHandler(null, error, res)
              })
        }
      })

  },
  showItem(req, res, next) {
    TableDayOffSchema.findByIdAndUpdate({ _id: req.params.id })
      .then((data) => {
        Helper.responseJsonHandler(data, null, res)
      }).catch((error) => {
        Helper.responseJsonHandler(null, error, res)
      })
  },
  update(req, res, next) {
    const { body } = req
    console.log(body._id)
    const newRequest = {
      ...body,
      Approve: [],
      Status: 1
    }
    TableDayOffSchema.updateOne({ _id: req.params.id }, newRequest)
      .then((data) => {
        Helper.responseJsonHandler(data, null, res)
      }).catch((error) => {
        Helper.responseJsonHandler(null, error, res)
      })

  },
  delete(req, res, next) {
    TableDayOffSchema.deleteOne({ _id: req.params.id })
      .then((data) => {
        Helper.responseJsonHandler(data, null, res)
      }).catch((error) => {
        Helper.responseJsonHandler(null, error, res)
      })
  },
  softDelete(req, res, next) {
    TableDayOffSchema.softDelete({ _id: req.params.id })
      .then((data) => {
        Helper.responseJsonHandler(data, null, res)
      }).catch((error) => {
        Helper.responseJsonHandler(null, error, res)
      })
  },
  upload(req, res, next) {
    const { body } = req
    console.log(body)
    const formData = {
      ...body,
      Status: 1
    }
    const courses = new TableDayOffSchema(formData)
    courses.save()
      UserSchema.findById({ _id: body.UserId },)
      .then((data) => {
        axios.post('https://hooks.slack.com/services/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', {
          "blocks": [
            {
              "type": "section",
              text: {
                type: "mrkdwn",
                text: `Name: *${data.Name}*\n\n Dayoff_from: *${body.DayOffFrom}*\n\n Dayoff_to: *${body.DayOffFrom}*\n\n Reason: *${body.Reason}*\n\n Link Website: http://localhost:3000`
              }
            }]
        })
        Helper.responseJsonHandler(data, null, res)
      }).catch((error) => {
        Helper.responseJsonHandler(null, error, res)
      })
  },
  getDeleted(request, response) {
    TableDayOffSchema.findDeleted()
      .then((data) => {
        Helper.responseJsonHandler(data, null, response)
      }).catch((error) => {
        Helper.responseJsonHandler(null, error, response)
      })
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
        message: `Can't find id: ${id._id}.`
      }));
  },
  approve(req, res, next) {
    const { body } = req
    TableDayOffSchema.findById({ _id: body.RequestId })
      .then((data) => {
        const idAprove = data.Approve
        idAprove.push(body.UserId)
        if (idAprove.length <= 3) {
          TableDayOffSchema.updateOne({ _id: body.RequestId }, { Approve: idAprove })
            .then((data) => {
              Helper.responseJsonHandler(data, null, res)
            }).catch((error) => {
              Helper.responseJsonHandler(null, error, res)
            })
          if (idAprove.length === 3) {
            TableDayOffSchema.updateOne({ _id: body.RequestId }, { Status: 3 })
              .then((data) => {
              }).catch((error) => {
              })
          }
        } else {
        }
      })
  },
  reject(req, res, next) {
    const { body } = req
    TableDayOffSchema.updateOne({ _id: body.RequestId }, { Status: 3 })
      .then((data) => {
        Helper.responseJsonHandler(data, null, res)

      }).catch((error) => {
        Helper.responseJsonHandler(null, error, res)
      })
  },
}

