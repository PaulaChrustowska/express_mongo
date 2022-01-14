const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');



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
app.use(morgan('dev'));


//mongoose and mongo sandbox routes

app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'new blog 2.0',
    snippet: 'about my new blog',
    body: 'more about my new blog'
  });

  blog.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err);
    });
      
});



app.get('/all-blogs', (req, res) => {
  Blog.find()
  .then((result) => {
    res.send(result);
  }) 
  .catch((err) => {
    console.log(err)
  });
}); 


app.get('/single-blog', (req, res) => {
  Blog.findById('61e06647162f5ee4deb5b3cd')
  .then((result) => {
    res.send(result);
  }) 
  .catch((err) => {
    console.log(err)
  });
})


app.get('/', (req, res) => {
  const blogs = [
    {title: 'Sky is beautiful', snippet: 'Hello my friend!'},
    {title: 'Sky is beautiful', snippet: 'Hello my friend!'},
    {title: 'Sky is beautiful', snippet: 'Hello my friend!'},
  ];
  res.render('index', { title: 'Home', blogs });
});

app.use((req, res, next) => {
  console.log('in the next middleware'); 
  next();
});

app.get('/about', (req, res) => {
  // res.send('<p>about page</p>');
  res.render('about', { title: 'About'});
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new Blog'});
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404'});
});