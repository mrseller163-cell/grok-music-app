import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tracksRouter from './routes/tracks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Grok Music API is running!' });
});

app.use('/api/tracks', tracksRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
