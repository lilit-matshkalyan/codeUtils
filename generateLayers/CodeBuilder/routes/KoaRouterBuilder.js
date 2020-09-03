const AbstractRouterBuilder = require('./abstractRouterBuilder');


class KoaRouterBuilder extends AbstractRouterBuilder {
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
      includedFunctions, modelName, controllerFolderName, controllerFileName, routePrefix
    } = config;


    const includedFunctionsArray = [];
    for (let i = 0; i < Object.keys(includedFunctions).length; i++) {
      if (includedFunctions[Object.keys(includedFunctions)[i]]) {
        includedFunctionsArray.push(Object.values(map)[i]);
      }
    }

    this.config = {
      modelName,
      controllerFileName,
      prefix: routePrefix,
      controllerFolderName,
      includedFunctions: includedFunctionsArray
    };
  }

  getMethod() {
    const { modelName } = this.config;
    const result = `
      router.get('/:id', async (ctx) => {
        const { id } = ctx.params;
      
        const result = await ${modelName}Controller.getMethod({ id });
      
        return ctx.ok(result);
      });
    `;

    return result;
  }

  getListMethod() {
    const { modelName } = this.config;
    const result = `
      router.get('/', async (ctx) => {
        const result = await ${modelName}Controller.getListMethod({ queryParams: { ...ctx.request.query } });
      
        return ctx.ok(result);
      });
    `;
    return result;
  }

  postMethod() {
    const { modelName } = this.config;
    const result = `
      router.post('/', async (ctx) => {
        const result = await ${modelName}Controller.postMethod({ data: { ...ctx.request.body } });
      
        return ctx.created(result);
      });
    `;

    return result;
  }

  patchMethod() {
    const { modelName } = this.config;
    const result = `
      router.patch('/:id', async (ctx) => {
        const { id } = ctx.params;
        
        const result = await ${modelName}Controller.patchMethod({ data: { ...ctx.request.body }, id });
        return ctx.accepted(result);
      });
    `;

    return result;
  }

  deleteMethod() {
    const { modelName } = this.config;
    const result = `
      router.delete('/:id', async (ctx) => {
        const { id } = ctx.params;
      
        await ${modelName}Controller.deleteMethod({ id });
      
        return ctx.noContent();
      });
    `;

    return result;
  }

  putMethod() {
    const { modelName } = this.config;
    const result = `
      router.put('/', async (ctx) => {
        const result = await ${modelName}Controller.putMethod({ data: { ...ctx.request.body }});
        
        return ctx.created(result);
      });
    `;

    return result;
  }

  fileIncludes() {
    const { modelName, controllerFolderName, controllerFileName } = this.config;
    const result = `
      const Router = require('koa-router');
      const ${modelName}Controller = require('../../controllers/${controllerFolderName}/${controllerFileName}');
    `;

    return result;
  }

  routeExport() { //eslint-disable-line
    const result = 'module.exports = router;';

    return result;
  }

  routePrefix() {
    const { prefix } = this.config;

    const result = `
      const router = new Router({
        prefix: '/${prefix}'
      });
    `;

    return result;
  }


  toCode() {
    const {
      includedFunctions, modelName, controllerFolderName, controllerFileName, routePrefix
    } = this.config;

    const includes = this.fileIncludes({ modelName, controllerFolderName, controllerFileName });
    const prefix = this.routePrefix({ prefix: routePrefix });

    let standardFunctions = '';
    for (let i = 0; i < includedFunctions.length; i++) {
      const standardFunction = this[includedFunctions[i]]({ modelName });
      standardFunctions += standardFunction;
    }

    const routeExports = this.routeExport();


    const routeContent = `
      ${includes}
      ${prefix}
      ${standardFunctions}
      ${routeExports}`;

    return routeContent;
  }
}


module.exports = KoaRouterBuilder;
