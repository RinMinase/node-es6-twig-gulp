import express from 'express';
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource, env = ' + process.env.TEST);
});

export default router;
