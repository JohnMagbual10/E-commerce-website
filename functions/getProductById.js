const { getProductByIdHandler } = require('../handlers/products');

exports.handler = async (event, context) => {
  return getProductByIdHandler(event, context);
};
