const AbstractControllerBuilder = require('./abstractControllerBuilder');


class KoaControllerBuilder extends AbstractControllerBuilder {
  constructor(config) {
    super(config);

    const map = {
      create: 'postMethod',
      update: 'patchMethod',
      edit: 'putMethod',
      remove: 'deleteMethod',
      getAll: 'getListMethod',
      get: 'getMethod'
    };

    const {
      includedFunctions, modelName, serviceFolderName, serviceFileName
    } = config;


    const includedFunctionsArray = [];
    for (let i = 0; i < Object.keys(includedFunctions).length; i++) {
      if (includedFunctions[Object.keys(includedFunctions)[i]]) {
        includedFunctionsArray.push(Object.values(map)[i]);
      }
    }

    this.config = {
      modelName,
      serviceFileName,
      serviceFolderName,
      includedFunctions: includedFunctionsArray
    };
  }

  getMethod() {
    const { modelName } = this.config;
    const result = `
      static async getMethod({ id }) {
        const result = await ${modelName}Service.get({ id });

        return result;
      }
    `;

    return result;
  }

  getListMethod() {
    const { modelName } = this.config;
    const result = `
      static async getListMethod({ queryParams }) {
        const result = await ${modelName}Service.getList({ queryParams });

        return result;
  }
    `;
    return result;
  }

  postMethod() {
    const { modelName } = this.config;
    const result = `
      static async postMethod({ data }) {
        const result = await ${modelName}Service.post({ data });

        return result;
      }
    `;

    return result;
  }

  patchMethod() {
    const { modelName } = this.config;
    const variableName = modelName.toLowerCase();

    const result = `
      static async patchMethod({ data, id }) {
        const ${variableName} = await ${modelName}Service.get({ id });

        if (!${variableName}) throw new ResourceNotFoundError({ message: RESOURCE_NOT_FOUND });

        const result = await ${modelName}Service.patch({ data, ${variableName} });

        return result;
      } 
    `;

    return result;
  }

  deleteMethod() {
    const { modelName } = this.config;
    const variableName = modelName.toLowerCase();

    const result = `
      static async deleteMethod({ id }) {
        const ${variableName} = await ${modelName}Service.get({ id });

        if (!${variableName}) throw new ResourceNotFoundError({ message: RESOURCE_NOT_FOUND });

        const resp = await ${modelName}Service.delete({ ${variableName} });

        return resp;
      }
    `;

    return result;
  }

  putMethod() {
    const { modelName } = this.config;
    const result = `
      static async putMethod({ data }) {
        const result = await ${modelName}Service.put({ data });
      
        return result;
      }
    `;

    return result;
  }

  fileIncludes() {
    const { modelName, serviceFolderName, serviceFileName } = this.config;
    const result = `
      const {
        RESOURCE_NOT_FOUND
        
      } = require('../../utils/errorDetails');
      const { ResourceNotFoundError } = require('../../modules/exceptions');
      const ${modelName}Service = require('../../services/${serviceFolderName}/${serviceFileName}');
    
      /**
       * Class ${modelName}Controller
       */
      class ${modelName}Controller {
    `;

    return result;
  }

  controllerExport() {
    const { modelName } = this.config;
    const result = `
        }

        module.exports = ${modelName}Controller;
    `;

    return result;
  }


  toCode() {
    const {
      includedFunctions, modelName, serviceFolderName, serviceFileName
    } = this.config;

    const includes = this.fileIncludes({ modelName, serviceFolderName, serviceFileName });

    let standardFunctions = '';
    for (let i = 0; i < includedFunctions.length; i++) {
      const standardFunction = this[includedFunctions[i]]({ modelName });
      standardFunctions += standardFunction;
    }

    const controllerExports = this.controllerExport();


    const controllerContent = `
      ${includes}
      ${standardFunctions}
      ${controllerExports}`;

    return controllerContent;
  }
}


module.exports = KoaControllerBuilder;
