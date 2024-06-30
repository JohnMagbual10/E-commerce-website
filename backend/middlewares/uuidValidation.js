// middlewares/uuidValidation.js
const { validate: validateUUID } = require('uuid');

const validateUUIDMiddleware = (req, res, next) => {
  const { id } = req.params;
  if (!validateUUID(id)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }
  next();
};

module.exports = { validateUUIDMiddleware };
