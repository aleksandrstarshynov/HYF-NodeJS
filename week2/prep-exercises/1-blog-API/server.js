const express = require('express');
const fs = require('fs');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Create a blog post
app.post('/blogs', (req, res) => {
  let { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send('Title and content are required.');
  }

  if (!title.endsWith('.txt')) {
    title += '.txt';
  }

  fs.writeFileSync(title, content);
  res.end('ok');
});

// Update a blog post
app.put('/posts/:title', (req, res) => {
  let title = req.params.title;
  const content = req.body.content;

  if (!title || !content) {
    return res.status(400).send('Title and content are required.');
  }

  if (!title.endsWith('.txt')) {
    title += '.txt';
  }

  if (fs.existsSync(title)) {
    fs.writeFileSync(title, content);
    res.end('ok');
  } else {
    res.status(404).send('This post does not exist!');
  }
});

// Read the post
app.get('/blogs/:title', (req, res) => {
  let title = req.params.title;

  if (!title.endsWith('.txt')) {
    title += '.txt';
  }

  if (fs.existsSync(title)) {
    const post = fs.readFileSync(title, 'utf-8');
    res.status(200).send(post);
  } else {
    res.status(404).send('This post does not exist!');
  }
});

// Delete a blog post
app.delete('/blogs/:title', (req, res) => {
  let title = req.params.title;

  if (!title.endsWith('.txt')) {
    title += '.txt';
  }

  if (fs.existsSync(title)) {
    fs.unlinkSync(title);
    res.end('ok');
  } else {
    res.status(404).send('This post does not exist!');
  }
});

//list all existing blog posts
const path = require('path');
app.get('/blogs', (req, res) => {
  try {
    const files = fs.readdirSync('.'); 

    const blogs = files
      .filter(file => file.endsWith('.txt'))
      .map(file => ({
        title: path.basename(file, '.txt')
      }));
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while reading blog files.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
