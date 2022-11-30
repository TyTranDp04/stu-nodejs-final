import { DpRoleSchema } from "../schemas/TableRole.schemas.js";

export const DpRoleService = {
  get() {
    return new Promise((resolve, reject) => {
      DpRoleSchema.find({})
        .then((response) => {
          resolve({
            statusCode: 200,
            message: "Get list data successfully",
            data: response,
            success: true,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  create(body) {
    let newPostObj = body;
    return new Promise((resolve, reject) => {
      DpRoleSchema.create(newPostObj)
        .then((response) => {
          resolve({
            statusCode: 200,
            message: "New data created successfully",
            data: response,
            success: true,
          });
        })
        .catch((error) => {
          reject({
            statusCode: 404,
            message: error.reason,
            data: null,
            success: false,
          });
        });
    });
  },
  update(param, obj) {
    return new Promise((resolve, reject) => {
      const _id = param._id;
      if (_id && obj) {
        DpRoleSchema.findOneAndUpdate(_id, obj)
          .then((response) => {
            resolve({
              statusCode: 200,
              message: "Data updated successfully",
              data: response,
              success: true,
            });
          }).catch((error) => {
            reject(error);
            console.log("error:", error);
          })
      }
    })
  },
  delete(request, response) {
    const id = request.params;
    DpRoleSchema.deleteOne({ _id: id.id })
      .then(() => response.status(200).json({
        statusCode: 200,
        message: "Delete data successfully",
        data: null,
        success: true
      }))
      .catch(() => response.status(404).json({
        success: false,
        message: `Can't find id: ${id._id}.`
      }));
  },
};
