const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// Handler function to wrap each route. 
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).render("error", {error, title: "Server Error"});
    }
  }
}

// GET books listing. 
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books: books, title: "Library" });
}));

// GET create new book form
router.get('/new', (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book'});
});

// POST create book
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("form-error", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));

// Edit book form
router.get('/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    res.render('update-book', { book: book, title: book.title });
  }else{
    res.render('error');
  }
}))

// Update individual book
router.post('/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/');
}))

// Delete a book
router.post('/:id/delete', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/');
}))

// If url is not valid, then render 404 page
router.use(function(req, res, next) {
  res.status(404);
  res.render('page-not-found');
});

module.exports = router;
