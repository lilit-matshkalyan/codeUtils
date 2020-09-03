const AbstractServiceBuilder = require('./abstractServiceBuilder');


class KoaServiceBuilder extends AbstractServiceBuilder {
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
      includedFunctions, modelName
    } = config;


    const includedFunctionsArray = [];
    for (let i = 0; i < Object.keys(includedFunctions).length; i++) {
      if (includedFunctions[Object.keys(includedFunctions)[i]]) {
        includedFunctionsArray.push(Object.values(map)[i]);
      }
    }

    this.config = {
      modelName,
      includedFunctions: includedFunctionsArray
    };
  }

  getMethod() {
    const { modelName } = this.config;
    const result = `
      static async get({ id }) {
        const result = await ${modelName}.findOne({
          where: {
            id
          }
        });

        return result;
      }
    `;

    return result;
  }

  getListMethod() {
    const { modelName } = this.config;
    const result = `
      static async getList({ queryParams: { limit = PAGINATION.LIMIT, offset = PAGINATION.OFFSET } }) {
        let result = await ${modelName}.findAndCountAll({
          limit,
          offset
        });
        result = arrangeSequelizeInterfaceData({ data: result });

        return result;
      } 
    `;
    return result;
  }

  postMethod() {
    const { modelName } = this.config;
    const result = `
      static async post({ data }) {
        const result = await ${modelName}.create(data);

        return result;
      }
    `;

    return result;
  }

  patchMethod() {
    const { modelName } = this.config;
    const variableName = modelName.toLowerCase();

    const result = `
      static async patch({ data, ${variableName} }) {
        const result = await ${variableName}.update(data);

        return result;
      }
    `;

    return result;
  }

  deleteMethod() {
    const { modelName } = this.config;
    const variableName = modelName.toLowerCase();

    const result = `
      static async delete({ ${variableName} }) {
        await ${variableName}.destroy();
      }
    `;

    return result;
  }

  putMethod() {
    const { modelName } = this.config;
    const result = `
      static async put({ data }) {
        const result = await ${modelName}.upsert(data, { returning: true });
        
        return result[0];
      }
    `;

    return result;
  }

  fileIncludes() {
    const { modelName } = this.config;
    const result = `
      const { ${modelName} } = require('../../data/models');
      const { PAGINATION } = require('../../utils/constants');
      const { arrangeSequelizeInterfaceData } = require('../../utils/helpers');


      /**
       * Abstract Class ${modelName}Service
       */
      class ${modelName}Service {
    `;

    return result;
  }

  serviceExport() {
    const { modelName } = this.config;
    const result = `
        }

        module.exports = ${modelName}Service;
    `;

    return result;
  }


  toCode() {
    const {
      includedFunctions, modelName
    } = this.config;

    const includes = this.fileIncludes({ modelName });

    let standardFunctions = '';
    for (let i = 0; i < includedFunctions.length; i++) {
      const standardFunction = this[includedFunctions[i]]({ modelName });
      standardFunctions += standardFunction;
    }

    const serviceExports = this.serviceExport();


    const serviceContent = `
      ${includes}
      ${standardFunctions}
      ${serviceExports}`;

    return serviceContent;
  }
}


module.exports = KoaServiceBuilder;
