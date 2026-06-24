// Color Constants
const COLOR_CREAM = '#E9E1DB';
const COLOR_DARK_BLUE = '#242c3d';

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
    // Modal functionality
    const modals = document.querySelectorAll(".modal");
    const closeBtns = document.querySelectorAll(".close-button");
    const mainContent = document.getElementById('main-content');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.style.display = 'flex';
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
        slideContainer.addEventListener("click", function (e) {
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

    // Parallax effect for homepage hero background images with multi-plane depth
    const backgroundImage = document.querySelector('.background-image');
    const foregroundImage = document.querySelector('.foreground-image');

    if ((backgroundImage || foregroundImage) && mainContent) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const windowWidth = window.innerWidth / 2.5;
        const windowHeight = window.innerHeight / 2.5;

        // Track variables for Layer 1 (Background)
        let bgCurrentX = -5; let bgCurrentY = -5;
        let bgTargetX = -5; let bgTargetY = -5;

        // Track variables for Layer 2 (Foreground)
        let fgCurrentX = -5; let fgCurrentY = -5;
        let fgTargetX = -5; let fgTargetY = -5;

        let animationFrame = null;

        // Easing function for smooth, viscous movement
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const updateTransform = () => {
            const speed = 0.08;
            const easedT = easeOutCubic(speed);
            let needsUpdate = false;

            // Animate Layer 1 (Background)
            if (backgroundImage) {
                const bgDiffX = bgTargetX - bgCurrentX;
                const bgDiffY = bgTargetY - bgCurrentY;

                if (Math.abs(bgDiffX) > 0.005 || Math.abs(bgDiffY) > 0.005) {
                    bgCurrentX += bgDiffX * easedT;
                    bgCurrentY += bgDiffY * easedT;
                    backgroundImage.style.transform = `translate3d(${bgCurrentX}%, ${bgCurrentY}%, 0) scale(1.2)`;
                    needsUpdate = true;
                }
            }

            // Animate Layer 2 (Foreground)
            if (foregroundImage) {
                const fgDiffX = fgTargetX - fgCurrentX;
                const fgDiffY = fgTargetY - fgCurrentY;

                if (Math.abs(fgDiffX) > 0.005 || Math.abs(fgDiffY) > 0.005) {
                    fgCurrentX += fgDiffX * easedT;
                    fgCurrentY += fgDiffY * easedT;
                    // Scaling this slightly larger (1.15) to account for faster movement
                    foregroundImage.style.transform = `translate3d(${fgCurrentX}%, ${fgCurrentY}%, 0) scale(1.15)`;
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                animationFrame = requestAnimationFrame(updateTransform);
            } else {
                animationFrame = null; // Snap and sleep when settled
            }
        };

        mainContent.addEventListener('mousemove', (e) => {
            const offsetX = (e.clientX - centerX) / windowWidth;
            const offsetY = (e.clientY - centerY) / windowHeight;

            // LAYER 1: Moves opposite to the mouse (subtracting offset)
            bgTargetX = -5 - offsetX;
            bgTargetY = -5 - offsetY;

            // LAYER 2: Moves with the mouse (adding offset)
            // Multiplying by 1.5 makes it move slightly faster, increasing the 3D effect
            fgTargetX = -5 + (offsetX * 1.5);
            fgTargetY = -5 + (offsetY * 1.5);

            if (!animationFrame) {
                animationFrame = requestAnimationFrame(updateTransform);
            }
        });
    }
});

// Video Projects Dynamic Loading
window.videoProjectsData = [];

