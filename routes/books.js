const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// Handler function to wrap each route. 
function asyncHandler(cb) {
  return async(req, res, next) => {
      try{
          await cb(req, res, next);
      }catch(error) {
          next(error);
      };
  };
};

// GET books listing. 
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books: books, title: "Library" });
}));

// GET create new book form
router.get('/new', asyncHandler(async(req, res) => {
  res.render('new-book', { book: {}, title: 'New Book'});
}));

// POST create book
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));

// Edit book form
router.get('/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  
	if(book){
		res.render('update-book', { book, title: book.title }); 
	} else {
		const err = new Error();
		err.status = 404;
		throw err;
	};
}))

// Update individual book
router.post('/:id', asyncHandler(async(req, res) => {
	let book;

	try{
    book = await Book.findByPk(req.params.id);
    
		if(book){
			await book.update(req.body);
			res.redirect('/books');
		}else{
			const err = new Error();
			err.status = 404;
			throw err;
		};
	}catch(error){
		if(error.name === 'SequelizeValidationError'){
			book = await Book.build(req.body);
			book.id = req.params.id;
			res.render('update-book', { book, errors: error.errors, title: 'Update Book' })
		}else{
			throw error;
		};
	};
}))

// Delete a book
router.post('/:id/delete', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  
	if(book){
		console.log(book.title, book.id, 'delete');
		await book.destroy();
		res.redirect('/books');
	}else{
		const err = new Error();
		err.status = 404;
		throw err;
	};
}));

router.use(function(req, res, next) {
  res.status(404);
  res.render('page-not-found');
});


module.exports = router;
