function logger(req, res, next) {
    let dd = {
      method: req.method,
      date: new Date(),
      path: req.url,
      from: req.header("x-forwarded-for") || req.connection.remoteAddress
    }
    console.log(dd);
    next();
}
module.exports = logger;