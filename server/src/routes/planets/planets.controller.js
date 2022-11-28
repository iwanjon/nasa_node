const { planets } = require("../../models/planets.model");
// const { getPagination } = require("../../services/query");

async function getAllPlanets(req, res, next) {
  console.log(await planets(), "gettalll");
//   const {  skip, limit} = getPagination(req.query);
  return res.status(200).json(await planets());
}

module.exports = {
  getAllPlanets: getAllPlanets,
};
