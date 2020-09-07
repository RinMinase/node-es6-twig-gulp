import express from 'express';
const router = express.Router();

// import page from '../views/index.twig';
// const page = require('../views/layout.twig');

router.get('/', function(req, res, next) {
  res.render('index.twig', { title: 'Express' });
});

// router.get('/', (_request, response) => {
// 	response.end('Express App');
// });

export default router;
