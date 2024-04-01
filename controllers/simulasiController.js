const { Router } = require("express");
const m$simulasi = require("../modules/simulasi.module");
const response = require("../helpers/response");

const SimulasiController = Router();

SimulasiController.get("/", async (req, res) => {
  const list = await m$simulasi.listSimulasi();
  response.sendResponse(res, list);
});

SimulasiController.get("/:id", async (req, res) => {
  const id = req.params.id;
  const list = await m$simulasi.listSimulasiById(id);
  response.sendResponse(res, list);
});

SimulasiController.post("/", async (req, res) => {
  const add = await m$simulasi.createSimulasi(req.body);
  response.sendResponse(res, add);
});

SimulasiController.put("/:id", async (req, res) => {
  const id = req.params.id;
  const del = await m$simulasi.editSimulasi(id, req.body); 
  response.sendResponse(res, del);
});

SimulasiController.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const del = await m$simulasi.deleteSimulasi(id); 
  response.sendResponse(res, del);
});

module.exports = SimulasiController;
