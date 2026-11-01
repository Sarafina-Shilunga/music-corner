// ========================================
// MY MUSIC UNIVERSE
// Sarah's Personal Music Collection
// ========================================


// 1. GET HTML ELEMENTS
const songList = document.getElementById("songList");
const searchMusic = document.getElementById("searchMusic");

const songCount = document.getElementById("songCount");
const artistCount = document.getElementById("artistCount");
const albumCount = document.getElementById("albumCount");
const favoriteCount = document.getElementById("favoriteCount");

const emptyMusicMessage = document.getElementById("emptyMusicMessage");

const artistList = document.getElementById("artistList");
const albumList = document.getElementById("albumList");

const favoriteSongs = document.getElementById("favoriteSongs");
const noFavorite = document.getElementById("noFavorite");

const studyPlaylist = document.getElementById("studyPlaylist");

const musicForm = document.getElementById("musicForm");

const currentSong = document.getElementById("currentSong");
const currentArtist = document.getElementById("currentArtist");

const playButton = document.getElementById("playButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");

const surpriseButton = document.getElementById("surpriseButton");
const latenightButton = document.getElementById("latenightButton");

const songModal = document.getElementById("songModal");
const closeSongModal = document.getElementById("closeSongModal");


// 2. STARTER SONG COLLECTION

const starterSongs = [
    {
        id: 1,
        title: "Ivy",
        artist: "Frank Ocean",
        album: "Blonde",
        genre: "R&B",
        mood: "sad",
        rating: 5,
        favorite: true,
        dateAdded: "2026-10-20"
    },
    {
        id: 2,
        title: "Snooze",
        artist: "SZA",
        album: "SOS",
        genre: "R&B",
        mood: "romantic",
        rating: 5,
        favorite: true,
        dateAdded: "2026-10-21"
    },
    {
        id: 3,
        title: "Pink + White",
        artist: "Frank Ocean",
        album: "Blonde",
        genre: "R&B",
        mood: "happy",
        rating: 5,
        favorite: false,
        dateAdded: "2026-10-22"
    },
    {
        id: 4,
        title: "The Hills",
        artist: "The Weeknd",
        album: "Beauty Behind the Madness",
        genre: "Alternative",
        mood: "late-night",
        rating: 4,
        favorite: false,
        dateAdded: "2026-10-23"
    },
    {
        id: 5,
        title: "Nights",
        artist: "Frank Ocean",
        album: "Blonde",
        genre: "R&B",
        mood: "late-night",
        rating: 5,
        favorite: true,
        dateAdded: "2026-10-24"
    },
    {
        id: 6,
        title: "Good Days",
        artist: "SZA",
        album: "Good Days",
        genre: "R&B",
        mood: "happy",
        rating: 5,
        favorite: false,
        dateAdded: "2026-10-25"
    },
    {
        id: 7,
        title: "Die For You",
        artist: "The Weeknd",
        album: "Starboy",
        genre: "Pop",
        mood: "romantic",
        rating: 4,
        favorite: false,
        dateAdded: "2026-10-26"
    },
    {
        id: 8,
        title: "Like Him",
        artist: "Tyler, The Creator",
        album: "CHROMAKOPIA",
        genre: "Rap",
        mood: "sad",
        rating: 5,
        favorite: false,
        dateAdded: "2026-10-27"
    }
];


// 3. LOAD SAVED SONGS

let songs;

try {
    const savedSongs = localStorage.getItem("myMusicUniverse");

    songs = savedSongs
        ? JSON.parse(savedSongs)
        : starterSongs;

    if (!Array.isArray(songs)) {
        songs = starterSongs;
    }

} catch (error) {
    songs = starterSongs;
}


// 4. SAVE SONGS

function saveSongs() {
    localStorage.setItem("myMusicUniverse", JSON.stringify(songs));
}


// 5. CURRENT SETTINGS

let currentFilter = "all";
let selectedMood = null;
let currentPlayingIndex = -1;
let isPlaying = false;


// 6. HELPER FUNCTION

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


// 7. DISPLAY SONGS

function displaySongs(songArray) {

    songList.innerHTML = "";

    emptyMusicMessage.hidden = songArray.length !== 0;

    songArray.forEach(function(song) {

        const songCard = document.createElement("div");

        songCard.className = "song-card";

        songCard.innerHTML = `
            <div class="song-art">
                <span>♫</span>
            </div>

            <h3>${escapeHTML(song.title)}</h3>

            <p>${escapeHTML(song.artist)}</p>

            <p>${escapeHTML(song.album)}</p>

            <div class="song-card-actions">

                <button class="view-song"
                    data-id="${song.id}">
                    View Details
                </button>

                <button class="favorite-toggle"
                    data-id="${song.id}"
                    aria-label="Toggle favorite">
                    ${song.favorite ? "♥" : "♡"}
                </button>

            </div>
        `;

        songList.appendChild(songCard);

    });
}


