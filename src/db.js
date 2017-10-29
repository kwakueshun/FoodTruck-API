import mongoose from 'mongoose';
import config from './config';

var options = {
	useMongoClient: true
}
export default callBack => {
	let db = mongoose.connect(config.mongoUrl, options);
	callBack(db);
}