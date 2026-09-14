document.addEventListener("DOMContentLoaded", (event) => {
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Hero & Work Page Load Animation
    if (document.querySelectorAll(".animate-up").length > 0) {
        gsap.to(".animate-up", {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2
        });
    }

    // Navbar Animation
    gsap.from(".navbar", {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

// Premium Video Hover & Touch Preview (With Sound & Clean Reset)
        const videoWrappers = document.querySelectorAll('.hover-play');
        
        videoWrappers.forEach(wrapper => {
            const video = wrapper.querySelector('video');
            if(video) {
                // 1. Desktop: Play (with sound) on hover
                wrapper.addEventListener('mouseenter', () => {
                    let playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Browser blocked sound. Click anywhere on the page first to enable audio.", error);
                        });
                    }
                });
                
                // 2. Desktop: Pause AND Reset when mouse leaves
                wrapper.addEventListener('mouseleave', () => {
                    video.pause();
                    // This is the magic line that resets the video back to the poster
                    video.currentTime = 0; 
                });

                // 3. Mobile: Play/Pause on tap
                wrapper.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                        video.currentTime = 0; // Reset on tap out too
                    }
                });
            }
        });
    // Scroll Reveal Animation
    const scrollElements = document.querySelectorAll('.animate-scroll');
    if (scrollElements.length > 0 && typeof ScrollTrigger !== 'undefined') {
        scrollElements.forEach((el) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", 
                    toggleActions: "play none none reverse"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });
    }
});

/* ==================================================
   CUSTOM YOUTUBE-STYLE VIDEO PLAYER ENGINE
   ================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const players = document.querySelectorAll('.custom-video-player');

    players.forEach(player => {
        const video = player.querySelector('video');
        const centerPlayBtn = player.querySelector('.center-play-btn');
        const playPauseBtn = player.querySelector('.play-pause-btn');
        const muteBtn = player.querySelector('.mute-btn');
        const progressContainer = player.querySelector('.progress-container');
        const progressFilled = player.querySelector('.progress-filled');
        const timeDisplay = player.querySelector('.time-display');
        const fullscreenBtn = player.querySelector('.fullscreen-btn');

        if (!video) return;

        // Force initial state
        video.muted = true;
        player.classList.add('is-muted');

        // Helper: Format time in MM:SS
        const formatTime = (timeInSeconds) => {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = Math.floor(timeInSeconds % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        // Play / Pause Logic
        const togglePlay = () => {
            if (video.paused) {
                video.play();
                player.classList.remove('is-paused');
                player.classList.add('is-playing');
            } else {
                video.pause();
                player.classList.add('is-paused');
                player.classList.remove('is-playing');
            }
        };

        centerPlayBtn.addEventListener('click', togglePlay);
        playPauseBtn.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay); // Click video to pause/play

        // Mute / Unmute Logic
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            if (video.muted) {
                player.classList.add('is-muted');
            } else {
                player.classList.remove('is-muted');
            }
        });

        // Update Progress Bar & Time
        video.addEventListener('timeupdate', () => {
            if (!video.duration) return;
            const progressRatio = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = `${progressRatio}%`;
            timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        });

        // Load metadata to show total time immediately
        video.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
        });

        // Scrubbing (Clicking on progress bar)
        progressContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickPosition = e.offsetX;
            const totalWidth = progressContainer.offsetWidth;
            const clickRatio = clickPosition / totalWidth;
            video.currentTime = clickRatio * video.duration;
        });

        // Fullscreen Logic
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!document.fullscreenElement) {
                if (player.requestFullscreen) {
                    player.requestFullscreen();
                } else if (player.webkitRequestFullscreen) { /* Safari */
                    player.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });

        // Reset when video ends
        video.addEventListener('ended', () => {
            player.classList.remove('is-playing');
            player.classList.add('is-paused');
            progressFilled.style.width = '100%';
        });
    });
});