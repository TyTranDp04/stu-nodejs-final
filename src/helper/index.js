const responseJsonHandler = (data, error, expressResponse) => {
  let obj = { error: error, data: data };
  if (obj.error) {
    expressResponse.status(404).json(obj.error);
  } else {
    expressResponse.status(200).json(obj.data);
  }
}

export const Helper = {
  responseJsonHandler,
}