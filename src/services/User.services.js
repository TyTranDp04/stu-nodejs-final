import { UserSchema } from "../schemas/User.schemas.js";

export const DpUserService = {
  get() {
    return new Promise((resolve, reject) => {
      UserSchema.find()
        .then((response) => {
          resolve({
            statusCode: 200,
            message: "Get user successfully",
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
      UserSchema.create(newPostObj)
        .then((response) => {
          resolve({
            statusCode: 200,
            message: "New data user created successfully",
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
        UserSchema.findOneAndUpdate(_id, obj)
          .then((response) => {
            resolve({
              statusCode: 200,
              message: "Data updated successfully",
              data: response,
              success: true,
            });
          })
          .catch((error) => {
            reject(error);
            console.log("error:", error);
          });
      }
    });
  },
  getDelete() {
    return new Promise((resolve, reject) => {
      UserSchema.findDeleted().then((response) => {
        resolve({
          statusCode: 200,
          message: "Get list data deleted successfully",
          data: response,
          success: true,
        });
      }).catch((error) =>{
        reject(error);
      })
    });
  },
};
