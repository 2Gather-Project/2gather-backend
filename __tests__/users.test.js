const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const fastifyApp = require("../userApp");
const users = require("../db/data/test-data/users");

let server;

beforeAll(async () => {
  await fastifyApp.ready();
  server = fastifyApp.server;
});

beforeEach(() => {
  return seed(data);
});

afterAll(async () => {
  await fastifyApp.close();
  await db.end();
});

test("404: Responds with error if endpoint is not found", () => {
  return request(server)
    .get("/api/ghfg")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid Endpoint!!");
    });
});

test("400: Responds with error if user is invalid", () => {
  return request(server)
    .get("/api/users/ghdifi")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid user");
    });
});

test("200: Responds with a single user", () => {
  return request(server)
    .get("/api/users/1")
    .expect(200)
    .then(({ body }) => {
      const user = body.user;
      expect(user).toHaveProperty("user_id");
      expect(typeof user.user_id).toBe("number");
      expect(typeof user.first_name).toBe("string");
      expect(typeof user.last_name).toBe("string");
      expect(typeof user.email).toBe("string");
      expect(typeof user.address).toBe("string");
      expect(typeof user.date_of_birth).toBe("string");
      expect(typeof user.fav_food).toBe("string");
      expect(typeof user.personality).toBe("string");
      expect(typeof user.bio).toBe("string");
      expect(typeof user.gender).toBe("string");
      expect(typeof user.reason).toBe("string");
      expect(typeof user.job_title).toBe("string");
      expect(typeof user.coffee_tea).toBe("string");
      expect(typeof user.image_url).toBe("string");
    });
});

test("404: Responds with error if endpoint is not found", () => {
  return request(server)
    .get("/api/users/999999")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid Endpoint!!");
    });
});

test("201: Responds with creating a new user", () => {
  const newUser = {
    first_name: "Steven",
    last_name: "Dodd",
    email: "steven@gmail.com",
    address: "London",
    phone_number: "07207123456",
    date_of_birth: "1999-04-10",
    fav_food: "Fish",
    personality: "Happy",
    bio: "Hello!",
    gender: "Male",
    reason: "Friends",
    job_title: "Waiter",
    coffee_tea: "Coffee",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  };
  return request(server)
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .then(({ body }) => {
      const user = body.user;
      const reformattedDate = user.date_of_birth;
      const expectedDate = newUser.date_of_birth;
      expect(reformattedDate).toBe(expectedDate);
      expect(typeof user.user_id).toBe("number");
      expect(user).toMatchObject(newUser);
    });
});

test("400: Responds with error message if required fields are missing", () => {
  const newUser = {
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone_number: "07207123456",
    date_of_birth: "1999-04-11",
    fav_food: "Pasta",
    personality: "Introverted",
    bio: "Hello!",
    gender: "Female",
    reason: "Friends",
    job_title: "Author",
    coffee_tea: "Tea",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  };
  return request(server)
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Field is required");
    });
});

test("404: Responds with error if endpoint is not found", () => {
  const newUser = {
    first_name: "Katie",
    last_name: "Hardy",
    email: "katie@gmail.com",
    address: "London",
    phone_number: "0720712345",
    date_of_birth: "1999-04-11",
    fav_food: "Burger",
    personality: "Happy",
    bio: "Hello!",
    gender: "Female",
    reason: "Friends",
    job_title: "Author",
    coffee_tea: "Tea",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  };
  return request(server)
    .post("/api/usr")
    .send(newUser)
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid Endpoint!!");
    });
});

test("200: Responds with edited user information", () => {
  const updateUser = {
    address: "Edinburgh",
    phone_number: "0720712346",
    fav_food: "Pizza",
    personality: "Sad",
    bio: "Nice to meet you!",
    gender: "Female",
    reason: "Events",
    job_title: "Chef",
    coffee_tea: "Coffee",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  };
  return request(server)
    .patch("/api/users/1")
    .send(updateUser)
    .expect(200)
    .then(({ body }) => {
      const user = body.user;
      expect(typeof user.user_id).toBe("number");
      expect(user).toMatchObject(updateUser);
    });
});

test("400: Responds with error if user id is not a number", () => {
  const updateUser = {
    address: "Edinburgh",
    phone_number: "0720712346",
    fav_food: "Pizza",
    personality: "Crazy",
    bio: "Hello",
    gender: "Female",
    reason: "Friends",
    job_title: "Actor",
    pet_owner: "Yes",
    coffee_tea: "Coffee",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  };
  return request(server)
    .patch("/api/users/ghdifi")
    .send(updateUser)
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid user_id");
    });
});
