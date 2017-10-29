import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import { authenticate } from '../middleware/authMiddleware';


export default({ config, db }) => {

	let api = Router();

	// '/vi/foodtruck/add'
	api.post('/add', authenticate, (req, res) => {
		let foodtruck = new FoodTruck();
		foodtruck.name = req.body.name;
		foodtruck.foodType = req.body.foodType;
		foodtruck.averageCost = req.body.averageCost;
		foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;		
		foodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;		
		
		foodtruck.reviews = req.body.reviews;
		
		foodtruck.save(err => {

			if(err) {
				res.send(err);
			}
			res.json({
				message: 'FoodTruck saved successfully'
			});
		});
	});

	// '/vi/foodtruck' GetAll
	api.get('/', (req, res) => {
		FoodTruck.find({}, (err, foodtrucks) =>{

			if(err) {
				res.send(err);
			}
			res.json(foodtrucks);
		});
	});


		// '/vi/foodtruck/:id' GetById
	api.get('/:id', authenticate, (req, res) => {
		FoodTruck.findById(req.params.id, (err, foodtruck) =>{

			if(err) {
				res.send(err);
			}
			res.json(foodtruck);
		});
	});

	// '/vi/foodtruck/:id' Update
	api.put('/:id', authenticate, (req, res) => {
		FoodTruck.findById(req.params.id, (err, foodtruck) => {

			if(err) {
				res.send(err);
			}

			foodtruck.name = req.body.name;
			foodtruck.foodType = req.body.foodType;
			foodtruck.averageCost = req.body.averageCost;
			foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;		
			foodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;		
	
			foodtruck.save(err=> {
				if(err) {
					res.send(err);
				}
				res.json({message: "FoodTruck info updated"});
			});

		});
			
	});


	// '/vi/foodtruck/:id' Delete
	api.delete('/:id', authenticate, (req, res) => {
		FoodTruck.findById(req.params.id, (err, foodtruck) => {
			if (err) {
				res.status(500).send(err);
				return;
			  }
			if (foodtruck === null) {
				res.status(404).send("Foodtruck not found");
				return;
			}
			FoodTruck.remove({
				_id: req.params.id
			  }, (err, foodtruck) => {
				if (err) {
					res.status(500).send(err);
					return;
				}
				Review.remove({
				  foodtruck: req.params.id
				}, (err, review) => {
				  if (err) {
					res.send(err);
				  }
				  res.json({message: "Food Truck and Reviews Successfully Removed"});
				});
			  });
		});
		
	});


	// add review for specific food truck id /v1/foodtruck/reviews/add/:id
	api.post('/reviews/add/:id', authenticate, (req, res) => {
		FoodTruck.findById(req.params.id, (err, foodtruck) => {
			if(err) {
				res.send(err);
			}
			let newReview = new Review();
			newReview.title = req.body.title;
			newReview.text = req.body.text;
			newReview.foodtruck = foodtruck._id;
			newReview.save((err, review) => {
				if(err) {
					res.send(err);
				}
				foodtruck.reviews.push(newReview);
				foodtruck.save(err => {
					if(err) {
						res.send(err);
					}
					res.json({message: 'Food truck review saved'});
				});
			});
		});
	});

		// get reviews for specific food truck id /v1/foodtruck/reviews/:id
		api.get('/reviews/:id', (req, res) => {
			Review.find({foodtruck: req.params.id}, (err, reviews) => {
				if(err) {
					res.send(err);
				}
				res.json(reviews);
			});
		});			

	return api;
}
