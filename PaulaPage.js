const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');
const { render } = require('express/lib/response');



// express app
const app = express();

//connect  to mongodb
const dbURI = 'mongodb://localhost:27017/testdb';  
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));
  

//register view engine 
app.set('view engine', 'ejs');



//middleware & static files
 
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));




//routes
app.get('/', (req, res) => {
   res.redirect('/blogs');
});

app.use((req, res, next) => {
  console.log('in the next middleware'); 
  next();
});

app.get('/about', (req, res) => {
  // res.send('<p>about page</p>');
  res.render('about', { title: 'About'});
});

//blogs routs
app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
  .then((result) => {
    res.render('index', { title: 'All Blogs', blogs: result})

  })
  .catch((err) => {
    console.log(err);
  })
});

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);

  blog.save()
    .then((result) => {
      res.redirect('/blogs');
    })
    .catch((err) => {
      console.log(err);
    })
})

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
  .then(result => {
    res.render('details', { blog: result, title: 'Blog Details' });
  })
  .catch(err => {
    console.log(err);
  });
})

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new Blog'});
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404'});
});  