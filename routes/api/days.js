var express = require('express');
var apiRouter = express.Router();
var models = require('../../models');
var Day = models.Day;
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;

apiRouter.param('dayNum',function(req,res,next,day){
	console.log("params thing happening")
	Day.findOne({number: parseInt(req.params.dayNum, 10)})
	.then(function(day){
		req.day = day;
		next();
	})
	.then(null, next)
})
//get list of all days
apiRouter.get('/',function(req,res,next){

	Day.find({})
	.then(function(days){
		res.status(200).send(days);
	})
	.then(null,next)
})

//get one specific id
// apiRouter.get('/:id',function(req,res){
// 	// console.log("hello");
// 	res.send(req.day);
// })

apiRouter.get('/:dayNum',function(req,res){
	console.log("In the new route we just made")
	res.status(200).send(req.day);
})

//delete one day
apiRouter.delete('/:id',function(req,res,next){

	req.day.remove()
	.then(function(){
		res.status(200).send("day was deleted successfully")
	})
	.then(null,next)
})


//create new day
apiRouter.post('/',function(req,res){
	
	Day.create({
		number: req.body.dayNum,
		hotel: null,
		restaurants: [],
		activities: [],
	})
	.then(function(day){
		res.status(200).send(day, "day created")
	})
})
//Add a hotel to a day
apiRouter.post('/:dayNum/hotels',function(req,res,next){
		
		Hotel.findOne({name: req.body.placeName})
		.then(function(hotel){
			req.day.hotel = hotel._id;
			return req.day.save();
		})
		.then(function(){
			res.status(200).send("updated successfully")
		})
		.then(null, next)
		
})

//Delete hotel from day
apiRouter.delete('/:dayNum/hotels',function(req,res,next){
	Hotel.findOne({name: req.body.placeName})
		.then(function(hotel){
			req.day.hotel = null;
			return req.day.save();
		})
		.then(function(){
			console.log("we deleting")
			res.status(200).send("updated successfully")
		})
		.then(null, next)

})

//Add a restaurant to a day
apiRouter.post('/:dayNum/restaurants',function(req,res,next){
		Restaurant.findOne({name: req.body.placeName})
		.then(function(restaurant){
			req.day.restaurants.push(restaurant._id);
			return req.day.save();
		})
		.then(function(){
			res.status(200).send("updated successfully")
		})
		.then(null, next)

	
})
apiRouter.delete('/:dayNum/restaurants',function(req,res,next){
	Restaurant.findOne({name: req.body.placeName})
		.then(function(restaurant){
			var index = req.day.restaurants.indexOf(restaurant._id);
			req.day.restaurants[index] = null;
			return req.day.save();
		})
		.then(function(){
			res.status(200).send("updated successfully")
		})
		.then(null, next)




	// req.day.restaurants.findOne({restaurants:req.body.restaurant}).remove()
	// .then(function(){
	// 	req.day.save()
	// })
	// .then(function(){
	// 		res.status(200).send("updated successfully")
	// 	})
	// .then(null,next)
})
apiRouter.post('/:dayNum/activities',function(req,res,next){
	
	Activity.findOne({name: req.body.placeName})
		.then(function(activity){
			req.day.activities.push(activity._id);
			return req.day.save();
		})
		.then(function(){
			res.status(200).send("updated successfully")
		})
		.then(null, next)

	
})
apiRouter.delete('/:dayNum/activities',function(req,res,next){
	
	req.day.activities.findOne({activities: req.body.activity}).remove()
	.then(function(){
		req.day.save()
	})
	.then(function(){
			res.status(200).send("updated successfully")
		})
	.then(null, next)
})


module.exports = apiRouter;











