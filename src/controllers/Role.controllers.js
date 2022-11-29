import { Helper } from "../helper/index.js";
import { DpRoleSchema } from "../schemas/TableRole.schemas.js";
import { DpRoleService } from "../services/Role.services.js";

export const DpRoleController = {
  get(req, res, next) {
    DpRoleSchema.find({})
      .then((course) => {
        res.json(course);
      })
      .catch(next);
  },
  create(request, response) {
    console.log(request.body);
    DpRoleService.create({
      Id: request.body.Id,
      RoleName: request.body.RoleName,
    })
      .then((data) => {
        Helper.responseJsonHandler(data, null, response);
      })
      .catch((error) => {
        Helper.responseJsonHandler(null, error, response);
      });
  },
  update(request, response) {
    const id = request.params;
    const updateObj = request.body;
    DpRoleService.update({ _id: id }, { $set: updateObj })
      .then((data) => {
        Helper.responseJsonHandler(data, null, response);
      })
      .catch((error) => {
        Helper.responseJsonHandler(null, error, response);
      });
  },
  delete(request, response) {
    const id = request.params;
    DpRoleSchema.deleteOne({ _id: id.id })
      .then(() =>
        response.status(200).json({
          statusCode: 200,
          message: "Delete data successfully",
          data: null,
          success: true,
        })
      )
      .catch(() =>
        response.status(404).json({
          success: false,
          message: `Can't find id: ${id._id}.`,
        })
      );
  },
};