// 8. SEARCH AND FILTER SONGS

function updateSongDisplay() {

    let filteredSongs = [...songs];

    if (currentFilter === "favorite") {
        filteredSongs = filteredSongs.filter(song => song.favorite);
    }

    if (currentFilter === "recent") {
        filteredSongs.sort((a, b) =>
            new Date(b.dateAdded) - new Date(a.dateAdded)
        );
    }

    if (selectedMood) {
        filteredSongs = filteredSongs.filter(song =>
            song.mood === selectedMood
        );
    }

    const searchText = searchMusic.value.toLowerCase().trim();

    if (searchText) {
        filteredSongs = filteredSongs.filter(song =>
            song.title.toLowerCase().includes(searchText) ||
            song.artist.toLowerCase().includes(searchText) ||
            song.album.toLowerCase().includes(searchText)
        );
    }

    displaySongs(filteredSongs);
}


// 9. SEARCH BAR

searchMusic.addEventListener("input", updateSongDisplay);


// 10. FILTER BUTTONS

document.querySelectorAll(".filter-button").forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = this.dataset.filter;

        document.querySelectorAll(".filter-button").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        updateSongDisplay();

    });

});


// 11. FAVORITES

function toggleFavorite(id) {

    const song = songs.find(song => song.id === id);

    if (!song) return;

    song.favorite = !song.favorite;

    saveSongs();

    renderAll();
}


songList.addEventListener("click", function(event) {

    const favoriteButton = event.target.closest(".favorite-toggle");

    if (favoriteButton) {
        toggleFavorite(Number(favoriteButton.dataset.id));
        return;
    }

    const viewButton = event.target.closest(".view-song");

    if (viewButton) {
        showSongDetails(Number(viewButton.dataset.id));
    }

});


// 12. UPDATE STATISTICS

function updateStatistics() {

    const uniqueArtists = new Set(
        songs.map(song => song.artist.toLowerCase())
    );

    const uniqueAlbums = new Set(
        songs.map(song => song.album.toLowerCase())
    );

    songCount.textContent = songs.length;

    artistCount.textContent = uniqueArtists.size;

    albumCount.textContent = uniqueAlbums.size;

    favoriteCount.textContent =
        songs.filter(song => song.favorite).length;
}


// 13. DISPLAY ARTISTS

function displayArtists() {

    artistList.innerHTML = "";

    const artists = [...new Set(
        songs.map(song => song.artist)
    )];

    artists.forEach(artist => {

        const artistSongs = songs.filter(song =>
            song.artist === artist
        );

        const card = document.createElement("div");

        card.className = "artist-card";

        card.innerHTML = `
            <div class="artist-image">
                ♫
            </div>

            <h3>${escapeHTML(artist)}</h3>

            <p>${artistSongs.length} song(s) in your collection</p>
        `;

        artistList.appendChild(card);

    });
}


// 14. DISPLAY ALBUMS

function displayAlbums() {

    albumList.innerHTML = "";

    const albums = [...new Set(
        songs.map(song => song.album)
    )];

    albums.forEach(album => {

        const albumSongs = songs.filter(song =>
            song.album === album
        );

        const card = document.createElement("div");

        card.className = "album-card";

        card.innerHTML = `
            <div class="album-image">
                ♬
            </div>

            <h3>${escapeHTML(album)}</h3>

            <p>${escapeHTML(albumSongs[0].artist)}</p>

            <p>${albumSongs.length} song(s)</p>
        `;

        albumList.appendChild(card);

    });
}


// 15. DISPLAY FAVORITE SONGS

function displayFavorites() {

    favoriteSongs.innerHTML = "";

    const favorites = songs.filter(song => song.favorite);

    noFavorite.hidden = favorites.length !== 0;

    favorites.forEach(song => {

        const card = document.createElement("div");

        card.className = "favorite-card";

        card.innerHTML = `
            <h3>${escapeHTML(song.title)}</h3>

            <p>${escapeHTML(song.artist)}</p>

            <button class="favorite-toggle"
                data-id="${song.id}">
                Remove Favorite ♥
            </button>
        `;

        favoriteSongs.appendChild(card);

    });

}

favoriteSongs.addEventListener("click", function(event) {

    const button = event.target.closest(".favorite-toggle");

    if (button) {
        toggleFavorite(Number(button.dataset.id));
    }

});


// 16. DISPLAY STUDY PLAYLIST

function displayStudyPlaylist() {

    studyPlaylist.innerHTML = "";

    const studySongs = songs.filter(song =>
        song.mood === "study"
    );

    if (studySongs.length === 0) {

        studyPlaylist.innerHTML =
            "<p>No study songs yet. Add some using the form!</p>";

        return;
    }

    studySongs.forEach(song => {

        const card = document.createElement("div");

        card.className = "study-song";

        card.innerHTML = `
            <h3>${escapeHTML(song.title)}</h3>
            <p>${escapeHTML(song.artist)}</p>
        `;

        studyPlaylist.appendChild(card);

    });

}


