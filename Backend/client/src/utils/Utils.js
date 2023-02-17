export const getError = (err) => {
  console.log("error data ", err);
  return err.response && err.response.data.message
    ? err.response.data.message
    : err.message;
};
