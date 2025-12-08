const stage = document.getElementById("stage");

let mediaFiles = [];
let currentIndex = 0;
let currentElement = null;

// Determine the file type based on extension
const getFileType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const videoExtensions = ["mp4", "webm", "mov"];

    if (imageExtensions.includes(ext)) return "image";
    if (videoExtensions.includes(ext)) return "video";
    return null;
};

// Function to get a random index different from the current one
const getRandomIndex = () => {
    if (mediaFiles.length <= 1) return 0;
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * mediaFiles.length);
    } while (newIndex === currentIndex);
    return newIndex;
};

// Function to create and display a media element
const showMedia = async (index) => {
    const media = mediaFiles[index];

    // Hide and clean up the current element
    if (currentElement) {
        if (currentElement.tagName === "VIDEO") {
            currentElement.pause();
        }
        currentElement.remove();
    }

    if (media.type === "image") {
        const img = document.createElement("img");
        img.src = media.src;
        img.alt = media.alt || "";
        stage.appendChild(img);
        currentElement = img;
    } else if (media.type === "video") {
        const video = document.createElement("video");
        video.src = media.src;
        video.playsInline = true;
        video.preload = "metadata";
        stage.appendChild(video);
        currentElement = video;

        try {
            await video.play();
        } catch (err) {
            // If autoplay fails, show the video paused
            console.log("Autoplay blocked, video is paused");
        }
    }

    currentIndex = index;
};

// Change to a random media on click/tap
const changeMedia = () => {
    const newIndex = getRandomIndex();
    showMedia(newIndex);
};

// Load manifest and initialize
const init = async () => {
    try {
        const response = await fetch("media/manifest.json");
        const files = await response.json();

        // Convert filenames to media objects
        mediaFiles = files
            .map((filename) => {
                const type = getFileType(filename);
                if (!type) return null;
                return {
                    type,
                    src: `media/${filename}`,
                    alt: filename.replace(/\.[^/.]+$/, ""), // Use filename without extension as alt
                };
            })
            .filter(Boolean);

        if (mediaFiles.length > 0) {
            showMedia(0);
            stage.addEventListener("click", changeMedia, { passive: true });
            stage.addEventListener("touchstart", changeMedia, {
                passive: true,
            });
        } else {
            console.error("No media files found in manifest");
        }
    } catch (err) {
        console.error("Failed to load media manifest:", err);
    }
};

init();
