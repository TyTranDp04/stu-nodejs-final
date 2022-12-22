import axios from "axios"
import dotenv from 'dotenv'
import moment from "moment/moment.js"

dotenv.config()
const LINK_URL_WEBSITE = process.env.LINK_URL_WEBSITE

export const SlackBot = (url, data)=>{
  const from = moment.utc(data?.DayOffFrom).format('DD/MM/YYYY')
  const to = moment.utc(data?.DayOffTo).format('DD/MM/YYYY')
  axios.post(url, {
    "blocks": [
      {
        "type": "section",
        text: {
          type: "mrkdwn",
          text: `Name: ${data?.Name}\n\n Dayoff_from: ${from}\n\n Dayoff_to: ${to}\n\n Reason: ${data?.Reason}\n\n Link Website: ${LINK_URL_WEBSITE}`
        }
      }]
  })
}