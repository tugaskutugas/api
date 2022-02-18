const { nanoid } = require('nanoid');
const { reset } = require('nodemon');
const books = require('./books');
const addBookHandler = (req, h) => {
 const {
 name,
 year,
 author,
 summary,
 publisher,
 pageCount,
 readPage,
 reading,
 } = req.payload;
 const id = nanoid(16);
 const insertedAt = new Date().toISOString();
 const updatedAt = insertedAt;
 const finished = pageCount === readPage;
 if (name === undefined) {
 const res = h.response({
 status: 'fail',
 message: 'Gagal menambahkan buku. Mohon isi nama buku',
 });
 res.code(400);
 return res;
 }
 if (readPage > pageCount) {
 const res = h.response({
 status: 'fail',
 message: 'Gagal menambahkan buku. readPage tidak boleh lebih
besar dari pageCount',
 });
 res.code(400);
 return res;
 }
 const newBookData = {
 id,
 name,
 year,
 author,
 summary,
 publisher,
 pageCount,
 readPage,
 finished,
 reading,
 insertedAt,
 updatedAt,
 };
 books.push(newBookData);
 const isAdded = books.filter((book) => book.id === id).length > 0;
 if (isAdded) {
 const res = h.response({
 status: 'success',
 message: 'Buku berhasil ditambahkan',
 data: {
 bookId: id,
 },
 });
 res.code(201);
 return res;
 }
 const res = h.response({
 status: 'error',
 message: 'Buku gagal ditambahkan',
 });
 res.code(500);
 return res;
};
const getAllBooksHandler = (req) => {
 const { name: nameQuery, reading: readingQuery, finished:
finishedQuery } = req.query;
 if (nameQuery !== undefined) {
 const filterBooksArray = books.filter((book) => {
 const bookName = book.name.toLowerCase().split(' ');
 const isContained = bookName.some(chunk => chunk ===
nameQuery.toLowerCase());
 return isContained;
 });
 const formatedBooks = filterBooksArray.map((book) => {
 const { id, name, publisher } = book;
 return { id, name, publisher };
 });
 const res = {
 status: 'success',
 data: {
 books:
 formatedBooks,
 },
 };
 return res;
 }
 if (readingQuery !== undefined) {
 if (readingQuery === '1') {
 const filterBooksArray = books.filter((book) => book.reading);
 const formatedBooks = filterBooksArray.map((book) => {
 const { id, name, publisher } = book;
 return { id, name, publisher };
 });
 const res = {
 status: 'success',
 data: {
 books:
 formatedBooks,
 },
 };
 return res;
 }
 if (readingQuery === '0') {
 const filterBooksArray = books.filter((book) => !book.reading);
 const formatedBooks = filterBooksArray.map((book) => {
 const { id, name, publisher } = book;
 return { id, name, publisher };
 });
 const res = {
 status: 'success',
 data: {
 books:
 formatedBooks,
 },
 };
 return res;
 }
 }
 if (finishedQuery !== undefined) {
 if (finishedQuery === '1') {
 const filterBooksArray = books.filter((book) => book.finished);
 const formatedBooks = filterBooksArray.map(book => {
 const { id, name, publisher } = book;
 return { id, name, publisher };
 });
 const res = {
 status: 'success',
 data: {
 books:
 formatedBooks,
 },
 };
 return res;
 }
 if (finishedQuery === '0') {
 const filterBooksArray = books.filter((book) => !book.finished);
 const formatedBooks = filterBooksArray.map(book => {
 const { id, name, publisher } = book;
 return { id, name, publisher };
 });
 const res = {
 status: 'success',
 data: {
 books:
 formatedBooks,
 },
 };
 return res;
 }
 }
 const formatedBooks = books.map((book) => {
 const { id, name, publisher } = book;
 return { id, name, publisher };
 });
 const res = {
 status: 'success',
 data: {
 books:
 formatedBooks,
 },
 };
 return res;
};
const getBookByIdHandler = (req, h) => {
 const { bookId } = req.params;
 const thisBook = books.filter(book => book.id === bookId)[0];
 if (thisBook === undefined) {
 const res = h.response({
 status: 'fail',
 message: 'Buku tidak ditemukan',
 });
 res.code(404);
 return res;
 }
 const res = h.response({
 status: 'success',
 data: {
 book:
 thisBook,
 },
 });
 res.code(200);
 return res;
};
const editBookByIdHandler = (req, h) => {
 const { bookId } = req.params;
 const {
 name,
 year,
 author,
 summary,
 publisher,
 pageCount,
 readPage,
 reading,
 } = req.payload;
 const updatedAt = new Date().toISOString();
 if (name === undefined) {
 const res = h.response({
 status: 'fail',
 message: 'Gagal memperbarui buku. Mohon isi nama buku',
 });
 res.code(400);
 return res;
 }
 if (readPage > pageCount) {
 const res = h.response({
 status: 'fail',
 message: 'Gagal memperbarui buku. readPage tidak boleh lebih
besar dari pageCount',
 });
 res.code(400);
 return res;
 }
 const index = books.findIndex((book) => book.id === bookId);
 if (index !== -1) {
 books[index] = {
 ...books[index],
 name,
 year,
 author,
 summary,
 publisher,
 pageCount,
 readPage,
 reading,
 updatedAt,
 };
 const res = h.response({
 status: 'success',
 message: 'Buku berhasil diperbarui',
 });
 res.code(200);
 return res;
 }
 const res = h.response({
 status: 'fail',
 message: 'Gagal memperbarui buku. Id tidak ditemukan',
 });
 res.code(404);
 return res;
};
const deleteBookByIdHandler = (req, h) => {
 const { bookId } = req.params;
 const index = books.findIndex(book => book.id === bookId);
 if (index !== -1) {
 books.splice(index, 1);
 const res = h.response({
 status: 'success',
 message: 'Buku berhasil dihapus',
 });
 res.code(200);
 return res;
 }
 const res = h.response({
 status: 'fail',
 message: 'Buku gagal dihapus. Id tidak ditemukan',
 });
 res.code(404);
 return res;
};
module.exports = {
 addBookHandler,
 getAllBooksHandler,
 getBookByIdHandler,
 editBookByIdHandler,
 deleteBookByIdHandler,
};
