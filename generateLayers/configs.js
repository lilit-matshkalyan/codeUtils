const { npm_lifecycle_script: runCommand } = process.env;

let modelName = runCommand.split('modelName=')[1];
modelName = modelName.split('"')[0]; // eslint-disable-line
modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);


const route = {
  prefix: modelName,
  folderName: modelName.toLowerCase(),
  fileName: modelName
};
const controller = {
  folderName: modelName.toLowerCase(),
  fileName: `${modelName}Controller`
};
const service = {
  folderName: modelName.toLowerCase(),
  fileName: `${modelName}Service`
};
const model = {
  name: modelName,
  fileName: modelName
};

const config = {
  create: true,
  update: true,
  edit: true,
  remove: true,
  getAll: true,
  get: true
};

module.exports = {
  route,
  model,
  config,
  service,
  controller
};
