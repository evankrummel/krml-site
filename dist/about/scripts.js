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
    // --- BENTO GRID HERO LOGIC ---
    
    // Placeholder Data - Replace with real image URLs in production
    // Using picsum.photos with seeds to ensure we get distinct images every time
    const imageCollections = {
        landscape: Array.from({length: 12}, (_, i) => `https://picsum.photos/seed/land${i}/800/600`),
        portrait: Array.from({length: 12}, (_, i) => `https://picsum.photos/seed/port${i}/600/800`),
        square: Array.from({length: 12}, (_, i) => `https://picsum.photos/seed/sq${i}/800/800`)
    };

    const bentoItems = document.querySelectorAll('.bento-item');
    // Set to track currently displayed URLs to avoid duplicates
    const displayedImages = new Set();
    
    // Initial Population
    bentoItems.forEach(item => {
        const aspect = item.dataset.aspect;
        const availableImages = imageCollections[aspect].filter(url => !displayedImages.has(url));
        
        if (availableImages.length > 0) {
            // Pick a random image from available ones
            const randomIndex = Math.floor(Math.random() * availableImages.length);
            const imageUrl = availableImages[randomIndex];
            
            // Create and append img element
            const img = document.createElement('img');
            img.src = imageUrl;
            img.className = 'bento-img active';
            img.alt = "Portfolio Image";
            item.appendChild(img);
            
            // Track usage
            displayedImages.add(imageUrl);
        }
    });

    // Random Swapping Logic
    setInterval(() => {
        // 1. Pick a random grid item
        const randomIndex = Math.floor(Math.random() * bentoItems.length);
        const item = bentoItems[randomIndex];
        const aspect = item.dataset.aspect;
        
        // 2. Find current image URL
        const currentImg = item.querySelector('img.active') || item.querySelector('img');
        const currentUrl = currentImg ? currentImg.src : null;
        
        // 3. Select a NEW image that is not currently displayed anywhere
        const availableImages = imageCollections[aspect].filter(url => !displayedImages.has(url));
        
        if (availableImages.length > 0) {
            const newIndex = Math.floor(Math.random() * availableImages.length);
            const newUrl = availableImages[newIndex];
            
            // 4. Create new image element (starts invisible/blurred)
            const newImg = document.createElement('img');
            newImg.src = newUrl;
            newImg.className = 'bento-img entering';
            newImg.alt = "Portfolio Image";
            
            // Append BEHIND or overlay? Let's overlay.
            // Actually, if we append it, it sits on top by default z-order if position absolute.
            // Let's ensure styles handle z-index or simple opacity cross-fade.
            // Since they are absolute, last child is on top.
            item.appendChild(newImg);
            
            // Force reflow
            void newImg.offsetHeight;
            
            // 5. Trigger Transition
            requestAnimationFrame(() => {
                newImg.classList.remove('entering');
                newImg.classList.add('active'); // Fades in, blurs out
                
                if (currentImg) {
                    currentImg.classList.remove('active');
                    currentImg.classList.add('leaving'); // Optional class if we want specific leaving animation
                }
            });
            
            // 6. Cleanup after transition
            setTimeout(() => {
                if (currentImg) {
                    currentImg.remove();
                    displayedImages.delete(currentUrl); // Free up the old URL
                }
                displayedImages.add(newUrl); // Lock the new URL
            }, 1000); // Matches CSS transition duration
        }
        
    }, 6000); // Every 6 seconds

    // --- LIGHTBOX LOGIC ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close-button');

    if (lightboxModal && lightboxImage) {
        // Open Lightbox
        bentoItems.forEach(item => {
            item.addEventListener('click', () => {
                const activeImg = item.querySelector('img.active') || item.querySelector('img');
                if (activeImg) {
                    lightboxImage.src = activeImg.src;
                    lightboxModal.style.display = 'flex';
                    
                    // Animation
                    requestAnimationFrame(() => {
                        lightboxModal.classList.add('active');
                    });
                }
            });
        });

        // Close functions
        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            setTimeout(() => {
                lightboxModal.style.display = 'none';
                lightboxImage.src = '';
            }, 500);
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal background click from firing immediately after
                closeLightbox();
            });
        }

        // Close on background click
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.closest('.lightbox-content') === null) {
                if(e.target !== lightboxClose) closeLightbox();
            }
        });

        // Close on Escape
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // --- EXISTING LOGIC BELOW (Preserved) ---

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
    
    // Check for /about, /work, or /contact paths
    if (pathname.includes('/about') || currentPage === 'about' || currentPage === 'about.html' || currentPage === 'index.html') {
        activePageLink = document.getElementById('about-link');
    } else if (pathname.includes('/work') || currentPage === 'work' || currentPage === 'work.html') {
        activePageLink = document.getElementById('work-link');
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
            } else if (e.target === modal && modal.id !== 'lightbox-modal') {
                // For other modals, close when clicking directly on modal
                // Exclude lightbox here because it has its own logic above
                closeModal(modal.id);
            }
        });
    });

    // Add Escape key listener
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active') && modal.id !== 'lightbox-modal') {
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

});