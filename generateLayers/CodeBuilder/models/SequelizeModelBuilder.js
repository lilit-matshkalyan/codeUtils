const AbstractModelBuilder = require('./abstractModelBuilder');
const { GOHEALTHY_CORE } = require('../../../../data/lcp/schemas');


class SequelizeModelBuilder extends AbstractModelBuilder {
  fileIncludes() {
    const { modelName } = this.config;
    const resourceName = modelName.toUpperCase();
    const result = `
      /* eslint-disable func-names */

      /**
       * Sequelize Model's definition documentation
       * @see https://sequelize.org/master/manual/models-definition.html
       */
    
      /** Sequelize Model's usage documentation
       * @see https://sequelize.org/master/manual/models-usage.html
       * */

      const {
        ${resourceName}
      } = require('../lcp/resources');
      const { ${GOHEALTHY_CORE} } = require('../lcp/schemas');
    `;

    return result;
  }

  modelExport() {
    const { modelName } = this.config;
    const resourceName = modelName.toUpperCase();
    const variableName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const result = `
      module.exports = (sequelize, DataTypes) => {
        const ${variableName} = sequelize.define(
          ${resourceName}.MODEL,
          {
            id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4
            },
            createdAt: {
              type: DataTypes.DATE,
              defaultValue: DataTypes.NOW
            },
            updatedAt: {
              type: DataTypes.DATE,
              defaultValue: DataTypes.NOW
            }
          },
          {
            timestamps: true,
            paranoid: true,
            schema: ${GOHEALTHY_CORE},
            freezeTableName: true
          }
        );
    
        return ${variableName};
      };
    `;

    return result;
  }


  toCode() {
    const { modelName } = this.config;

    const includes = this.fileIncludes({ modelName });
    const modelExports = this.modelExport();


    const controllerContent = `
      ${includes}
      ${modelExports}`;

    return controllerContent;
  }
}


module.exports = SequelizeModelBuilder;
