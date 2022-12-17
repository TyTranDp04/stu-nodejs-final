import { UserSchema } from "../schemas/User.schemas.js";


export const ChangePasswordService = {
// update(param, obj) {
//     return new Promise((resolve, reject) => {
//       const _id = param._id;
//       if (_id && obj) {
//         UserSchema.findOneAndUpdate(_id, obj)
//           .then((response) => {
//             console.log(obj, 'response')
//             resolve({
//               statusCode: 200,
//               message: "Change password successfully",
//               data : response,
//               success: true,
//             });
//           }).catch((error) => {
//             reject(error);
//             console.log("error:", error);
//           })
//       }
//     })
//   }
  update(param, obj) {
    return new Promise((resolve, reject) => {
      const _id = param._id;
      if (_id && obj) {
        UserSchema.findOneAndUpdate(_id, obj)
          .then((response) => {
            resolve({
              statusCode: 200,
              message: "Change password successfully",
              data : response,
              success: true,
            });
          }).catch((error) => {
            reject(error);
            console.log("error:", error);
          })
      }
    })
  }
}