async function loadProjects() {
    try {
        const response = await fetch('projects.md');
        if (!response.ok) return;
        const text = await response.text();

        const projectsRaw = text.split('---').map(s => s.trim()).filter(s => s.length > 0);

        const listContainer = document.getElementById('project-list');
        const articlesWrapper = document.getElementById('articles-wrapper');

        if (!listContainer || !articlesWrapper) return;

        let listHtml = `
            <div class="w-full rounded-2xl bg-dark-blue/40 backdrop-blur-md border border-cream/10 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-inner">
                <h2 class="h1-text text-3xl text-cream drop-shadow-md">Projects</h2>
                <div class="font-mono text-xs text-cream/50 mt-1">${projectsRaw.length} Items</div>
            </div>
        `;
        window.videoProjectsData = []; // clear if called multiple times

        projectsRaw.forEach((raw, index) => {
            const lines = raw.split('\n');
            let title = '';
            let date = '';
            let thumbnail = '';
            let description = '';
            let customId = '';
            let contentLines = [];

            let inMetadata = true;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.startsWith('# ')) {
                    title = line.replace('# ', '').trim();
                } else if (line.startsWith('**Date:**')) {
                    date = line.replace('**Date:**', '').trim();
                } else if (line.startsWith('**Thumbnail:**')) {
                    thumbnail = line.replace('**Thumbnail:**', '').trim();
                } else if (line.startsWith('**ID:**')) {
                    customId = line.replace('**ID:**', '').trim();
                } else if (line.startsWith('**Description:**')) {
                    description = line.replace('**Description:**', '').trim();
                } else {
                    if (line.trim() === '' && title && date && thumbnail && description) {
                        inMetadata = false;
                    }
                    if (!inMetadata) {
                        contentLines.push(line);
                    }
                }
            }

            // Ensure images in markdown are lazy loaded
            let articleContent = typeof marked !== 'undefined' ? marked.parse(contentLines.join('\n')) : contentLines.join('\n');
            articleContent = articleContent.replace(/<img /g, '<img loading="lazy" ');

            const articleId = customId || ('article-' + index);

            window.videoProjectsData.push({
                id: articleId,
                title,
                date,
                thumbnail,
                description,
                htmlContent: articleContent
            });

            listHtml += `
                <button id="nav-${articleId}" class="project-item group w-full text-left relative overflow-hidden rounded-2xl bg-cream/10 backdrop-blur-md border border-cream/20 shadow-lg hover:bg-cream/20 transition-all duration-300 flex items-stretch p-4 flex-shrink-0 min-h-[140px] md:min-h-[160px]" onclick="showArticle('${articleId}')">
                    <div class="flex flex-col justify-center w-2/3 pr-4 z-10 py-2">
                        <div>
                            <h2 class="h1-text text-2xl md:text-3xl text-cream font-bold leading-tight drop-shadow-md">${title}</h2>
                            <p class="dashiell-text text-sm md:text-base text-cream/90 mt-2 line-clamp-2 drop-shadow-sm">${description}</p>
                        </div>
                        <div class="font-mono text-xs text-cream/70 mt-4">${date}</div>
                    </div>
                    <div class="w-1/3 relative z-10 rounded-xl overflow-hidden border border-cream/20 shadow-inner">
                        <img src="${thumbnail}" loading="lazy" alt="Thumbnail" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                </button>
            `;
        });

        listContainer.innerHTML = listHtml;

        // Update scroll mask
        const updateScrollMask = () => {
            const atTop = listContainer.scrollTop <= 0;
            const atBottom = Math.ceil(listContainer.scrollTop + listContainer.clientHeight) >= listContainer.scrollHeight;
            listContainer.classList.toggle('at-top', atTop);
            listContainer.classList.toggle('at-bottom', atBottom);
        };

        // Remove old listeners to prevent duplicates if loadProjects is called again
        if (listContainer._scrollMaskHandler) {
            listContainer.removeEventListener('scroll', listContainer._scrollMaskHandler);
            window.removeEventListener('resize', listContainer._scrollMaskHandler);
        }

        listContainer._scrollMaskHandler = updateScrollMask;
        listContainer.addEventListener('scroll', updateScrollMask);
        window.addEventListener('resize', updateScrollMask);

        // Initial state
        setTimeout(updateScrollMask, 50);

        if (window.videoProjectsData.length > 0) {
            const hashId = window.location.hash.replace('#', '');
            if (hashId && window.videoProjectsData.some(p => p.id === hashId)) {
                showArticle(hashId, true);
            } else {
                showArticle(window.videoProjectsData[0].id, true);
            }
        }

    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

