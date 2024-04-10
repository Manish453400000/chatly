export const getStaticFilePath = (req:Request | any, fileName:string) => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};

export const getLocalPath = (fileName:string) => {
  return `public/images/${fileName}`;
};