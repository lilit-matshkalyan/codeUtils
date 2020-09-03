const fs = require('fs');

/**
 *
 * @param path
 * @returns {{}}
 */
exports.createFolder = async ({ path, layerName }) => {
  await fs.mkdirSync(path, { recursive: true });
  console.log('\x1b[36m%s\x1b[0m', `Created folder for ${layerName}!`);
};

/**
 *
 * @param path
 * @param content
 * @returns {{}}
 */
exports.createFile = async ({ path, content, layerName }) => {
  await fs.promises.writeFile(path, content);
  console.log('\x1b[32m%s\x1b[0m', `File for ${layerName} is created and content is filled!`);
};

/**
 *
 * @param path
 * @returns {Promise<Buffer>}
 */
exports.getFileContent = async ({ path }) => {
  const result = await fs.readFileSync(path);
  return result;
};


exports.appendFileByPosition = async () => {
  // TODO
};

exports.appendFileByString = ({
  path, importableCode, searchableString, message
}) => {
  const content = fs.readFileSync(path, 'utf8');

  let fileContent = content.toString();

  const positionString = fileContent.indexOf(searchableString);

  fileContent = fileContent.substring(positionString);

  const file = fs.openSync(path, 'r+');
  const bufferedText = Buffer.from(importableCode + fileContent);

  // On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
  fs.writeSync(file, bufferedText, 0, bufferedText.length, positionString);
  fs.closeSync(file);
  console.log('\x1b[35m%s\x1b[0m', message);
};

exports.collectResourceObject = ({ modelName }) => {
  const objectKey = modelName.toUpperCase();
  const singular = modelName.toLowerCase();
  const plural = `${singular}s`;

  const resourceObject = `
    ${objectKey}: {
      RELATION: '${modelName}',
      MODEL: '${modelName}',
      ALIAS: {
        SINGULAR: '${singular}',
        PLURAL: '${plural}'
      }
    }`;


  return resourceObject;
};
