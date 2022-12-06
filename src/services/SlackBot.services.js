import axios from "axios"
import dotenv from 'dotenv'
dotenv.config()
const LINK_URL_WEBSITE = process.env.LINK_URL_WEBSITE

export const SlackBot = (url, data)=>{
  axios.post(url, {
    "blocks": [
      {
        "type": "section",
        text: {
          type: "mrkdwn",
          text: `Name: ${data?.Name}\n\n Dayoff_from: ${data?.DayOffFrom}\n\n Dayoff_to: ${data?.DayOffTo}\n\n Reason: ${data?.Reason}\n\n Link Website: ${LINK_URL_WEBSITE}`
        }
      }]
  })
}