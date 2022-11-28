const launchesDB = require("./launches.mongo");
const planetDB = require("./planets.mongo");
const axios = require("axios");
// const launches = new Map();
// var Iconv  = require('iconv').Iconv;
const fetch = require("node-fetch");
let latestflightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;
// const launch = {
//   flightNumber: 100,
//   mission: "Kepler Exploration X",
//   rocket: "Explorer Is1",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true,
// };

// launches.set(launch.flightNumber, launch);
// savelaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

// async function LoadLaunchData() {
//   console.log("madang donwload sik");
//   const response = await axios.post(SPACE_X_URL)
//   return response}

async function LoadLaunchData() {
  let data = {
    query: {},
    options: {
      pagination: false,
      // page: 2,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  };

  const config = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  // check if data ever be downloaed by check the first data
  const firstlaunch = await FindLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  console.log(firstlaunch, "haphap");
  if (firstlaunch) {
    console.log("data already laught");
    return;
  }

  console.log("madang donwload sik");
  // const response = await axios.post(SPACE_X_URL, {
  //   query: {},
  //   options: {
  //     populate: [
  //       {
  //         path: "rocket",
  //         select: {
  //           name: 1
  //         }
  //       },
  //       {
  //         path: "payloads",
  //         select: {
  //           customer: 1
  //         }
  //       },
  //     ],
  //   },
  // });
  let response = await axios.post(SPACEX_API_URL, data);
  // let response = await  fetch(SPACE_X_URL, config)
  // .then(response =>{ return response})

  // const laundata = response.data["docs"];
  // console.log(laundata)
  // for (const data of laundata) {
  //   const payloads = data["payloads"];
  //   const customers = payloads.flatmap((payload) => {
  //     return payload["customer"];
  //   });
  //   const launch = {
  //     flightNumber: data["flight_number"],
  //     mission: data["name"],
  //     rocket: data["rocket"]["name"],
  //     launchDate: data["date_local"],
  //     // target: data[""],
  //     customers,
  //     upcoming: data["upcoming"],
  //     sucess: data["sucess"],
  //   };
  //   console.log(launch.mission)
  // }

  if (response.status != 200) {
    console.log("error in downloading data");
    throw new Error("Error downloading data");
  }
  let launchDocs = response.data.docs;

  // console.log(launchDocs);
  for (let launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await savelaunch(launch);
  }
}

// async function populateLaunches() {
//   console.log('Downloading launch data...');
//   const response = await axios.post(SPACEX_API_URL, {
//     query: {},
//     options: {
//       pagination: false,
//       populate: [
//         {
//           path: 'rocket',
//           select: {
//             name: 1
//           }
//         },
//         {
//           path: 'payloads',
//           select: {
//             'customers': 1
//           }
//         }
//       ]
//     }
//   });

//   if (response.status !== 200) {
//     console.log('Problem downloading launch data');
//     throw new Error('Launch data download failed');
//   }

//   const launchDocs = response.data.docs;
//   for (const launchDoc of launchDocs) {
//     const payloads = launchDoc['payloads'];
//     const customers = payloads.flatMap((payload) => {
//       return payload['customers'];
//     });

//     const launch = {
//       flightNumber: launchDoc['flight_number'],
//       mission: launchDoc['name'],
//       rocket: launchDoc['rocket']['name'],
//       launchDate: launchDoc['date_local'],
//       upcoming: launchDoc['upcoming'],
//       success: launchDoc['success'],
//       customers,
//     };

//     console.log(`${launch.flightNumber} ${launch.mission}`);

//     // await saveLaunch(launch);
//   }
// }
// async function LoadLaunchData() {
//   const firstLaunch = await findLaunch({
//     flightNumber: 1,
//     rocket: 'Falcon 1',
//     mission: 'FalconSat',
//   });
//   if (firstLaunch) {
//     await populateLaunches();
//     console.log('Launch data already loaded!');
//   } else {
//     await populateLaunches();
//   }
// }
// async function findLaunch(filter) {
//   return await launchesDB.findOne(filter);
// }
async function savelaunch(data) {
  // const planet = await planetDB.findOne({ kepler_name: data.target });

  // if (!planet) {
  //   throw new Error("no matched planet found");
  // }
  try {
    await launchesDB.findOneAndUpdate(
      // await launchesDB.updateOne(
      {
        // flightNumber: 100,
        flightNumber: data.flightNumber,
      },
      data,
      {
        upsert: true,
        runValidators: true,
      }
      // function(err, data) {
      //   console.log(data,"koko", err)
      // }
    );
  } catch (err) {
    console.log("error in updateone upsert", err);
  }
}

async function getLatestFlightNum() {
  retur = await launchesDB.findOne().sort("-flightNumber");
  if (!retur) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return retur.flightNumber;
}

const getallLaunch = async (skip, limit) => {
  // return Array.from(launches.values());
  return await launchesDB
    .find(
      {},
      {
        __v: 0,
        _id: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};

// function addNewLaunch(launch) {
//   latestflightNumber++;
//   launches.set(
//     latestflightNumber,
//     Object.assign(launch, {
//       flightNumber: latestflightNumber,
//       customers: ["ZTM", "NASA"],
//       upcoming: true,
//       success: true,
//     })
//   );
// }

async function addNewLaunch(launch) {
  const planet = await planetDB.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("no matched planet found");
  }

  const latestNumber = (await getLatestFlightNum()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: latestNumber,
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  });
  await savelaunch(newLaunch);
}

async function FindLaunch(filter) {
  return await launchesDB.findOne(filter);
}

async function isExistLaunch(id) {
  // return launches.has(id);
  // return await launchesDB.findOne({
  return await FindLaunch({
    flightNumber: id,
  });
}

async function AbortLaunchModel(id) {
  // const abortlaunch = launches.get(id);

  // abortlaunch.upcoming = false;
  // abortlaunch.success = false;
  // return abortlaunch;
  const abortlaunch = await launchesDB.updateOne(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  console.log(abortlaunch, "abortlaunch");
  return abortlaunch.modifiedCount == 1;
}

module.exports = {
  // launches,
  LoadLaunchData,
  getallLaunch,
  addNewLaunch,
  isExistLaunch,
  AbortLaunchModel,
};
