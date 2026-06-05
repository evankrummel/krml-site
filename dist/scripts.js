    
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
    const mainContent = document.getElementById('main-content');
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
                    backgroundImage.style.transform = `translate3d(${bgCurrentX}%, ${bgCurrentY}%, 0) scale(1.1)`;
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