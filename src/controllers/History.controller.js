import { HistoryDayOffSchema } from '../schemas/History.Schemas.js';



export const HistoryController = {
  get(req, res, next) {
    const requestId = req.params.id
    HistoryDayOffSchema.find({ RequestId: requestId })
      .then((data) => {
        res.status(200).json({
          statusCode: 200,
          message: "upload data successfully",
          data: data,
          success: true,
        })
      })
      .catch(() =>
        res.status(404).json({
          success: false,
          message: `Can't find id: ${requestId}.`,
        }));
  },
  upload(req, res) {
    const { body } = req
    const formData = {
      ...body,
      UserId: body?.UserActionId
    }
    const courses = new HistoryDayOffSchema(formData)
    courses.save()
  },
  updateDayOff(req, res) {
    const { body } = req
    HistoryDayOffSchema.find({ RequestId: body?.RequestId })
      .then((data) => {
        const dataHistoryDayOff = data?.filter(function (data) {
          return data?.Parent?.length > 0
        })
        const dataDayOff = dataHistoryDayOff[dataHistoryDayOff?.length - 1]
        const dataParent = dataDayOff?.Parent[dataDayOff?.Parent?.length - 1]
        const newDataParent = [
          dataParent,
          body?.Parent[0]
        ]
        const formData = {
          ...body,
          UserId: body?.UserActionId,
          Parent: newDataParent,
        }
        const courses = new HistoryDayOffSchema(formData)
        courses.save()
      })
  },
  
}

