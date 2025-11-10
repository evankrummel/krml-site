// Preloader functionality
function hidePreloader() {
    const preloader = document.getElementById('preloader');

    if (preloader) {
        // Small delay to ensure preloader is visible before transition starts
        setTimeout(() => {
            // Force a reflow to ensure the element is rendered
            void preloader.offsetHeight;

            // Apply transition directly via JavaScript
            preloader.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

            // Use requestAnimationFrame to ensure the transition works
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Apply the hidden state
                    preloader.style.opacity = '0';
                    preloader.style.transform = 'scale(1.1)';
                    preloader.style.pointerEvents = 'none';

                    // Remove preloader from DOM after fade completes
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 600); // Match the transition duration
                });
            });
        }, 100); // Small delay to ensure visibility
    }
}

// Try multiple events to ensure it works
if (document.readyState === 'complete') {
    // Page already loaded
    setTimeout(hidePreloader, 300);
} else {
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 300);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    "use strict"; // Added "use strict" inside DOMContentLoaded for local scope optimization
    
    // --- Navigation Logic ---
    const container = document.getElementById('nav-links-container');
    const pill = document.getElementById('hover-pill');
    const links = document.querySelectorAll('.nav-link');
    const wordmark = document.getElementById('wordmark-logo');

    let contactLink = null;
    let activeModalLink = null;

    links.forEach(link => {
        if (link.textContent.toLowerCase() === 'contact') {
            contactLink = link;
        }
    });

    // Function to position the pill behind the active link
    const positionPill = (link) => {
        const linkRect = link.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeLeft = linkRect.left - containerRect.left;

        pill.style.width = `${linkRect.width + 16}px`;
        pill.style.transform = `translateX(${relativeLeft - 8}px)`;
    };

    // Function to update the color of all links
    const updateLinkColors = (activeLink) => {
        links.forEach(link => {
            if (link === activeLink) {
                link.style.color = '#E9E1DB';
            } else {
                link.style.color = '#174C38';
            }
        });
    };

    // Determine which page we're on and highlight the appropriate link
    const pathname = window.location.pathname;
    const pathSegments = pathname.split('/').filter(segment => segment);
    const currentPage = pathSegments[pathSegments.length - 1] || 'index.html';
    let activePageLink = null;

    // Check for /photos, /videos, or /contact paths
    if (pathname.includes('/photos') || currentPage === 'photos' || currentPage === 'photos.html') {
        activePageLink = document.getElementById('photo-link');
    } else if (pathname.includes('/videos') || currentPage === 'videos' || currentPage === 'videos.html') {
        activePageLink = document.getElementById('video-link');
    } else if (pathname.includes('/contact') || currentPage === 'contact' || currentPage === 'contact.html') {
        activePageLink = document.getElementById('contact-link');
    }

    // Set the initial position of the pill
    if (activePageLink) {
        positionPill(activePageLink);
        updateLinkColors(activePageLink);
    } else if (contactLink) {
        // Fallback or default for other pages if no specific link is active
        // NOTE: This logic seems slightly inconsistent as 'contact' is a modal link,
        // but it maintains the original script's behavior.
        positionPill(contactLink);
        updateLinkColors(contactLink);
    }

    // Use mouseenter and mouseleave for cleaner transitions
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (!activeModalLink) {
                positionPill(link);
                updateLinkColors(link);
            }
        });
    });

    container.addEventListener('mouseleave', () => {
        if (!activeModalLink) {
            if (activePageLink) {
                positionPill(activePageLink);
                updateLinkColors(activePageLink);
            } else if (contactLink) {
                positionPill(contactLink);
                updateLinkColors(contactLink);
            }
        }
    });

    // Handle logo hover
    if (wordmark) {
        wordmark.addEventListener('mouseenter', () => {
            if (!activeModalLink) {
                if (activePageLink) {
                    positionPill(activePageLink);
                    updateLinkColors(activePageLink);
                } else if (contactLink) {
                    positionPill(contactLink);
                    updateLinkColors(contactLink);
                }
            }
        });
    }

    // --- Modal Functionality ---
    const modals = document.querySelectorAll(".modal");
    const closeBtns = document.querySelectorAll(".close-button");
    const mainContent = document.getElementById('main-content');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.style.display = 'flex';
        activeModalLink = document.querySelector(`[href="#${modalId}"]`);

        if (activeModalLink) {
            positionPill(activeModalLink);
            updateLinkColors(activeModalLink);
        }

        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        });
        if (mainContent) {
            mainContent.style.filter = "blur(2px)";
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('active');
        if (mainContent) {
            mainContent.style.filter = "none";
        }
        activeModalLink = null;

        // Return pill to appropriate position
        if (activePageLink) {
            positionPill(activePageLink);
            updateLinkColors(activePageLink);
        } else if (contactLink) {
            positionPill(contactLink);
            updateLinkColors(contactLink);
        }

        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    }

    // Attach event listeners to all links with data-modal attributes
    document.querySelectorAll('[data-modal-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('href').substring(1);
            openModal(modalId);
        });
    });

    // Use a single click handler on the container and delegate
    // Only handle modal links (those starting with #)
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches('.nav-link') && target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const modalId = target.getAttribute('href').substring(1);
            // Only open contact modal, not photo/video modals
            if (modalId === 'contact-modal') {
                openModal(modalId);
            }
        }
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modal;
            closeModal(modalId);
        });
    });

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Add Escape key listener
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal.id);
                }
            });
        }
    });


    // --- Photo Gallery Logic (only if elements exist, for photos.html page) ---
    const selectedPhoto = document.getElementById('selected-photo');
    const galleryGrid = document.getElementById('gallery-grid');

    if (selectedPhoto && galleryGrid) {
        const galleryImages = Array.from(galleryGrid.querySelectorAll('img'));

        // Function to set the main photo with a transition
        let photoInterval;

        const startPhotoCirculation = () => {
            if (galleryImages.length > 0) {
                photoInterval = setInterval(() => {
                    const randomIndex = Math.floor(Math.random() * galleryImages.length);
                    const randomPhotoSrc = galleryImages[randomIndex].src;
                    setPhoto(randomPhotoSrc);
                }, 10000); // 10 seconds
            }
        };

        const setPhoto = (src) => {
            const selectedPhotoContainer = selectedPhoto.parentElement;

            // Create a temporary image element that will be animated in.
            const tempImage = document.createElement('img');
            tempImage.src = src;
            tempImage.className = selectedPhoto.className; // Ensure it's styled like the original.

            // Set up the initial state for the animation (invisible and off-screen).
            tempImage.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            tempImage.style.opacity = '0';
            tempImage.style.transform = 'translateX(-20px)';

            // Add the temporary image to the container. It will appear on top of the old one.
            selectedPhotoContainer.appendChild(tempImage);

            // Use requestAnimationFrame to ensure the browser has applied the initial styles
            // before we trigger the transition. This makes the animation reliable.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    tempImage.style.opacity = '1';
                    tempImage.style.transform = 'translateX(0)';
                });
            });

            // After the animation is finished, we update the original, permanent
            // image element and remove the temporary one for a seamless swap.
            setTimeout(() => {
                selectedPhoto.src = src;
                tempImage.remove();
            }, 500); // This duration must match the transition time.
        };

        // Click listener for gallery thumbnails
        galleryGrid.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                clearInterval(photoInterval);
                setPhoto(e.target.src);
                startPhotoCirculation();
            }
        });

        if (galleryImages.length > 0) {
            startPhotoCirculation();
        }
    }

    // --- Video Player Logic - autoplay on videos.html page ---
    const videoPlayer = document.getElementById('video-player');
    const muteBtn = document.getElementById('video-mute-btn');
    const volumeOnIcon = document.getElementById('volume-on');
    const volumeOffIcon = document.getElementById('volume-off');

    if (videoPlayer) {
        // Autoplay video when page loads (for videos.html)
        setTimeout(() => {
            videoPlayer.play().catch(err => {
                // Autoplay may be blocked by browser, that's okay
                console.log('Video autoplay prevented:', err);
            });
        }, 500);

        // Toggle video playback on click
        videoPlayer.addEventListener('click', () => {
            if (videoPlayer.paused) {
                videoPlayer.play();
            } else {
                videoPlayer.pause();
            }
        });

        // Mute/Unmute button functionality
        if (muteBtn && volumeOnIcon && volumeOffIcon) {
            muteBtn.addEventListener('click', () => {
                videoPlayer.muted = !videoPlayer.muted;
                volumeOnIcon.classList.toggle('hidden', videoPlayer.muted);
                volumeOffIcon.classList.toggle('hidden', !videoPlayer.muted);
            });
        }

        const mainContent = document.getElementById('main-content');
        if (mainContent && mainContent.classList.contains('h-screen')) {
            document.body.classList.add('is-fixed');
        }
    }


    // --- Basic Slider/Carousel Logic ---
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", function () {
            let items = document.querySelectorAll(".item");
            const slideContainer = document.querySelector(".slide");
            if (slideContainer && items.length > 0) {
                 // Move the first item to the end of the slide container
                slideContainer.appendChild(items[0]);
            }
        });

        prevBtn.addEventListener("click", function () {
            let items = document.querySelectorAll(".item");
            const slideContainer = document.querySelector(".slide");
            if (slideContainer && items.length > 0) {
                // Move the last item to the beginning of the slide container
                slideContainer.prepend(items[items.length - 1]);
            }
        });
    }

});