// const planets = [{
//     "id":12,"name":1111
// }];

const { parse } = require("csv-parse");
const fs = require("fs");
const planets = require("./planets.mongo");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function LoadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./src/models/kepler_data.csv")
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // await planets.updateOne(
          //   {
          //     kepler_name: data.kepler_name,
          //   },
          //   {
          //     kepler_name: data.kepler_name,
          //   },
          //   {
          //     upsert: true,
          //   }
          // );
          savePlanets(data);
          habitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        // console.log(
        //   habitablePlanets.map((planet) => {
        //     return planet["kepler_name"];
        //   })
        // );
        const coutp = (await getAllPlanets()).length;
        // console.log(`${habitablePlanets.length} habitable planets found!`);
        console.log(`${coutp} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  // console.log(planets.find({}), "all logg");
  return await planets.find({},{
    "__v":0, "_id":0
  });
  // return habitablePlanets;
}

async function savePlanets(data) {
  try {
    await planets.updateOne(
      {
        keplerName: data.kepler_name,
      },
      {
        keplerName: data.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.log(`couldnt save data ${err}`);
  }
}
module.exports = {
  LoadPlanetData,
  planets: getAllPlanets,
};
