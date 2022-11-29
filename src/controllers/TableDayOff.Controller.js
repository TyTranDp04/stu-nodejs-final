import { TableDayOffSchema } from '../schemas/TableDayOff.Schemas.js'
import { Helper } from '../helper/index.js';
export const TableDayOffController = {
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
    const courses = new TableDayOffSchema(body)
    console.log(courses)
    courses.save()
      .then((data) => {
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
}

