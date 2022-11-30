import { TableDayOffSchema } from '../schemas/TableDayOff.schemas.js'
import { UserSchema } from '../schemas/User.schemas.js';
import { Helper } from '../helper/index.js';
import axios from 'axios';
export const DayOffController = {
  // [GET]
  show(req, res, next) {
    TableDayOffSchema.find({})
      .then((data) => {
        Helper.responseJsonHandler(data, null, res)

      }).catch((error) => {
        Helper.responseJsonHandler(null, error, res)
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
    const { file, body } = req
    console.log(body._id)
    TableDayOffSchema.updateOne({ _id: req.params.id }, body)
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
    const { body, file } = req
    console.log(body, file)
    const formData = {
      ...body,
     Status: 1
    }
    const courses = new TableDayOffSchema(formData)
    courses.save()
    UserSchema.findById({ _id: req.params.id })
      .then((data) => {
        axios.post('https://hooks.slack.com/services/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', {
          "blocks": [
            {
              "type": "section",
              text: {
                type: "mrkdwn",
                text: `Name: *${data.Name}*\n\n Dayoff_from: *${body.DayOffFrom}*\n\n Dayoff_to: *${body.DayOffFrom}*\n\n Reason: *${body.Reason}*\n\n Link Website: *${body.DayOffFrom}*`
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
    TableDayOffSchema.findById({ _id: body.id })
      .then((data) => {
        const idAprove = data.Approve
        idAprove.push(body.userId)
        TableDayOffSchema.updateOne({ _id: body.id }, { Approve: idAprove })
          .then((data) => {

            Helper.responseJsonHandler(data, null, res)

          }).catch((error) => {
            Helper.responseJsonHandler(null, error, res)
          })
      })
  },
  reject(req, res, next) {
    const { body } = req
    TableDayOffSchema.updateOne({ _id: body.id }, { Status: 4 })
      .then((data) => {
        Helper.responseJsonHandler(data, null, res)

      }).catch((error) => {
        Helper.responseJsonHandler(null, error, res)
      })
  },
  test(req, res, next) {
    const { body } = req
    console.log(body)
    axios.post('https://hooks.slack.com/services/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', {
      "blocks": [
        {
          "type": "section",
          text: {
            type: "mrkdwn",
            text: `Name: *${body.DayOffFrom}*\n\n Dayoff_from: *${body.DayOffFrom}*\n\n Dayoff_to: *${body.DayOffFrom}*\n\n Reason: *${body.DayOffFrom}*\n\n Link Website: *${body.DayOffFrom}*`
          }
        }]
    })
  },
}