function showArticle(articleId, isInitialLoad = false) {
    const project = window.videoProjectsData.find(p => p.id === articleId);
    if (!project) return;

    // Update URL hash without jumping
    if (!isInitialLoad) {
        history.replaceState(null, null, '#' + project.id);
    }

    // Highlight the selected item in the list
    document.querySelectorAll('.project-item').forEach(btn => {
        btn.classList.remove('bg-cream/30', 'border-cream/50', 'scale-[1.02]', 'scale-105');
        btn.classList.add('bg-cream/10', 'border-cream/20');
    });
    const activeBtn = document.getElementById(`nav-${articleId}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-cream/10', 'border-cream/20');
        activeBtn.classList.add('bg-cream/30', 'border-cream/50');
    }

    const articlesWrapper = document.getElementById('articles-wrapper');
    if (!articlesWrapper) return;

    // Check if we are already showing this article
    const currentArticles = articlesWrapper.querySelectorAll('article');
    if (currentArticles.length > 0 && currentArticles[currentArticles.length - 1].id === project.id) return;

    const newHtml = `
        <article id="${project.id}" class="project-content pb-24 md:pb-0">
            <h1 class="h1-text text-4xl md:text-5xl lg:text-6xl text-cream mb-4 md:mb-6 drop-shadow-md">${project.title}</h1>
            <div class="font-mono text-sm text-cream/70 mb-8 border-b border-cream/20 pb-4">${project.date}</div>
            <div class="dashiell-text text-cream/90 space-y-6 text-lg leading-relaxed markdown-content">
                ${project.htmlContent}
            </div>
        </article>
    `;

    // Apply grid to wrapper to stack articles on top of each other
    articlesWrapper.style.display = 'grid';
    articlesWrapper.style.alignItems = 'start';

    if (isInitialLoad || currentArticles.length === 0) {
        articlesWrapper.innerHTML = newHtml;
        const newArticle = articlesWrapper.querySelector('article');
        newArticle.style.gridArea = '1 / 1 / 2 / 2';
    } else {
        // Create new article element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newHtml;
        const newArticle = tempDiv.firstElementChild;
        newArticle.style.gridArea = '1 / 1 / 2 / 2';

        // Ensure old articles share the same grid area
        currentArticles.forEach(art => {
            art.style.gridArea = '1 / 1 / 2 / 2';
        });

        // Add new article to DOM
        articlesWrapper.appendChild(newArticle);
        articlesWrapper.scrollTop = 0;

        // Animate old articles out
        currentArticles.forEach(oldArticle => {
            const fadeOut = oldArticle.animate([
                { opacity: 1, transform: 'translateY(0)' },
                { opacity: 0, transform: 'translateY(-10px)' }
            ], { duration: 400, easing: 'ease-out', fill: 'forwards' });

            fadeOut.onfinish = () => {
                oldArticle.remove();
            };
        });

        // Animate new article in
        newArticle.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 400, easing: 'ease-out' });
    }

    if (window.innerWidth < 768 && !isInitialLoad) {
        const list = document.getElementById('project-list');
        const articleContainer = document.getElementById('project-article-container');
        const backBtn = document.getElementById('mobile-back-btn');

        if (list) list.style.display = 'none';
        if (articleContainer) articleContainer.style.display = 'block';

        if (backBtn) {
            backBtn.classList.remove('hidden');
            backBtn.classList.add('flex');
        }
    }
}

function goBackToProjects() {
    if (window.innerWidth < 768) {
        const list = document.getElementById('project-list');
        const articleContainer = document.getElementById('project-article-container');
        const backBtn = document.getElementById('mobile-back-btn');

        if (list) list.style.display = 'flex';
        if (articleContainer) articleContainer.style.display = 'none';

        if (backBtn) {
            backBtn.classList.add('hidden');
            backBtn.classList.remove('flex');
        }
    }
}

window.addEventListener('resize', () => {
    const list = document.getElementById('project-list');
    const articleContainer = document.getElementById('project-article-container');
    const backBtn = document.getElementById('mobile-back-btn');

    if (window.innerWidth >= 768) {
        if (list) list.style.display = '';
        if (articleContainer) articleContainer.style.display = '';
        if (backBtn) {
            backBtn.classList.add('hidden');
            backBtn.classList.remove('flex');
        }
    }
});

// Handle browser back/forward buttons navigating through hashes
window.addEventListener('hashchange', () => {
    const hashId = window.location.hash.replace('#', '');
    if (hashId && window.videoProjectsData && window.videoProjectsData.some(p => p.id === hashId)) {
        // Find if it's already active to prevent double-animating
        const wrapper = document.getElementById('articles-wrapper');
        const currentArticles = wrapper ? wrapper.querySelectorAll('article') : [];
        if (currentArticles.length === 0 || currentArticles[currentArticles.length - 1].id !== hashId) {
            showArticle(hashId, false);
        }
    } else if (!hashId && window.videoProjectsData && window.videoProjectsData.length > 0) {
        showArticle(window.videoProjectsData[0].id, false);
    }
});

// Run loadProjects on DOMContentLoaded if we are on the video page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('video-split-layout')) {
        loadProjects();
    }
});