// 17. MOOD FILTERS

document.querySelectorAll(".mood-card").forEach(button => {

    button.addEventListener("click", function() {

        selectedMood = this.dataset.mood;

        currentFilter = "all";
        searchMusic.value = "";

        document.querySelectorAll(".filter-button").forEach(btn => {
            btn.classList.toggle(
                "active",
                btn.dataset.filter === "all"
            );
        });

        updateSongDisplay();

        document.getElementById("music").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// 18. ADD SONGS THROUGH THE FORM

musicForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const newSong = {

        id: Date.now(),

        title: document.getElementById("songTitle").value.trim(),

        artist: document.getElementById("songArtist").value.trim(),

        album: document.getElementById("albumName").value.trim(),

        genre: document.getElementById("songGenre").value,

        mood: document.getElementById("songMood").value,

        rating: Number(document.getElementById("songRating").value),

        favorite: document.getElementById("songFavorite").checked,

        dateAdded: new Date().toISOString().split("T")[0]

    };

    if (!newSong.title || !newSong.artist || !newSong.album) {
        alert("Please fill in all the required fields.");
        return;
    }

    songs.push(newSong);

    saveSongs();

    musicForm.reset();

    selectedMood = null;
    currentFilter = "all";
    searchMusic.value = "";

    document.querySelectorAll(".filter-button").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.filter === "all"
        );
    });

    renderAll();

    alert("Your song has been added to your universe!");

});


// 19. SONG DETAILS MODAL

function showSongDetails(id) {

    const song = songs.find(song => song.id === id);

    if (!song) return;

    document.getElementById("modalSongTitle").textContent = song.title;

    document.getElementById("modalSongArtist").textContent = song.artist;

    document.getElementById("modalSongAlbum").textContent = song.album;

    document.getElementById("modalSongGenre").textContent = song.genre;

    document.getElementById("modalSongMood").textContent = song.mood;

    document.getElementById("modalSongRating").textContent =
        song.rating + "/5";

    songModal.hidden = false;

}


closeSongModal.addEventListener("click", function() {
    songModal.hidden = true;
});


songModal.addEventListener("click", function(event) {

    if (event.target === songModal) {
        songModal.hidden = true;
    }

});


// 20. NOW PLAYING

function playSong(index) {

    if (songs.length === 0) return;

    if (index < 0 || index >= songs.length) return;

    currentPlayingIndex = index;

    const song = songs[currentPlayingIndex];

    currentSong.textContent = song.title;

    currentArtist.textContent = song.artist;

    isPlaying = true;

    playButton.textContent = "Ⅱ";

}


// PREVIOUS SONG

previousButton.addEventListener("click", function() {

    if (songs.length === 0) return;

    let index = currentPlayingIndex - 1;

    if (index < 0) {
        index = songs.length - 1;
    }

    playSong(index);

});


// NEXT SONG

nextButton.addEventListener("click", function() {

    if (songs.length === 0) return;

    let index = currentPlayingIndex + 1;

    if (index >= songs.length) {
        index = 0;
    }

    playSong(index);

});


// PLAY / PAUSE BUTTON

playButton.addEventListener("click", function() {

    if (currentPlayingIndex === -1) {

        playSong(0);

        return;
    }

    isPlaying = !isPlaying;

    playButton.textContent = isPlaying ? "Ⅱ" : "▶";

});


// 21. SURPRISE ME

surpriseButton.addEventListener("click", function() {

    if (songs.length === 0) {
        alert("Your music universe is empty!");
        return;
    }

    const randomIndex = Math.floor(Math.random() * songs.length);

    playSong(randomIndex);

    document.querySelector(".now-playing-section").scrollIntoView({
        behavior: "smooth"
    });

});


// 22. LATE NIGHT MUSIC

latenightButton.addEventListener("click", function() {

    const lateNightSongs = songs.filter(song =>
        song.mood === "late-night"
    );

    if (lateNightSongs.length === 0) {

        alert("You haven't added any late-night songs yet!");

        return;
    }

    const randomSong = lateNightSongs[
        Math.floor(Math.random() * lateNightSongs.length)
    ];

    const index = songs.findIndex(song =>
        song.id === randomSong.id
    );

    playSong(index);

    document.querySelector(".now-playing-section").scrollIntoView({
        behavior: "smooth"
    });

});


// 23. UPDATE EVERYTHING

function renderAll() {

    updateSongDisplay();

    updateStatistics();

    displayArtists();

    displayAlbums();

    displayFavorites();

    displayStudyPlaylist();

}


// 24. START THE WEBSITE

renderAll();

console.log("Welcome to My Music Universe!");
console.log("Your music collection is ready!");
