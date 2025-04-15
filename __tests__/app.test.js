const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const fastifyApp = require("../app");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(fastifyApp)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/users", () => {
  test("200: gets all the users", () => {
    return request(fastifyApp)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/events", () => {
  test("200: Responds with all the events", () => {
    return request(fastifyApp)
      .get("/api/events")
      .expect(200)
      .then(({ body: { events } }) => {
        expect(events.length).toBe(13);
        events.forEach((event) => {
          expect(typeof event.title).toBe("string");
          expect(typeof event.description).toBe("string");
          expect(typeof event.location).toBe("string");
          expect(typeof event.category).toBe("OTHER");
          expect(typeof event.status).toBe("ACTIVE");
        });
      });
  });
  // test("404: Responds with path not found", () => {
  //   return request(app)
  //     .get("/api/event")
  //     .expect(404)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toBe("Invalid Endpoint!!");
  //     });
  // });
  // test("200: Responds with all the events with sort order descending on created at", () => {
  //   return request(app)
  //     .get("/api/events?sort_by=created_at&&order=desc")
  //     .expect(200)
  //     .then(({ body: { events } }) => {
  //       expect(events.length).toBe(13);
  //       expect(events).toBeSortedBy("created_at", { descending: true });
  //       events.forEach((event) => {
  //         expect(typeof event.title).toBe("string");
  //         expect(typeof event.description).toBe("string");
  //         expect(typeof event.location).toBe("string");
  //         expect(typeof event.category).toBe("OTHER");
  //         expect(typeof event.status).toBe("ACTIVE");
  //       });
  //     });
  // });

  // test("404: Responds with all the events with sort by bananas order by desc", () => {
  //   return request(app)
  //     .get("/api/events?sort_by=bananas&&order=desc")
  //     .expect(404)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toBe("Invalid Input");
  //     });
  // });

  // test("200: Responds with all the articles with the value of topic", () => {
  //   return request(app)
  //     .get("/api/articles?column_name=topic&&value=mitch")
  //     .expect(200)
  //     .then(({ body: { articles } }) => {
  //       expect(articles.length).toBe(12);
  //       expect(articles).toBeSortedBy("created_at", { descending: true });
  //       articles.forEach((article) => {
  //         expect(typeof article.title).toBe("string");
  //         expect(article.topic).toBe("mitch");
  //         expect(typeof article.votes).toBe("number");
  //         expect(typeof article.author).toBe("string");
  //         expect(typeof article.article_img_url).toBe("string");
  //         expect(typeof article.comment_count).toBe("string");
  //       });
  //     });
  // });

  // test("404: Responds with all the articles with the value of topic that does not exists", () => {
  //   return request(app)
  //     .get("/api/articles?column_name=topic&&value=3")
  //     .expect(404)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toBe("Article id not found!!");
  //     });
  // });
});


