import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const AudioPlayer = ({ allSongs }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [songCurrentTime, setSongCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (id) => {
    const song = allSongs.find((song) => song.id === id);
    setCurrentSong(song);
    setSongCurrentTime(0);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const playNextSong = () => {
    if (!currentSong) {
      playSong(allSongs[0].id);
    } else {
      const currentSongIndex = allSongs.findIndex(
        (song) => song.id === currentSong.id
      );
      if (currentSongIndex !== -1 && currentSongIndex < allSongs.length - 1) {
        playSong(allSongs[currentSongIndex + 1].id);
      }
    }
  };

  const playPreviousSong = () => {
    if (!currentSong) return;
    const currentSongIndex = allSongs.findIndex(
      (song) => song.id === currentSong.id
    );
    if (currentSongIndex > 0) {
      playSong(allSongs[currentSongIndex - 1].id);
    }
  };

  const shuffle = () => {
    const shuffledSongs = [...allSongs].sort(() => Math.random() - 0.5);
    setCurrentSong(null);
    setSongCurrentTime(0);
    renderSongs(shuffledSongs);
    pauseSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
  };

  const deleteSong = (id) => {
    if (currentSong && currentSong.id === id) {
      setCurrentSong(null);
      setSongCurrentTime(0);
      pauseSong();
      setPlayerDisplay();
    }

    const updatedSongs = allSongs.filter((song) => song.id !== id);
    renderSongs(updatedSongs);
    highlightCurrentSong();
    setPlayButtonAccessibleText();

    if (updatedSongs.length === 0) {
      const resetButton = document.createElement('button');
      resetButton.id = 'reset';
      resetButton.setAttribute('aria-label', 'Reset Playlist');
      resetButton.innerText = 'Reset Playlist';

      resetButton.addEventListener('click', () => {
        renderSongs(allSongs);
        setPlayButtonAccessibleText();
        resetButton.remove();
      });
      playlistSongs.appendChild(resetButton);
    }
  };

  const renderSongs = (array) => {
    const songsList = document.getElementById('songs-list');
    songsList.innerHTML = array.map((song) => (
      <li key={song.id}>
        <button onClick={() => playSong(song.id)}>{song.title}</button>
      </li>
    ));
  };

  return (
    <div>
      <h1>Audio Player</h1>
      <ul>
        {allSongs.map((song) => (
          <li key={song.id}>
            <button onClick={() => playSong(song.id)}>{song.title}</button>
          </li>
        ))}
      </ul>
      {currentSong && (
        <div>
          <h2>Now Playing: {currentSong.title}</h2>
          {isPlaying ? (
            <button onClick={pauseSong}>Pause</button>
          ) : (
            <button onClick={() => playSong(currentSong.id)}>Play</button>
          )}
        </div>
      )}
    </div>
  );
};

const allSongs = [
  {
    id: 0,
    title: "Carl's First Halloween",
    artist: 'Earth Dad',
    duration: '1:57',
    src: 'https://open.spotify.com/track/4QxUGT7ibzYg2Ody5gHKI2?si=b38d50271e754681',
  },
  {
    id: 1,
    title: '20',
    artist: 'Earth Dad',
    duration: '4:01',
    src: 'https://open.spotify.com/track/7pkjMHZdqbTWfvhYWWidWE?si=70431bd5462249fe',
  },
  {
    id: 2,
    title: 'Drillbit',
    artist: 'Earth Dad',
    src: 'https://open.spotify.com/track/4zkezz9WbHd1lzyvU2MWrv?si=8ffddbb9731444a2',
  },
];

ReactDOM.render(
  <React.StrictMode>
    <AudioPlayer allSongs={allSongs} />
  </React.StrictMode>,
  document.getElementById('root')
);
