module.exports = (req, res, next) => {
  const usuario = req.headers["x-user"];
  if (usuario) {
    req.user = { nome: usuario };
  }
  next();
};