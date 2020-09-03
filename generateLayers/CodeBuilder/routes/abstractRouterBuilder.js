const AbstractMainBuilder = require('../abstractMainBuilder');


class RouteBuilder extends AbstractMainBuilder {
  getMethod() { // eslint-disable-line
    throw new Error('plz override');
  }

  getListMethod() { // eslint-disable-line
    throw new Error('plz override');
  }

  postMethod() { // eslint-disable-line
    throw new Error('plz override');
  }

  patchMethod() { //eslint-disable-line
    throw new Error('plz override');
  }

  deleteMethod() { // eslint-disable-line
    throw new Error('plz override');
  }

  putMethod() { // eslint-disable-line
    throw new Error('plz override');
  }

  toCode() { // eslint-disable-line
    throw new Error('plz override');
  }
}


module.exports = RouteBuilder;
