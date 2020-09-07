import path from 'path';
import express from 'express';
import createError from 'http-errors';

import home from './components/home';
import users from './components/users';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('twig').renderFile)
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */
app.use('/', home);
app.use('/users', users);

/**
 * Handling out of routes
 */
app.use(function (req, res, next) { next(createError(404)) });
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error.twig');
});

export default app;
