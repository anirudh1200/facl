const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	password: {
		type: String
	},
	email: {
		type: String,
	},
	address: {
		type: String,
	},
	phone: {
		type: String,
	},
	contacts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Contact'
	}],
});

userSchema.index({ email: 1, phone: 1}, { unique: true });

module.exports = mongoose.model('User', userSchema);