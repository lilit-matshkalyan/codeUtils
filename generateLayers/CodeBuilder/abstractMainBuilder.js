class AbstractMainBuilder {
  constructor(config) {
    this.config = config;
  }


  toCode() { // eslint-disable-line
    throw new Error('plz override');
  }
}


module.exports = AbstractMainBuilder;
