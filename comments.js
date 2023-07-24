// create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4001;

// middleware
app.use(bodyParser.json());
app.use(cors());

// data
const commentsByPostId = {};

// GET /posts/:id/comments
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// POST /posts/:id/comments
app.post('/posts/:id/comments', (req, res) => {
  const commentId = require('crypto').randomBytes(4).toString('hex');
  const { content } = req.body;

  // get comments array from post id
  const comments = commentsByPostId[req.params.id] || [];
  // push new comment to array
  comments.push({ id: commentId, content, status: 'pending' });
  // set comments array to post id
  commentsByPostId[req.params.id] = comments;

  // emit event to event bus
  axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: req.params.id, status: 'pending' },
  });

  // respond to request
  res.status(201).send(comments);
});

// POST /events
app.post('/events', async (req, res) => {
  console.log('Event Received:', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    // get comment from post id
    const { id, postId, status, content } = data;
    const comments = commentsByPostId[postId];

    // find comment with matching id
    const comment = comments.find((comment) => comment.id === id);
    // update status
    comment.status = status;

    // emit event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { id, postId, status, content },
    });
  }

  res.send({});
});

// start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});