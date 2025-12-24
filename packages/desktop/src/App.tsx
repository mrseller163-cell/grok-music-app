import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { translations, Language } from './i18n';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url?: string;
}

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [language, setLanguage] = useState<Language>('en');
  
  const t = translations[language];

  useEffect(() => {
    fetch('http://localhost:3000/api/tracks')
      .then(res => res.json())
      .then(data => setTracks(data))
      .catch(err => console.error('Failed to fetch tracks:', err));
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Play error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url || '';
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && currentTrack) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * currentTrack.duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playNext = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex < tracks.length - 1) {
        setCurrentTrack(tracks[currentIndex + 1]);
      }
    }
  };

  const playPrevious = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex > 0) {
        setCurrentTrack(tracks[currentIndex - 1]);
      }
    }
  };

  return (
    <div className="app">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />
      
      <div className="app-header">
        <div className="header-top">
          <div className="language-switcher">
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`lang-btn ${language === 'ru' ? 'active' : ''}`}
              onClick={() => setLanguage('ru')}
            >
              RU
            </button>
          </div>
        </div>
        <h1 className="title">{t.title}</h1>
        <div className="title-sub">{t.subtitle}</div>
      </div>

      <div className="ai-generators">
        <div className="section-title">{t.aiGenerators}</div>
        <div className="ai-buttons">
          <a href="https://suno.com" target="_blank" rel="noopener noreferrer" className="ai-btn">
            {t.suno}
          </a>
          <a href="https://udio.com" target="_blank" rel="noopener noreferrer" className="ai-btn">
            {t.udio}
          </a>
          <a href="https://huggingface.co/facebook/musicgen-large" target="_blank" rel="noopener noreferrer" className="ai-btn">
            {t.musicgen}
          </a>
        </div>
      </div>

      <div className="main-content">
        <div className="track-list">
          <div className="section-title">{t.playlist}</div>
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
                <button className="control-btn" onClick={playPrevious} title={t.previous}>⏮</button>
                <button
                  className="control-btn play-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? t.pause : t.play}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button className="control-btn" onClick={playNext} title={t.next}>⏭</button>
              </div>

              <div className="progress-bar" onClick={handleProgressClick}>
                <div 
                  className="progress-fill" 
                  style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                />
              </div>
              
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="footer">
        <a href={t.telegramLink} target="_blank" rel="noopener noreferrer" className="telegram-link">
          {t.telegram}
        </a>
      </div>
    </div>
  );
}

export default App;
