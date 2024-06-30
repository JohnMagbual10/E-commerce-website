const { createProductHandler } = require('../handlers/products');

exports.handler = async (event, context) => {
  return createProductHandler(event, context);
};
