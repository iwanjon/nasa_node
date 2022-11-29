const request = require("supertest");
const app = require("../../app");
const { MongoCOnnect, MongoDIsconnesct } = require("../../services/mongo");
const { LoadPlanetData } = require("../../models/planets.model");
const { LoadLaunchData } = require("../../models/launch.model");

describe("Mongo", () => {
  beforeAll(async () => {
    await MongoCOnnect();
    await LoadPlanetData();
    // await LoadLaunchData();
  });
  afterAll(async () => {
    await MongoDIsconnesct();
  });

  describe("Test GET /launches", () => {
    test("It shoukd response 200", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
      // console.log(response, response.statusCode);
      // expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST /launches", () => {
    const input = {
      mission: "madang sik",
      rocket: "habis",
      target: "Kepler-1410 b",
      launchDate: "january 12, 2030",
    };

    const inputWithoutDate = {
      mission: "madang sik",
      rocket: "habis",
      target: "Kepler-1410 b",
    };

    const inputWithErrorDate = {
      mission: "madang sik",
      rocket: "habis",
      target: "Kepler-1410 b",
      launchDate: "january 12e, 2030",
    };

    test("It shoukd response 201", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(input)
        .expect("Content-Type", /json/)
        .expect(201);

      const ReqDate = new Date(input.launchDate).valueOf();
      const RespDate = new Date(response.body.launchDate).valueOf();

      expect(ReqDate).toBe(RespDate);

      expect(response.body).toMatchObject(inputWithoutDate);
      // console.log(response);
      // expect(response).toBe(200);
    });

    test("sould response 400", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(inputWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "invalid input",
      });
    });
    test("should reponse error date format", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(inputWithErrorDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "invalid date input",
      });
    });
  });
});
