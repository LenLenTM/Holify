const { Router } = require('express');
const controller = require('../controllers/book-controller');

const routes = Router();

routes.get('/categories', controller.getCategories);
routes.get('/categories/:category/books', controller.getCategoryBooks);
routes.get('/books/:id', controller.getBook);

/* --- Task 2 --- Add a route to create new books 
   endpoint: /categories/:category/books
 */

/* --- Task 3 --- Add a route to update a book 
   endpoint: /books/:id
 */

/* --- Task 4 --- Add a route to delete a book
   endpoint: /books/:id
 */


module.exports = routes;
