const stage = document.getElementById("stage");
const cover = document.getElementById("cover");
const video = document.getElementById("video");

// Start playback on first tap/click; shows the video and hides the cover image.
const startPlayback = async () => {
    if (!video.paused) return;

    cover.classList.add("hidden");
    video.classList.remove("hidden");
    video.currentTime = 0;

    try {
        await video.play();
    } catch (err) {
        // If autoplay fails, show the cover again so the user can retry.
        cover.classList.remove("hidden");
        video.classList.add("hidden");
    }
};

stage.addEventListener("click", startPlayback, { passive: true });
stage.addEventListener("touchstart", startPlayback, { passive: true });
