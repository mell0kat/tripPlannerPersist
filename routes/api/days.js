var express = require('express');
var apiRouter = express.Router();
var models = require('../../models');
var Day = models.Day;

apiRouter.param('id',function(req,res,next,day){
	Day.findOne({_id: req.params.id})
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
		restaurants: null,
		activities: null
	})
	.then(function(day){
		res.status(200).send(day, "day created")
	})
})
//Add a hotel to a day
apiRouter.post('/:id/hotel',function(req,res,next){
		req.day.hotel = req.body.hotel;
		req.day.save()
		.then(function(){
			res.status(200).send("updated successfully")
		})
		.then(null, next)
})

//Delete hotel from day
apiRouter.delete('/:id/hotel',function(req,res,next){
	
	req.day.hotel = null;
	req.day.save()
	.then(function(){
			res.status(200).send("updated successfully")
		})
	.then(null, next)
})

//Add a restaurant to a day
apiRouter.post('/:id/restaurants',function(req,res,next){
	
		if (req.day.restaurants.length<3){
		req.day.restaurants.push(req.body.restaurant);
		req.day.save()
		.then(function(){
			res.status(200).send("updated successfully")
		})
		}else{
			next(new Error("You already have three restaurants"));
		}
	
})
apiRouter.delete('/:id/restaurants',function(req,res,next){
	
	req.day.restaurants.findOne({restaurants:req.body.restaurant}).remove()
	.then(function(){
		req.day.save()
	})
	.then(function(){
			res.status(200).send("updated successfully")
		})
	.then(null,next)
})
apiRouter.post('/:id/activities',function(req,res,next){
	
		if (req.day.activities.length<5){
			day.activities.push(req.body.activity);
			req.day.save()
			.then(function(){
				res.status(200).send("updated successfully")
		})
		}else{
			next(new Error("You already have three restaurants"));
		}
	
})
apiRouter.delete('/:id/activities',function(req,res,next){
	
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











