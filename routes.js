const simulasiController = require("./controllers/simulasiController");

const _routes = [
  ["simulasi", simulasiController],
];

const routes = (app) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(`/api/${url}`, controller);
  });
};

module.exports = routes;
