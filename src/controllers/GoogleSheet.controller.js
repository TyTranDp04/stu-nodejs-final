import { google } from "googleapis";
import { TableDayOffSchema } from '../schemas/TableDayOff.Schemas.js'
import format from 'date-format';

const getAuthSheets = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });
  const spreadsheetId = "1zR9IZHeMtZN_AgwCsFZKLlM-QVZqEQxz3DvV-k9gJ3E";

  return { auth, client, googleSheets, spreadsheetId };
}

export const GoogleSheetController = {

  get: async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });

    res.send(metaData)
  },

  getRows: async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet1",
      dateTimeRenderOption: "FORMATTED_STRING",
    });

    res.send(getRows.data)
  },

  addRows: async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const values = req.body.values;

    const row = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values,
      }
    });

    res.send(row.data)
  },

  updateRows: async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const dayOffFrom = req.query.DayOffFrom;
    const dayOffTo = req.query.DayOffTo;

    const getDaysArray = (start, end) => {
      for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
      }
      return arr;
    };

    const daylist = getDaysArray(new Date(dayOffFrom), new Date(dayOffTo));
    daylist.map((v) => v.toISOString().slice(0, 10)).join("");

    const dataDayOff = await TableDayOffSchema.find({ DayOffFrom: daylist });
    const filterDayOff = dataDayOff.filter(item => item.Status === 2);
    const sortDayOff = filterDayOff.sort((a, b) => a.DayOffFrom - b.DayOffFrom);
    const mapDayOff = sortDayOff.map((item, index) => [
      index + 1,
      item.Name,
      item.Reason,
      format('dd-MM-yyyy', new Date(item?.DayOffFrom)),
      format('dd-MM-yyyy', new Date(item?.DayOffTo)),
      item?.Type === 1 ? "OFF" : "WFH",
      item?.Time,
      item?.Quantity,
      item.Status = "Approve",
    ]);
    const hearderRow = ["No", "Name", "Reason", "DayOffFrom", "DayOffTo", "Type", "Time", "Quantity", "Status"];
    const values = [[...hearderRow], ...mapDayOff];
    await googleSheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: "Sheet1",
    });

    const updateValue = await googleSheets.spreadsheets.values.batchUpdate({
      auth,
      spreadsheetId,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: [{
          range: "Sheet1",
          values: values,
        }],
      }
    });

    res.send(updateValue.data)
  },

  exportDayoff: async (req, res, next) => {
    try {
      const dayOffFrom = req.query.DayOffFrom;
      const dayOffTo = req.query.DayOffTo;

      const getDaysArray = (start, end) => {
        for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
          arr.push(new Date(dt));
        }
        return arr;
      };

      const daylist = getDaysArray(new Date(dayOffFrom), new Date(dayOffTo));
      daylist.map((v) => v.toISOString().slice(0, 10)).join("");
      const dataDayOff = await TableDayOffSchema.find({ DayOffFrom: daylist });
      const filterDayOff = dataDayOff.filter(item => item.Status === 2);
      const sortDayOff = filterDayOff.sort((a, b) => a.DayOffFrom - b.DayOffFrom);
      const values = sortDayOff.map(item => ({
        Name: item?.Name,
        Reason: item?.Reason,
        DayOffFrom: item?.DayOffFrom,
        DayOffTo: item?.DayOffTo,
        Type: item?.Type,
        Time: item?.Time,
        Quantity: item?.Quantity,
        Status: "Approve",
      }));

      res.status(200).json(values)
    } catch (err) {
      res.status(404).send({
        status: "Error",
        message: "Something went wrong",
      });
    }
  },
}