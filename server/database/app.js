const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const  cors = require('cors')
const app = express()
const port = 3030;

app.use(cors())
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(express.json());

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/",{'dbName':'dealershipsDB'});


const Reviews = require('./review');

const Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data['dealerships']);
  });
  
} catch (error) {
  console.error('Error initializing database:', error);
}


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching dealerships:', error);
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/state/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({ state: req.params.state });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching dealerships by state:', error);
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

// Express route to fetch dealer by ID under fetchDealers path
app.get('/fetchDealers/:id', async (req, res) => {
  try {
    const document = await Dealerships.findOne({ id: parseInt(req.params.id) });
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ error: 'Dealership not found' });
    }
  } catch (error) {
    console.error('Error fetching dealership by id:', error);
    res.status(500).json({ error: 'Error fetching dealership by id' });
  }
});

// Express route to fetch dealer by a particular id (alternative path)
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const document = await Dealerships.findOne({ id: req.params.id });
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ error: 'Dealership not found' });
    }
  } catch (error) {
    console.error('Error fetching dealership by id:', error);
    res.status(500).json({ error: 'Error fetching dealership by id' });
  }
});

//Express route to insert review
app.post('/insert_review', express.json(), async (req, res) => {
  try {
    const data = req.body;
    const documents = await Reviews.find().sort( { id: -1 } )
    let new_id = documents.length > 0 ? documents[0]['id'] + 1 : 1;

    // Validate required fields
    if (!data['name'] || !data['dealership'] || !data['review'] || !data['car_make'] || !data['car_model'] || !data['car_year']) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const review = new Reviews({
      "id": new_id,
      "name": data['name'],
      "dealership": data['dealership'],
      "review": data['review'],
      "purchase": data['purchase'] || false,
      "purchase_date": data['purchase_date'] || "",
      "car_make": data['car_make'],
      "car_model": data['car_model'],
      "car_year": data['car_year'],
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
