import config from '../config';
import express from 'express';
import middleware from '../middleware';
import initializeDb from '../db';
import foodtruck from '../controller/foodtruck';
import account from '../controller/account';


let router = express();

// connect to db
initializeDb(db => {

	// Internal middleware
	router.use(middleware({config, db}));

	// API Routes
	router.use('/foodtruck', foodtruck({ config, db}));
	router.use('/account', account({ config, db }));	
});

export default router;

