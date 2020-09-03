const KoaRouteBuilder = require('./CodeBuilder/routes/KoaRouterBuilder');
const KoaServiceBuilder = require('./CodeBuilder/services/KoaServiceBuilder');
const KoaControllerBuilder = require('./CodeBuilder/controllers/KoaControllerBuilder');
const SequelizeModelBuilder = require('./CodeBuilder/models/SequelizeModelBuilder');
const configs = require('./configs');

const Helpers = require('./utils/helpers');


class CodeBuilder {
  /**
     *
     * @param config
     */
  constructor(config) {
    this.config = config;
  }

  async generate() {
    const {
      route: {
        prefix: routePrefix, folderName: routeFolderName, fileName: routeFileName
      },
      controller: {
        folderName: controllerFolderName, fileName: controllerFileName
      },
      service: {
        folderName: serviceFolderName, fileName: serviceFileName
      },
      model: {
        name: modelName, fileName: modelFileName
      },
      config: includedFunctions
    } = this.config;

    const routeConfigs = {
      modelName, routePrefix, includedFunctions, controllerFolderName, controllerFileName
    };
    const controllerConfigs = {
      modelName, includedFunctions, serviceFolderName, serviceFileName
    };
    const serviceConfigs = {
      modelName, includedFunctions
    };
    const modelConfigs = {
      modelName
    };


    const route = new KoaRouteBuilder(routeConfigs);
    const routeCode = route.toCode();

    const controller = new KoaControllerBuilder(controllerConfigs);
    const controllerCode = controller.toCode();

    const service = new KoaServiceBuilder(serviceConfigs);
    const serviceCode = service.toCode();


    const model = new SequelizeModelBuilder(modelConfigs);
    const modelCode = model.toCode();

    const dirName = __dirname;
    let currentFolderName = dirName.split('/');
    const prevFolderName = currentFolderName[currentFolderName.length - 2];

    currentFolderName = currentFolderName[currentFolderName.length - 1];

    const filePath = dirName.substring(0, dirName.length - currentFolderName.length - prevFolderName.length - 1);
    const routeFolderPath = `${filePath}routes/${routeFolderName}`;
    const controllerFolderPath = `${filePath}controllers/${controllerFolderName}`;
    const serviceFolderPath = `${filePath}services/${serviceFolderName}`;
    const modelFolderPath = `${filePath}data/models`;


    await Helpers.createFolder({ path: `${routeFolderPath}`, layerName: 'route' });
    await Helpers.createFile({ path: `${routeFolderPath}/${routeFileName}.js`, content: routeCode, layerName: 'route' });

    await Helpers.createFolder({ path: `${controllerFolderPath}`, layerName: 'controller' });
    await Helpers.createFile({ path: `${controllerFolderPath}/${controllerFileName}.js`, content: controllerCode, layerName: 'controller' });

    await Helpers.createFolder({ path: `${serviceFolderPath}`, layerName: 'service' });
    await Helpers.createFile({ path: `${serviceFolderPath}/${serviceFileName}.js`, content: serviceCode, layerName: 'service' });

    const variableName = modelName.toLowerCase();

    Helpers.appendFileByString({
      searchableString: '// .import',
      path: `${filePath}routes/index.js`,
      importableCode: `const ${variableName}Routes = require('./${routeFolderName}/${routeFileName}');\n`,
      message: 'Route is imported in index file'
    });

    Helpers.appendFileByString({
      searchableString: '// .use',
      path: `${filePath}routes/index.js`,
      importableCode: `router.use(${variableName}Routes.routes());\n`,
      message: 'Route is used in index file'
    });


    await Helpers.createFile({ path: `${modelFolderPath}/${modelFileName}.js`, content: modelCode, layerName: 'model' });

    const resourceObject = Helpers.collectResourceObject({ modelName });
    const resourceConstObjectsFilePath = 'data/lcp/resources.js';

    Helpers.appendFileByString({
      searchableString: '// .newResource',
      path: `${filePath}${resourceConstObjectsFilePath}`,
      importableCode: `,${resourceObject}`,
      message: 'Resource object is added in resource constants'
    });


    console.log('\x1b[33m%s\x1b[0m', 'WARNING! \n '
        + 'Please add needed fields in model\'s file, because model was created with id, createdAt and updatedAt fields! \n '
        + 'And please uncomment sequelize.sync to run new models!');
  }
}

const codeGenerator = new CodeBuilder(configs);
codeGenerator.generate();
