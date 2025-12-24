import { Router } from 'express';

const router = Router();

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  createdAt: string;
}

const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Example Track',
    artist: 'Grok Music',
    album: 'Demo Album',
    duration: 180,
    url: 'https://example.com/track.mp3',
    createdAt: new Date().toISOString()
  }
];

router.get('/', (req, res) => {
  res.json(mockTracks);
});

router.get('/:id', (req, res) => {
  const track = mockTracks.find(t => t.id === req.params.id);
  if (!track) {
    return res.status(404).json({ error: 'Track not found' });
  }
  res.json(track);
});

export default router;
