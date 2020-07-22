const express = require('express');
const logger = require('morgan');
const prime = require('./build/Release/prime.node');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/userSchema');
const Contact = require('./models/contactSchema');
const middleware = require('./middleware');
const assert = require('assert');
const app = express();
let {
	PORT = 5000,
	MONGO_URI = 'mongodb://localhost/faclon',
} = process.env;

// DATABASE
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(() => console.log("Database connected"))
	.catch(console.log);

// MIDDLEWARE
app.use(bodyParser.json());
app.use(logger('dev'));

// ROUTES
const isNumeric = (value) => {
	return /^\d+$/.test(value);
}

app.get('/:number', (req, res) => {
	let number = req.params.number;
	if (!isNumeric(number)) {
		return res.status(400).json({ error: 'Invalid Number' });
	}
	number = Number(number);
	res.json({ primeNumbers: prime.prime(number) });
});

app.post('/register', middleware.validateRegister, (req, res) => {
	const { name, email, password, address, phone } = req.body;
	const newUserData = { name, email, password, address, phone };
	let newUser = User(newUserData);
	newUser.save()
		.then(() => res.json({ success: true }))
		.catch(err => {
			if (err.code === 11000) {
				return res.status(400).json({ error: "Phone Number / Email has already been registered" });
			} else {
				console.error(err);
				return res.status(500).json({ error: err });
			}
		});
});

app.get('/create/dummyContact', (req, res) => {
	Contact({name: 'test1'}).save().catch(console.log)
	Contact({name: 'test2'}).save().catch(console.log)
	res.json({success: true});
});

app.get('/delete/:id', (req, res) => {
	const id = req.params.id;
	mongoose.startSession()
		.then(_session => {
			session = _session;
			session.startTransaction();
			return User.findOne({ _id: id })
				.select('contacts')
				.session(session);
		})
		.then((user) => {
			assert.ok(user);
			return Contact.deleteMany(
				{ _id: { $in: user.contacts } }
			).session(session);
		})
		.then(() => User.deleteOne({ _id: id }).session(session))
		.then(() => session.commitTransaction())
		.then(() => session.endSession())
		.then(() => res.json({ success: true }))
		.catch(err => {
			console.log(err);
			res.status(400).json({ error: 'Invalid userId' })
		});
});

app.use(middleware.errorHandler);

// STARTING THE SERVER
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))