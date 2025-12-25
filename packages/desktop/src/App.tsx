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
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  
  const t = translations[language];

    const albums = ['all', ...Array.from(new Set(tracks.map(t => t.album)))];
    const filteredTracks = selectedAlbum === 'all' ? tracks : tracks.filter(t => t.album === selectedAlbum);

    const deleteTrack = (trackId: string) => {
          const trackToDelete = tracks.find(t => t.id === trackId);
          if (trackToDelete?.url) URL.revokeObjectURL(trackToDelete.url);
          setTracks(tracks.filter(t => t.id !== trackId));
          if (currentTrack?.id === trackId) {
                  setCurrentTrack(null);
                  setIsPlaying(false);
                }
        };

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

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setShowCookieBanner(false);
    }
  }, []);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        const newTrack: Track = {
          id: Date.now().toString(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Local File',
          album: 'Uploaded',
          duration: Math.floor(audio.duration),
                    url: url
                              };
        setTracks([...tracks, newTrack]);
        setCurrentTrack(newTrack);
      });
    }

      const handleShare = () => {
            if (currentTrack && navigator.share) {- 
          navigator.share({
        title: currentTrack.title,
        text: `Listening to ${currentTrack.title} by ${currentTrack.artist}`,
        url: window.location.href
      }).catch(err => console.log('Share failed:', err));
    } else {
      alert('Share not supported on this device');
    }
  };

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieBanner(false);
  };

  const declineCookies = () => {
    setShowCookieBanner(false);
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

      <div className="upload-section">
        <div className="section-title">{t.uploadFile}</div>
        <input 
          type="file" 
          ref={fileInputRef}
          accept="audio/*"
          onChange={handleFileUpload}
        />
        <button 
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          {t.chooseFile}
        </button>
      </div>

      <div className="main-content">
        <div className="track-list">
          <div className="playlist-header">
            <div className="section-title">{t.playlist}</div>
            <select className="album-filter" value={selectedAlbum} onChange={(e) => setSelectedAlbum(e.target.value)}>
              {albums.map(album => (<option key={album} value={album}>{album === 'all' ? (language === 'en' ? 'All Albums' : 'Все альбомы') : album}</option>))}
            </select>
          </div>
          {filteredTracks.map((track) => (
            <div key={track.id} className={`track-item ${currentTrack?.id === track.id ? 'active' : ''}`}>
              <div className="track-info" onClick={() => setCurrentTrack(track)}>
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artist}</div>
              </div>
              <div className="track-duration">{formatTime(track.duration)}</div>
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteTrack(track.id); }} title={language === 'en' ? 'Delete' : 'Удалить'}>×</button>
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
                <button className="share-btn" onClick={handleShare}>
                  {t.share}
                </button>
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

      {showCookieBanner && (
        <div className="cookie-banner">
          <div className="cookie-content">
            <h3>{t.cookieTitle}</h3>
            <p>{t.cookieMessage}</p>
          </div>
          <div className="cookie-buttons">
            <button className="cookie-btn" onClick={acceptCookies}>
              {t.acceptCookies}
            </button>
            <button className="cookie-btn decline" onClick={declineCookies}>
              {t.declineCookies}
            </button>
          </div>
        </div>
      )}

      <div className="footer">
        <a href={t.telegramLink} target="_blank" rel="noopener noreferrer" className="telegram-link">
          {t.telegram}
        </a>
      </div>
    </div>
  );
}

export default App;
