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
    if (!userData?.currentSong) {
      playSong(userData?.songs[0].id);
    } else {
      const currentSongIndex = getCurrentSongIndex;
      playSong(userData?.songs[currentSongIndex + 1]?.id);
    }
  };

  const playPreviousSong = () => {
    if (!userData?.currentSong) return;
    const currentSongIndex = getCurrentSongIndex();
    playSong(userData?.songs[currentSongIndex - 1]?.id);
  };

  const shuffle = () => {
    userData?.songs.sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    renderSongs(userData?.songs);
    pauseSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
  };

  const deleteSong = (id) => {
    if (userData?.currentSong?.id === id) {
      userData.currentSong = null;
      userData.songCurrentTime = 0;
      pauseSong();
      setPlayerDisplay();
    }

    userData.songs = userData?.songs.filter((song) => song.id !== id);
    renderSongs(userData?.songs);
    hightlightCurrentSong();
    setPlayButtonAccessibleText();

    if (userData?.songs.length === 0) {
      const resetButton = document.createElement('button');
      resetButton.id = 'reset';
      resetButton.ariaLabel = 'Reset Playlist';
      resetButton.innerText = 'Reset Playlist';

      resetButton.addEventListener('click', () => {
        userData.songs = [...allSongs];
        renderSongs(userData?.songs);
        setPlayButtonAccessibleText();
        resetButton.remove();
      });

      playlistSongs.appendChild(resetButton);
    }
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
