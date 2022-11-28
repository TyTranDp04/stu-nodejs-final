import dotenv from 'dotenv'
import { google } from 'googleapis'
import fs from 'fs'


dotenv.config()
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const ID_GOOGLE_DRIVER = process.env.ID_GOOGLE_DRIVER
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
})



export const that = {
  setFilePublic: async (fileId) => {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      })
      const getUrl = await drive.files.get({
        fileId,
        fields: 'webViewLink, webContentLink'
      })
      return getUrl
    }
    catch (error) {
      console.log(error)
    }

  },
  uploadFileDriver: async ({ shared }, file) => {
    try {
      var targetFolderId = ID_GOOGLE_DRIVER;
      var fileMetadata = {
        'name': file.filename,
        parents: [targetFolderId],
      }
      const createFile = await drive.files.create({
        resource: fileMetadata,
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.path)
        }
      })
      const fileId = createFile.data.id
      const getUrl = await that.setFilePublic(fileId)
      return getUrl
    }
    catch (error) {
      console.error(error)
    }

  },
  deleteFileDriver: async (fileID) => {
    try {
      const deleteFile = await drive.files.delete({
        fileId: fileID
      })
      console.log(deleteFile.data, deleteFile.status)
    }
    catch (error) {
      console.error(error)
    }
  }
}
