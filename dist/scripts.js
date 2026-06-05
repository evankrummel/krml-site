    
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

    // Modal functionality
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

        // If it's the video modal, pause the video
        if (modalId === 'video-modal') {
            const videoPlayer = document.getElementById('modal-video-player');
            if (videoPlayer) {
                videoPlayer.pause();
                videoPlayer.src = '';
            }
        }

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
            if (modal.id === 'video-modal' && modal.classList.contains('active')) {
                // For video modal, close if clicking outside the video container
                const videoContainer = modal.querySelector('.video-container');
                const closeButton = modal.querySelector('.video-close-button');
                
                // Close if clicking on the modal overlay itself, or outside the video container
                if (e.target === modal || (videoContainer && !videoContainer.contains(e.target) && e.target !== closeButton)) {
                    const videoPlayer = document.getElementById('modal-video-player');
                    if (videoPlayer) {
                        videoPlayer.pause();
                        videoPlayer.src = '';
                    }
                    closeModal(modal.id);
                }
            } else if (e.target === modal) {
                // For other modals, close when clicking directly on modal
                closeModal(modal.id);
            }
        });
    });

    // Add Escape key listener
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    // If it's the video modal, pause the video
                    if (modal.id === 'video-modal') {
                        const videoPlayer = document.getElementById('modal-video-player');
                        if (videoPlayer) {
                            videoPlayer.pause();
                            videoPlayer.src = '';
                        }
                    }
                    closeModal(modal.id);
                }
            });
        }
    });


    // Photo Gallery Logic (only if elements exist, for photos.html page)
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
    
    // Video Player Logic - autoplay on videos.html page (for the old video player if it exists)
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
    }

    // Carousel functionality for videos page
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    // Helper function to reset and re-trigger content animations
    // Safari doesn't reset CSS animations when DOM elements are moved, so we need to manually reset them
    function resetContentAnimations() {
        // Wait for DOM to update after carousel movement
        // Use double requestAnimationFrame to ensure Safari has processed the DOM changes
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const activeItem = document.querySelector(".slide .item:nth-child(2)");
                if (activeItem) {
                    const content = activeItem.querySelector(".content");
                    if (content) {
                        const name = content.querySelector(".name");
                        const des = content.querySelector(".des");
                        const button = content.querySelector("button");
                        
                        // Reset and re-trigger animations for Safari compatibility
                        [name, des, button].forEach(el => {
                            if (el) {
                                // Temporarily remove animation to reset it
                                el.style.animation = 'none';
                                // Reset opacity to initial state
                                el.style.opacity = '0';
                                
                                // Force reflow
                                void el.offsetHeight;
                                
                                // Re-enable animation by removing inline style (CSS will take over)
                                el.style.animation = '';
                                el.style.opacity = '';
                            }
                        });
                    }
                }
            });
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", function () {
            let items = document.querySelectorAll(".item");
            const slideContainer = document.querySelector(".slide");
            if (slideContainer && items.length > 0) {
                const firstItem = items[0];
                
                // Position the item off-screen to the right BEFORE moving it
                // This ensures it slides in smoothly from the right instead of appearing
                // Use 100% to position at container edge (container has overflow: hidden to clip it)
                firstItem.style.left = '100%';
                
                // Force a reflow to ensure the style is applied
                void firstItem.offsetHeight;
                
                // Now move the item to the end
                // When it becomes the last item, the CSS nth-child rule will apply
                // but the inline style will keep it off-screen temporarily
                slideContainer.appendChild(firstItem);
                
                // Reset content animations for Safari compatibility
                resetContentAnimations();
                
                // Wait a frame for the browser to apply the new CSS position,
                // then remove the inline style so it can animate smoothly
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Remove inline styles - the item will now animate from
                        // off-screen to its CSS position
                        firstItem.style.left = '';
                        firstItem.style.transform = '';
                    });
                });
            }
        });

        prevBtn.addEventListener("click", function () {
            let items = document.querySelectorAll(".item");
            const slideContainer = document.querySelector(".slide");
            if (slideContainer && items.length > 0) {
                // Move the last item to the beginning of the slide container
                slideContainer.prepend(items[items.length - 1]);
                
                // Reset content animations for Safari compatibility
                resetContentAnimations();
            }
        });
    }

    // Add click handlers to preview items (items that are not the active one)
    // The active item is nth-child(2), so items 3+ are previews
    let isTransitioning = false; // Prevent rapid clicks during transitions
    
    function moveToItem(targetItem) {
        if (isTransitioning) return; // Prevent multiple simultaneous transitions
        isTransitioning = true;
        
        const slideContainer = document.querySelector(".slide");
        if (!slideContainer) {
            isTransitioning = false;
            return;
        }
        
        const items = Array.from(document.querySelectorAll(".slide .item"));
        const clickedIndex = items.indexOf(targetItem);
        
        // The active item is at index 1 (2nd child, nth-child(2))
        const targetPosition = 1;
        const positionsToMove = clickedIndex - targetPosition;
        
        if (positionsToMove > 0) {
            // Move items forward until the clicked item becomes the active one
            let movesCompleted = 0;
            
            function performMove() {
                if (movesCompleted >= positionsToMove) {
                    // All moves completed
                    resetContentAnimations();
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 500); // Wait for transition to complete
                    return;
                }
                
                const currentItems = Array.from(document.querySelectorAll(".slide .item"));
                if (currentItems.length === 0) {
                    isTransitioning = false;
                    return;
                }
                
                const firstItem = currentItems[0];
                
                // Position the first item off-screen to the right
                firstItem.style.left = '100%';
                void firstItem.offsetHeight; // Force reflow
                
                // Move it to the end
                slideContainer.appendChild(firstItem);
                
                // Reset inline styles after a frame
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        firstItem.style.left = '';
                        firstItem.style.transform = '';
                        
                        movesCompleted++;
                        // Continue with next move after transition
                        setTimeout(performMove, 50);
                    });
                });
            }
            
            performMove();
        } else {
            isTransitioning = false;
        }
    }
    
    function setupPreviewClicks() {
        const items = document.querySelectorAll(".slide .item");
        
        items.forEach((item, index) => {
            // Skip the first two items (they're the active/background items)
            // Only make items from position 3 onwards clickable
            if (index >= 2) {
                // Add cursor pointer to indicate clickability
                item.style.cursor = 'pointer';
            } else {
                // Remove cursor pointer from active items
                item.style.cursor = '';
            }
        });
    }
    
    // Use event delegation on the slide container for better performance
    const slideContainer = document.querySelector(".slide");
    if (slideContainer) {
        slideContainer.addEventListener("click", function(e) {
            const clickedItem = e.target.closest(".item");
            if (!clickedItem) return;
            
            const items = Array.from(document.querySelectorAll(".slide .item"));
            const clickedIndex = items.indexOf(clickedItem);
            
            // Only handle clicks on preview items (index 2 or higher)
            if (clickedIndex >= 2) {
                e.stopPropagation();
                moveToItem(clickedItem);
            }
        });
        
        // Setup initial cursor styles
        setupPreviewClicks();
        
        // Update cursor styles after carousel movements
        const observer = new MutationObserver(() => {
            setupPreviewClicks();
        });
        
        observer.observe(slideContainer, { childList: true });
    }

    // Video Modal functionality
    const modalVideoPlayer = document.getElementById('modal-video-player');
    const modalMuteBtn = document.getElementById('modal-video-mute-btn');
    const modalVolumeOnIcon = document.getElementById('modal-volume-on');
    const modalVolumeOffIcon = document.getElementById('modal-volume-off');
    const seeMoreButtons = document.querySelectorAll('.seeMore[data-video-src]');

    // Function to setup video modal player
    function setupVideoModalPlayer() {
        if (modalVideoPlayer && modalMuteBtn && modalVolumeOnIcon && modalVolumeOffIcon) {
            // Toggle video playback on click
            modalVideoPlayer.addEventListener('click', () => {
                if (modalVideoPlayer.paused) {
                    modalVideoPlayer.play();
                } else {
                    modalVideoPlayer.pause();
                }
            });

            // Mute/Unmute button functionality
            modalMuteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering video click
                modalVideoPlayer.muted = !modalVideoPlayer.muted;
                modalVolumeOnIcon.classList.toggle('hidden', modalVideoPlayer.muted);
                modalVolumeOffIcon.classList.toggle('hidden', !modalVideoPlayer.muted);
            });
        }
    }

    // Setup video modal player on page load
    setupVideoModalPlayer();

    // Handle "Watch Video" button clicks
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const videoSrc = button.getAttribute('data-video-src');
            
            if (modalVideoPlayer && videoSrc) {
                // Set video source
                modalVideoPlayer.src = videoSrc;
                
                // Open the video modal
                openModal('video-modal');
                
                // Play the video after a short delay to ensure modal is open
                setTimeout(() => {
                    modalVideoPlayer.play().catch(err => {
                        console.log('Video autoplay prevented:', err);
                    });
                }, 300);
            }
        });
    });

    // Note: Video pausing when modal closes is handled in the closeModal function above

    // Parallax effect for homepage hero background image with smooth interpolation
    const backgroundImage = document.querySelector('.background-image');
    
    if (backgroundImage && mainContent) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const windowWidth = window.innerWidth / 2.5;
        const windowHeight = window.innerHeight / 2.5;
        
        // Current and target positions for smooth interpolation
        let currentX = -5;
        let currentY = -5;
        let targetX = -5;
        let targetY = -5;
        let animationFrame = null;
        
        // Easing function for smooth, viscous movement (ease-out cubic)
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        
        // Smooth interpolation function
        const updateTransform = () => {
            const speed = 0.08; // Lower = slower, more viscous (0.05-0.1 for more obvious effect)
            const diffX = targetX - currentX;
            const diffY = targetY - currentY;
            
            // Only animate if there's a meaningful difference
            if (Math.abs(diffX) > 0.005 || Math.abs(diffY) > 0.005) {
                // Smooth interpolation with easing
                const t = speed;
                const easedT = easeOutCubic(t);
                currentX += diffX * easedT;
                currentY += diffY * easedT;
                
                backgroundImage.style.transform = `translate3d(${currentX}%, ${currentY}%, 0)`;
                animationFrame = requestAnimationFrame(updateTransform);
            } else {
                // Snap to final position when close enough
                currentX = targetX;
                currentY = targetY;
                backgroundImage.style.transform = `translate3d(${currentX}%, ${currentY}%, 0)`;
                animationFrame = null;
            }
        };
        
        mainContent.addEventListener('mousemove', (e) => {
            const offsetX = (e.clientX - centerX) / windowWidth;
            const offsetY = (e.clientY - centerY) / windowHeight;
            
            // Update target position
            targetX = -5 - offsetX;
            targetY = -5 - offsetY;
            
            // Start animation loop if not already running
            if (!animationFrame) {
                animationFrame = requestAnimationFrame(updateTransform);
            }
        });
    }
});