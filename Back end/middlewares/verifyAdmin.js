const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = verifyAdmin;
