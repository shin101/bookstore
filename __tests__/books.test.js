const db = require("../db");
process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const Book = require("../models/book");

beforeEach(async()=>{
    await db.query(`
    INSERT INTO 
        books (isbn,amazon_url,author,language,pages,publisher,title,year)
    VALUES ('111111111',
    'http://a.co/eobPtX2',
    'Test Testerson',
    'English',
    264,
    'Test University Press',
    'Power-Up: Unlocking Hidden Math in Video Games',
    2017)`);
});


// post 
describe("POST /books", function () {
    test("Creates a new book", async function () {
      const response = await request(app)
          .post(`/books`)
          .send({"book":{
                isbn: "32794782",
                amazon_url: "https://taco.com",
                author: "mctest",
                language: "english",
                pages: 1000,
                publisher: "yeah right",
                title: "amazing times",
                year: 2000
          }});
      expect(response.statusCode).toBe(201);
      expect(response.body.book).toHaveProperty("isbn");
    });
});


// get all
test("GET all books", async function(){
    let res = await Book.findAll();
    expect(res).toEqual([{
            "isbn": "111111111",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Test Testerson",
            "language": "English",
            "pages": 264,
            "publisher": "Test University Press",
            "title": "Power-Up: Unlocking Hidden Math in Video Games",
            "year": 2017
        }])
});

// get id
test("GET a specific book info", async function(){
    let isbn = 111111111
    let res = await Book.findOne(isbn);
    expect(res).toEqual({
            "isbn": "111111111",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Test Testerson",
            "language": "English",
            "pages": 264,
            "publisher": "Test University Press",
            "title": "Power-Up: Unlocking Hidden Math in Video Games",
            "year": 2017
        })
});


// put 
test("Update a specific book info", async function(){
    let isbn = 111111111
    let response = await request(app)
    .put(`/books/${isbn}`)
    .send({"book":{
                isbn: "111111111",
                amazon_url: "https://taco.com",
                author: "UPDATED!!!",
                language: "english",
                pages: 1000,
                publisher: "UPDATED!!!",
                title: "UPDATED!!!",
                year: 2000
        }});
        expect(response.statusCode).toBe(200);
        expect(response.body.book).toHaveProperty("isbn");
});


// delete
test("Delete a book", async function(){
    let isbn = 111111111;
    let response = await request(app)
    .delete(`/books/${isbn}`);
    expect.objectContaining({ message: "Book deleted" });

});



afterEach(async ()=>{
    await db.query("DELETE FROM BOOKS");
})

afterAll(async function(){
    await db.end();
});