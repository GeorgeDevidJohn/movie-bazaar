var express = require("express");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require('body-parser');    
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
var database = require("./config/database");

mongoose.connect(database.url);
var Movie = require('./models/movie');
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(database.url);
      console.log(`MongoDB Connected`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  const { validationResult, query } = require('express-validator');

  app.get('/api/movies', [
    query('page').optional().isInt().toInt(),
    query('perPage').optional().isInt().toInt(),
    query('title').optional().isString().trim(),
  ], async (req, res) => {
    try {
      // Validate query parameters
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { page, perPage, title } = req.query;
  
      // Convert page and perPage to integers
      const pageNumber = page || 1;
      const itemsPerPage = perPage || 10;
  
      let query = {};
  
      // If title is provided, add it to the query
      if (title) {
        query.title = { $regex: new RegExp(title, 'i') };
      }
  
      const movies = await Movie.find(query)
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);
  
      res.json({
        page: pageNumber,
        perPage: itemsPerPage,
        total: await Movie.countDocuments(query),
        movies: movies,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  //Display the details of the a particular movie
  app.get('/api/movies/:id', async (req, res) => {
    try {
      const movieId = req.params.id;

  
      // Find the movie by _id
      const movie = await Movie.findById(movieId);
  
      // Check if the movie exists
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
  
      // Return the movie object
      res.json(movie);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
app.put('/api/movies/:id', async (req, res) => {
    try {
      const movieId = req.params.id;
      console.log(req.body);
      var data = {
        plot : req.body.plot ,
        genres : req.body.genres ,
        runtime : req.body.runtime ,
        cast : req.body.cast ,
        poster : req.body.poster ,
        title : req.body.title ,
        fullplot : req.body.fullplot ,
        languages : req.body.languages ,
        released : req.body.released ,
        directors : req.body.directors ,
        rated : req.body.rated ,
        awards : req.body.awards ,
        lastupdated : req.body.lastupdated ,
        year : req.body.year ,
        imdb : req.body.imdb ,
        type : req.body.type ,
        tomatoes : req.body.tomatoes ,
        num_mflix_comments : req.body.num_mflix_comments ,
	}
    
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, data, { new: true });

    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//post
app.post('/api/movies', async (req, res) => {
    try {
      console.log(req.body);
     Movie.create({
        plot : req.body.plot ,
        genres : req.body.genres ,
        runtime : req.body.runtime ,
        cast : req.body.cast ,
        poster : req.body.poster ,
        title : req.body.title ,
        fullplot : req.body.fullplot ,
        languages : req.body.languages ,
        released : req.body.released ,
        directors : req.body.directors ,
        rated : req.body.rated ,
        awards : req.body.awards ,
        lastupdated : req.body.lastupdated ,
        year : req.body.year ,
        imdb : req.body.imdb ,
        type : req.body.type ,
        tomatoes : req.body.tomatoes ,
        num_mflix_comments : req.body.num_mflix_comments ,
	});

      return res.status(200).json({ message:'Movie added successfully' });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






app.delete('/api/movies/:id', async (req, res) => {
    try {
      const movieId = req.params.id;
      const deletedMovie = await Movie.deleteOne({_id : movieId});
  
      if (!deletedMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
  
      res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });





connectDB().then(() => {
    app.listen(6000, () => {
        console.log("App listening on port : " + 6000);
    })
})