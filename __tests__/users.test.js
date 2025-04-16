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

test("200: Responds with an array of objects of users", () => {
  return request(server)
    .get("/api/users")
    .expect(200)
    .then(({ body }) => {
      const usersArray = body.users;
      usersArray.forEach((user) => {
        expect(user).toHaveProperty("user_id");
        expect(user).toHaveProperty("first_name");
        expect(user).toHaveProperty("last_name");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("address");
        expect(user).toHaveProperty("date_of_birth");
        expect(user).toHaveProperty("fav_food");
        expect(user).toHaveProperty("personality");
        expect(user).toHaveProperty("bio");
        expect(user).toHaveProperty("gender");
        expect(user).toHaveProperty("reason");
        expect(user).toHaveProperty("job_title");
        expect(user).toHaveProperty("coffee_tea");
        expect(user).toHaveProperty("image_url");
      });
    });
});

// test("400: Responds with error if user is invalid", () => {
//   return request(server)
//     .get("/api/users/ghdifi")
//     .expect(400)
//     .then(({ body: { msg } }) => {
//       expect(msg).toBe("Invalid user");
//     });
// });

// test("200: Responds with a single user", () => {
//   return request(server)
//     .get("/api/users/3")
//     .expect(200)
//     .then(({ body }) => {
//       const usersArray = body.users;
//       expect(Array.isArray(usersArray)).toBe(true);
//       expect(usersArray.length).toBe(4);
//       usersArray.forEach((user) => {
//         expect(typeof user.user_id).toBe("number");
//         expect(typeof user.first_name).toBe("string");
//         expect(typeof user.last_name).toBe("string");
//         expect(typeof user.email).toBe("string");
//         expect(typeof user.address).toBe("string");
//         expect(typeof user.date_of_birth).toBe("string");
//         expect(typeof user.fav_food).toBe("string");
//         expect(typeof user.personality).toBe("string");
//         expect(typeof user.bio).toBe("string");
//         expect(typeof user.gender).toBe("string");
//         expect(typeof user.reason).toBe("string");
//         expect(typeof user.job_title).toBe("string");
//         expect(typeof user.coffee_tea).toBe("string");
//         expect(typeof user.image_url).toBe("string");
//       });
//     });
// });

// test("404: Responds with error if endpoint is not found", () => {
//   return request(server)
//     .get("/api/users/999999")
//     .expect(404)
//     .then(({ body: { msg } }) => {
//       expect(msg).toBe("Invalid Endpoint!!");
//     });
// });

test("201: Creates a new user", () => {
  const newUser = {
    first_name: "steven",
    last_name: "Dddd",
    email: "steven@gmail.com",
    address: "london",
    phone_number: "",
    date_of_birth: "1999-04-11",
    fav_food: "fish",
    personality: "happy",
    bio: "hello",
    gender: "male",
    reason: "friends",
    job_title: "waiter",
    coffee_tea: "coffee",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  };
  return request(server)
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .then(({ body }) => {
      const usersArray = body.users;
      expect(Array.isArray(usersArray)).toBe(true);
      expect(usersArray.length).toBe(4);
      usersArray.forEach((user) => {
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
});

test("400: Responds with error message if one field is missing", () => {
  const newUser = {
    first_name: "",
    last_name: "Dickens",
    email: "charles.dickens@gmail.com",
    address: "",
    phone_number: "",
    date_of_birth: "1999-04-11",
    fav_food: "burger",
    personality: "",
    bio: "",
    gender: "Female",
    reason: "",
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
    first_name: "",
    last_name: "Dickens",
    email: "charles.dickens@gmail.com",
    address: "",
    phone_number: "",
    date_of_birth: "1999-04-11",
    fav_food: "burger",
    personality: "",
    bio: "",
    gender: "Female",
    reason: "",
    job_title: "Author",
    coffee_tea: "Tea",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  };
  return request(server)
    .post("/api/users")
    .send(newUser)
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid Endpoint!!");
    });
});

test("200: Responds with edited user", () => {
  const updateUser = {
    address: "",
    phone_number: "",
    fav_food: "pizza",
    personality: "happy",
    bio: "hello",
    gender: "Female",
    reason: "friends",
    job_title: "Chef",
    coffee_tea: "Coffee",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  }
    .patch("/api/users/4")
    .send(updateUser)
    .expect(200)
    .then(({ body }) => {
      const usersArray = body.users;
      expect(Array.isArray(usersArray)).toBe(true);
      expect(usersArray.length).toBe(4);
      usersArray.forEach((user) => {
        expect(typeof user.user_id).toBe("number");
        expect(typeof user.address).toBe("string");
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
});

test("400: Responds with error if user id is not a number", () => {
  const updateUser = {
    address: "",
    phone_number: "",
    fav_food: "pizza",
    personality: "happy",
    bio: "hello",
    gender: "Female",
    reason: "friends",
    job_title: "Chef",
    pet_owner: "yes",
    coffee_tea: "Coffee",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  };
  return request(server)
    .patch("/api/users/ghdifi")
    .send(updateUser)
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid Endpoint!!");
    });
});

test("404: Responds with error if user id is not a number", () => {
  const updateUser = {
    address: "",
    phone_number: "",
    fav_food: "pizza",
    personality: "happy",
    bio: "hello",
    gender: "Female",
    reason: "friends",
    job_title: "Chef",
    pet_owner: "yes",
    coffee_tea: "Coffee",
    image_url:
      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
  };
  return request(server)
    .patch("/api/users/999999")
    .send(updateUser)
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid Endpoint!!");
    });
});
