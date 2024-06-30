const { getProductsHandler } = require('../handlers/products');

exports.handler = async (event, context) => {
  return getProductsHandler(event, context);
};
