const getElement = (id) => document.getElementById(id);

const playlistSongs = getElement('playlist-songs');
const playButton = getElement('play');
const pauseButton = getElement('pause');
const nextButton = getElement('next');
const previousButton = getElement('previous');
const shuffleButton = getElement('shuffle');

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

const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  audio.currentTime =
    userData?.currentSong?.id !== song.id ? 0 : userData?.songCurrentTime;
  userData.currentSong = song;
  playButton.classList.add('playing');

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove('playing');
  audio.pause();
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

const setPlayerDisplay = () => {
  const playingSong = getElement('player-song-title');
  const songArtist = getElement('player-song-artist');
  playingSong.textContent = userData?.currentSong?.title || '';
  songArtist.textContent = userData?.currentSong?.artist || '';
};

const highlightCurrentSong = () => {
  const songToHighlight = getElement(`song-${userData?.currentSong?.id}`);
  const playlistSongElements = document.querySelectorAll('.playlist-song');

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute('aria-current');
  });

  if (songToHighlight) songToHighlight.setAttribute('aria-current', 'true');
};

const renderSongs = (array) => {
  const songsHTML = array
    .map(
      (song) => `
    <li id="song-${song.id}" class="playlist-song">
        <button class="playlist-song-info" onclick="playSong(${song.id})">
            <span class="playlist-song-title">${song.title}</span>
            <span class="playlist-song-artist">${song.artist}</span>
            <span class="playlist-song-duration">${song.duration}</span>
        </button>
        <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="8" fill="#4d4d62"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/>
            </svg>
        </button>
    </li>
    `
    )
    .join('');

  playlistSongs.innerhTML = songsHTML;
};

const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];
  playButton.setAttribute(
    'aria-label',
    song?.title ? `Play ${song.title}` : 'Play'
  );
};

const getCurrentSongIndex = () =>
  userData?.songs.indexOf(userData?.currentSong);

playButton.addEventListener('click', () => {
  if (!userData?.currentSong) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener('click', pauseSong);
nextButton.addEventListener('click', playNextSong);
previousButton.addEventListener('click', playPreviousSong);
shuffleButton.addEventListener('click', shuffle);

audio.addEventListener('ended', () => {
  if (userData?.songs[getCurrentSongIndex() + 1]) {
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
});

userData?.songs.sort((a, b) => a.title.localeCompare(b.title));

renderSongs(userData?.songs);
setPlayButtonAccessibleText();
