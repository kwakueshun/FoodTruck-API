import mongoose from 'mongoose';
import Review from './review';
let Schema = mongoose.Schema;

let foodtruckSchema = new Schema({
    name: {
		type: String,
		required: true
	},
	foodType: {
		type: String,
		required: true
	},
	averageCost: Number,
	geometry: {
		type: { type: String, default: 'Point'},
		coordinates: {
			"lat": Number,
			"long": Number
		}
	},
	reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
});

module.exports = mongoose.model('FoodTruck', foodtruckSchema);
