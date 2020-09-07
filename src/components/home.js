import express from 'express';
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home.twig', { title: 'Site' });
});

export default router;
