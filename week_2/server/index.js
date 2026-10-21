// index.js: starts the web server and connects URLs to route files.
import 'dotenv/config';
import express from 'express';
import toursRouter from './routes/tours.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // lets Express read JSON request bodies (we need this for auth later)

// Any URL starting with /api/tours is handled by routes/tours.js.
// Inside that file, '/' means /api/tours and '/:id' means /api/tours/5.
app.use('/api/tours', toursRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});