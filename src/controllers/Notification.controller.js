import { NotificationDayOffSchema } from '../schemas/Notification.Schemas'

export const NotificationController = {
  get(req,res,next){
    NotificationDayOffSchema.find({})
    .then(user => {
        res.json(user)
    })
    .catch(next)
  },  
}

