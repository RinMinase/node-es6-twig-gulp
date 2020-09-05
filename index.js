require('dotenv').config();

const app = require('express')();
const port = 3000;

app.get('/', (_request, response) => {
	response.end('Express App');
});

app.get('/home', (_request, response) => {
	response.end('Test Home Page, ENV = ' + process.env.TEST);
});

console.log('Application ready on http://localhost:' + port);
app.listen(port);