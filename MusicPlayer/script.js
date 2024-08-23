const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = document.getElementById('play-pause-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeControl = document.getElementById('volume-control');
const progressBar = document.getElementById('progress-bar');
const songList = document.getElementById('song-list');
const suggestionInput = document.getElementById('song-suggestion');
const songFileInput = document.getElementById('song-file');

const songs = [
    { name: "Gangsta Rap", url: "https://files.catbox.moe/9qbcmm.mp3", thumbnail: "https://files.catbox.moe/bklybh.jfif" },
    { name: "The Message", url: "https://files.catbox.moe/mmmtig.mp3", thumbnail: "https://files.catbox.moe/vinw9a.jpg" },
];

let currentSongIndex = 0;
let isPlaying = false;
let canTogglePlayPause = true;

// Load the first song initially
audioPlayer.src = songs[currentSongIndex].url;

// Function to format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to play the current song
function playSong() {
    audioPlayer.play();
    isPlaying = true;
    playPauseIcon.src = "https://files.catbox.moe/fnvmz3.png"; // Pause icon
}

// Function to pause the current song
function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseIcon.src = "https://files.catbox.moe/0av28i.png"; // Play icon
}

// Function to toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Function to play the next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    audioPlayer.src = songs[currentSongIndex].url;
    playSong();
}

// Function to play the previous song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    audioPlayer.src = songs[currentSongIndex].url;
    playSong();
}

// Function to load and play a selected song
function selectSong(index) {
    currentSongIndex = index;
    audioPlayer.src = songs[currentSongIndex].url;
    playSong();
}

// Function to update volume
function updateVolume() {
    audioPlayer.volume = volumeControl.value;
}

// Function to update progress bar
function updateProgressBar() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
    }
}

// Function to seek to a specific time in the song
function seek() {
    if (audioPlayer.duration) {
        const time = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = time;
    }
}

// Function to update the song duration and current time
function updateTimeDisplay() {
    if (audioPlayer.duration) {
        // Update duration display
        const duration = formatTime(audioPlayer.duration);
        document.getElementById('duration').textContent = duration;
    }

    // Update current time display
    const currentTime = formatTime(audioPlayer.currentTime);
    document.getElementById('current-time').textContent = currentTime;
}

// Event listeners for control buttons
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
volumeControl.addEventListener('input', updateVolume);
progressBar.addEventListener('input', seek);

// Update progress bar and time display as the song plays
audioPlayer.addEventListener('timeupdate', () => {
    updateProgressBar();
    updateTimeDisplay();
});
audioPlayer.addEventListener('loadedmetadata', updateTimeDisplay);

// Dynamically create song list buttons with thumbnails
songs.forEach((song, index) => {
    const button = document.createElement('button');
    
    // Create image element for the thumbnail
    const img = document.createElement('img');
    img.src = song.thumbnail;
    img.alt = song.name + " thumbnail";
    
    // Add the thumbnail image and song name to the button
    button.appendChild(img);
    button.appendChild(document.createTextNode(song.name));
    
    // Set up the click event to play the selected song
    button.addEventListener('click', () => selectSong(index));
    
    songList.appendChild(button);
});

// Function to handle keyboard events
function handleKeyboard(event) {
    if (canTogglePlayPause && event.code === 'Space') { // Check if the spacebar was pressed
        event.preventDefault(); // Prevent the default action of spacebar (scrolling the page)
        togglePlayPause(); // Toggle play/pause
    }
}

// Add event listener for keyboard events
document.addEventListener('keydown', handleKeyboard);

// Handle song suggestion form
document.getElementById('suggest-btn').addEventListener('click', () => {
    const suggestion = document.getElementById('song-suggestion').value;
    const file = songFileInput.files[0];

    if (suggestion || file) {
        const formData = new FormData();
        if (suggestion) {
            formData.append('content', `Song suggestion: ${suggestion}`);
        }
        if (file) {
            formData.append('file', file);
        }

        fetch('https://discord.com/api/webhooks/1275745965185171466/iTBVcvEwyDRS8Re6Duh0gmzkykeI_T9I7UWSaaXklzE6NWbaDS0421Nm3_nQqy51ntaF', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert('Suggestion sent!');
                document.getElementById('song-suggestion').value = ''; // Clear input field
                songFileInput.value = ''; // Clear file input
            } else {
                alert('Failed to send suggestion.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send suggestion.');
        });
    } else {
        alert('Please enter a suggestion or select a file.');
    }
});

// Disable play/pause toggle when suggestion input is focused
suggestionInput.addEventListener('focus', () => {
    canTogglePlayPause = false;
});

// Re-enable play/pause toggle when suggestion input loses focus
suggestionInput.addEventListener('blur', () => {
    canTogglePlayPause = true;
});
