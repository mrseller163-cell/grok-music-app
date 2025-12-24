import React, { useState, useEffect } from 'react';
import './App.css';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
}

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/tracks')
      .then(res => res.json())
      .then(data => setTracks(data))
      .catch(err => console.error('Failed to fetch tracks:', err));
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="title">GROK MUSIC</h1>
        <div className="title-sub">CYBERPUNK AUDIO SYSTEM v1.0</div>
      </div>

      <div className="main-content">
        <div className="track-list">
          <div className="section-title">PLAYLIST</div>
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`track-item ${currentTrack?.id === track.id ? 'active' : ''}`}
              onClick={() => setCurrentTrack(track)}
            >
              <div className="track-info">
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artist}</div>
              </div>
              <div className="track-duration">{formatTime(track.duration)}</div>
            </div>
          ))}
        </div>

        <div className="player-section">
          {currentTrack && (
            <>
              <div className="now-playing">
                <div className="album-art">♫</div>
                <div className="current-track-info">
                  <div className="current-title">{currentTrack.title}</div>
                  <div className="current-artist">{currentTrack.artist}</div>
                  <div className="current-album">{currentTrack.album}</div>
                </div>
              </div>

              <div className="controls">
                <button className="control-btn">⏮</button>
                <button
                  className="control-btn play-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button className="control-btn">⏭</button>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '30%' }}></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
