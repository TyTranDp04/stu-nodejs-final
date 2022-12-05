import { Helper } from "../helper/index.js";
import { ChangePasswordService } from "../services/ChangePassword.services.js";

export const ChangePasswordController = {
 
  update(request, response) {
    const id = request.params;
    const updateObj = request.body;
    ChangePasswordService.update({ _id: id }, { $set: updateObj })
      .then((data) => {
        Helper.responseJsonHandler(data, null, response);
      })
      .catch((error) => {
        Helper.responseJsonHandler(null, error, response);
      });
  },
};
