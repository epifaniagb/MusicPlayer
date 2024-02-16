import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const AudioPlayer = ({ allSongs }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const playNextSong = () => {
    const currentSongIndex = allSongs.findIndex(
      (song) => song.id === currentSong.id
    );
    if (currentSongIndex !== -1 && currentSongIndex < allSongs.length - 1) {
      playSong(allSongs[currentSongIndex + 1]);
    }
  };

  const playPreviousSong = () => {
    const currentSongIndex = allSongs.findIndex(
      (song) => song.id === currentSong.id
    );
    if (currentSongIndex > 0) {
      playSong(allSongs[currentSongIndex - 1]);
    }
  };

  const shuffle = () => {
    const shuffledSongs = [...allSongs].sort(() => Math.random() - 0.5);
    setCurrentSong(null);
    setIsPlaying(false);
  };

  const deleteSong = (id) => {
    if (currentSong && currentSong.id === id) {
      setCurrentSong(null);
      setIsPlaying(false);
    }

    const updatedSongs = allSongs.filter((song) => song.id !== id);
    renderSongs(updatedSongs);
  };

  const renderSongs = (songs) => {
    return songs.map((song) => (
      <li key={song.id}>
        <button onClick={() => playSong(song)}>{song.title}</button>
        <button onClick={() => deleteSong(song.id)}>Delete</button>
      </li>
    ));
  };

  return (
    <div>
      <h1>Audio Player</h1>
      <ul>{renderSongs(allSongs)}</ul>
      {currentSong && (
        <div>
          <h2>Now Playing: {currentSong.title}</h2>
          {isPlaying ? (
            <button onClick={pauseSong}>Pause</button>
          ) : (
            <button onClick={() => playSong(currentSong)}>Play</button>
          )}
          <button onClick={playPreviousSong}>Previous</button>
          <button onClick={playNextSong}>Next</button>
          <button onClick={shuffle}>Shuffle</button>
        </div>
      )}
    </div>
  );
};

const allSongs = [
  {
    id: 0,
    title: 'Bottomofurhart',
    artist: 'Earth Dad',
    duration: '2:03',
    src: 'https://open.spotify.com/track/1jpQkEtlcSgishfSEszUpT?si=f9b2352776f24b19',
  },
  {
    id: 1,
    title: 'Atomic Band',
    artist: 'Earth Dad',
    duration: '2:48',
    src: 'https://open.spotify.com/track/3EugMo09CCDogL0iK4impj?si=ac9f7bb48b734a76',
  },
  {
    id: 2,
    title: 'Tomorrow',
    artist: 'Earth Dad',
    duration: '3:10',
    src: 'https://open.spotify.com/track/3y2p6WmljH3jwjY3wpByqZ?si=fcd32995e55e415f',
  },
];

ReactDOM.render(
  <React.StrictMode>
    <AudioPlayer allSongs={allSongs} />
  </React.StrictMode>,
  document.getElementById('root')
);
