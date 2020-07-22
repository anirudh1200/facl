const isEmpty = (string) => {
	if (!string) return true;
	else return false;
}

const isEmail = (email) => {
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email && email.match(regEx)) return true;
	else return false;
}

const isPhone = (phone) => {
	const regEx = /^\d{10}$/;
	if(phone && phone.toString().match(regEx)) return true;
	else return false;
}

module.exports.validateRegister = (req, res, next) => {
	const { name, email, phone, password, address } = req.body;
	let error = {}
	if (isEmpty(name)) error.name = 'Name is empty';
	if (!isPhone(phone)) error.phone = 'Not a valid Phone Number';
	if (isEmpty(phone)) error.phone = 'Phone Number is empty';
	if (!isEmail(email)) error.email = 'Not a valid Email';
	if (isEmpty(email)) error.email = 'Email is empty';
	if (password.length < 8) error.password = 'Length of password should be atleast 8 characters'
	if (isEmpty(password)) error.password = 'Password is empty';
	if (isEmpty(address)) error.address = 'Address is empty';
	if (Object.keys(error).length > 0) return next({ status: 400, error });
	else next();
}

module.exports.errorHandler = (err, req, res, next) => {
	return res.status(err.status).json(err.error);
}