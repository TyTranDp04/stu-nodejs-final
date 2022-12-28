import axios from "axios"
import dotenv from 'dotenv'
import moment from "moment/moment.js"

dotenv.config()
const LINK_URL_WEBSITE = process.env.LINK_URL_WEBSITE

export const SlackBot = (url, data)=>{
  console.log(data)
  const from = moment.utc(data?.DayOffFrom).format('DD/MM/YYYY')
  const to = moment.utc(data?.DayOffTo).format('DD/MM/YYYY')
  const typeRequest = (status)=>{
    if(status === 1){
      return "New request!"
    }
    if(status === 2){
      return "Approved request!"
    }
    if(status === 3){
      return "Rejected request!"
    }
  }
  axios.post(url, {
    "blocks": [
      {
        "type": "section",
        text: {
          type: "mrkdwn",
          text: `${typeRequest(data?.Status)}\n\n Name: ${data?.Name}\n\n Dayoff_from: ${from}\n\n Dayoff_to: ${to}\n\n Reason: ${data?.Reason}\n\n Link Website: ${LINK_URL_WEBSITE}`
        }
      }]
  })
}