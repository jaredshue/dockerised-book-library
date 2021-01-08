const request = require("supertest");
const app = require("../server.js");

beforeAll(() => {
    process.env.NODE_ENV = "test";
});

test("GET /api/books", async () => {
    var response = await request(app).get("/api/books");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
});

test("GET /api/books/:bookID", async () => {
    var response = await request(app).get("/api/books/0");
    expect(response.status).toBe(200);
    expect(response.body.title).not.toBe(undefined);
    expect(response.body.author).not.toBe(undefined);
    expect(response.body.isbnNumber).not.toBe(undefined);
    expect(response.body.isCheckedOut).not.toBe(undefined);
    expect(response.body.checkedOutBy).not.toBe(undefined);
    expect(response.body.dateDue).not.toBe(undefined);
});

test("GET /api/books/:bookID/checkout/:userID", async () => {
  var response = await request(app).get("/api/books/0/checkout/0")
  expect(response.status).toBe(200);
  response = await request(app).get("/api/books/0");
  expect(response.status).toBe(200);
  expect(response.body.isCheckedOut).toBe(true);
  expect(response.body.checkedOutBy).toBe(0);
});

test("GET /api/books/:bookID/checkout/:userID", async () => {
  var response = await request(app).get("/api/books/1/checkout/0")
  expect(response.status).toBe(200);
  response = await request(app).get("/api/books/1/checkout/0");
  expect(response.status).toBe(200);
  expect(response.body.message).toBe("You have already checked out this book");
});

test("GET /api/books/:bookID/checkout/:userID", async () => {
  var response = await request(app).get("/api/books/2/checkout/1")
  expect(response.status).toBe(200);
  response = await request(app).get("/api/books/2/checkout/3");
  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Someone else has already checked out this book");
});

test("GET /api/books/:bookID/return", async () => {
  var response = await request(app).get("/api/books/3/checkout/4");
  expect(response.status).toBe(200);
  response = await request(app).get("/api/books/3/return");
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
})
