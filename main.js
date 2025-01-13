document.addEventListener("DOMContentLoaded", () => {
    const SONGS_API = "./songs.json";
    const NOTES_API_BASE = "./notes/";
  
    const songListContainer = document.getElementById("song-list-container");
    const songContainer = document.getElementById("song-container");
    const songList = document.getElementById("song-list");
    const searchSongsInput = document.getElementById("search-songs");
    const songTitleElement = document.getElementById("song-title");
    const lyricsContainer = document.getElementById("lyrics-container");
  
    let songs = []; // Store the full list of songs for filtering
  
    async function fetchSongs() {
      try {
        const response = await fetch(SONGS_API);
        if (!response.ok) {
          throw new Error(`Error fetching songs: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  
    async function fetchNotes(songId) {
      try {
        const response = await fetch(`${NOTES_API_BASE}${songId}.json`);
        if (!response.ok) {
          throw new Error(`Error fetching notes for song ${songId}: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  
    function showSongList() {
      songContainer.classList.remove("active");
      songListContainer.classList.add("active");
    }
  
    function displaySong(song) {
        songListContainer.classList.remove("active");
        songContainer.classList.add("active");
        songTitleElement.textContent = song.title;
      
        // Set the text direction (ltr or rtl) dynamically
        lyricsContainer.setAttribute("dir", song.direction || "ltr");
      
        lyricsContainer.innerHTML = "";
      
        fetchNotes(song.id).then((lyricsWithNotes) => {
          lyricsWithNotes.forEach((row) => {
            const rowContainer = document.createElement("div");
            rowContainer.className = "row-container";
      
            row.forEach(({ word, note }) => {
              const noteElement = document.createElement("div");
              noteElement.textContent = note;
              noteElement.className = "note";
      
              const wordElement = document.createElement("div");
              wordElement.textContent = word;
              wordElement.className = "word";
      
              const wordNoteContainer = document.createElement("div");
              wordNoteContainer.className = "word-note-container";
      
              wordNoteContainer.appendChild(noteElement);
              wordNoteContainer.appendChild(wordElement);
              rowContainer.appendChild(wordNoteContainer);
            });
      
            lyricsContainer.appendChild(rowContainer);
          });
        });
      
        // Display YouTube video
        const youtubeContainer = document.getElementById("youtube-container");
        youtubeContainer.innerHTML = ""; // Clear any previous video
        if (song.youtubeUrl) {
          const iframe = document.createElement("iframe");
          iframe.src = song.youtubeUrl.replace("watch?v=", "embed/"); // Convert URL to embed format
          iframe.width = "560";
          iframe.height = "315";
          iframe.frameBorder = "0";
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          youtubeContainer.appendChild(iframe);
        }
      }
    
  
    function renderSongList(filteredSongs) {
      songList.innerHTML = ""; // Clear the current list
  
      if (filteredSongs.length === 0) {
        songList.innerHTML = "<li>No songs found</li>";
        return;
      }
  
      filteredSongs.forEach((song) => {
        const li = document.createElement("li");
        li.textContent = song.title;
        li.addEventListener("click", () => displaySong(song));
        songList.appendChild(li);
      });
    }
  
    searchSongsInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(searchTerm)
      );
      renderSongList(filteredSongs);
    });
  
    async function initializeApp() {
      songs = await fetchSongs(); // Fetch and store songs
      renderSongList(songs); // Render the full list
    }
  
    window.showSongList = showSongList; // Attach globally for the back button
  
    initializeApp();
  });
  