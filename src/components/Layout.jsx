import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader ${!isVisible ? 'hidden' : ''}`} style={!isVisible ? { opacity: 0, transform: 'scale(1.1)', pointerEvents: 'none' } : {}}>
      <img src="/images/krml25-wordmark-cream.svg" alt="Loading" className="preloader-logo" />
    </div>
  );
};

const Navbar = () => {
  return (
    <nav id="navbar" className="fixed top-8 left-1/2 -translate-x-1/2 w-max px-3 md:px-4 py-2.5 shadow-lg transition-all duration-300 z-50 flex items-center">
      <div id="nav-links-container" className="relative flex items-center gap-x-3 md:gap-x-4 z-10 dashiell-text h-full">
        <Link to="/work" id="work-link" className="nav-link text-sm md:text-base px-4 py-1.5 pt-2 leading-none flex items-center">
          projects
        </Link>
        <Link to="/" className="flex shrink-0 items-center cursor-default">
          <img id="wordmark-logo" src="/images/krml25-wordmark-cream.svg" alt="Logo" className="h-6 md:h-8 w-auto object-contain" />
        </Link>
        <Link to="/contact" id="contact-link" className="nav-link text-sm md:text-base px-4 py-1.5 pt-2 leading-none flex items-center tracking-[0.03em]">
          contact
        </Link>
      </div>
    </nav>
  );
};

const SocialLinks = () => {
  const location = useLocation();
  const isWork = location.pathname.startsWith('/work');
  const zIndex = isWork ? 'z-50' : 'z-10'; // In Work page, might need higher z-index

  return (
    <div className={`fixed bottom-8 flex space-x-4 ${zIndex}`}>
      <a href="mailto:evan@krml.me?subject=%F0%9F%91%8B" target="_blank" rel="noopener noreferrer" className="social-link w-7 h-7">
        <img src="/images/mail-cream.png" alt="Mail Icon" className="w-full h-full" />
      </a>
      <a href="http://instagram.com/evankrummel/" target="_blank" rel="noopener noreferrer" className="social-link w-7 h-7">
        <img src="/images/insta-cream.png" alt="Instagram Icon" className="w-full h-full" />
      </a>
      <a href="https://www.linkedin.com/in/krml" target="_blank" rel="noopener noreferrer" className="social-link w-7 h-7">
        <img src="/images/linkedin-cream.png" alt="LinkedIn Icon" className="w-full h-full" />
      </a>
    </div>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/contact') {
      document.body.className = "bg-dark-blue dark:bg-dark-blue text-dark-blue dark:text-dark-blue flex flex-col items-center justify-center h-screen";
    } else {
      document.body.className = "bg-dark-blue dark:bg-dark-blue text-dark-blue dark:text-dark-blue min-h-screen";
    }

    return () => {
      document.body.className = "";
    };
  }, [location.pathname]);

  useEffect(() => {
    const backgroundImage = document.querySelector('.background-image');
    const foregroundImage = document.querySelector('.foreground-image');
    const mainContent = document.getElementById('main-content');

    if ((backgroundImage || foregroundImage) && mainContent) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const windowWidth = window.innerWidth / 2.5;
      const windowHeight = window.innerHeight / 2.5;

      let bgCurrentX = -5; let bgCurrentY = -5;
      let bgTargetX = -5; let bgTargetY = -5;
      let fgCurrentX = -5; let fgCurrentY = -5;
      let fgTargetX = -5; let fgTargetY = -5;
      let animationFrame = null;

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const updateTransform = () => {
        const speed = 0.08;
        const easedT = easeOutCubic(speed);
        let needsUpdate = false;

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

        if (foregroundImage) {
          const fgDiffX = fgTargetX - fgCurrentX;
          const fgDiffY = fgTargetY - fgCurrentY;

          if (Math.abs(fgDiffX) > 0.005 || Math.abs(fgDiffY) > 0.005) {
            fgCurrentX += fgDiffX * easedT;
            fgCurrentY += fgDiffY * easedT;
            foregroundImage.style.transform = `translate3d(${fgCurrentX}%, ${fgCurrentY}%, 0) scale(1.15)`;
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          animationFrame = requestAnimationFrame(updateTransform);
        } else {
          animationFrame = null;
        }
      };

      const handleMouseMove = (e) => {
        const offsetX = (e.clientX - centerX) / windowWidth;
        const offsetY = (e.clientY - centerY) / windowHeight;

        bgTargetX = -5 - offsetX;
        bgTargetY = -5 - offsetY;
        fgTargetX = -5 + (offsetX * 1.5);
        fgTargetY = -5 + (offsetY * 1.5);

        if (!animationFrame) {
          animationFrame = requestAnimationFrame(updateTransform);
        }
      };

      mainContent.addEventListener('mousemove', handleMouseMove);

      return () => {
        mainContent.removeEventListener('mousemove', handleMouseMove);
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [location.pathname]); // Re-run when page changes in case mainContent is re-mounted

  return (
    <>
      <Preloader />
      {children}
      <Navbar />
      <SocialLinks />
      <div className="foreground-image fixed inset-0 z-[10000] pointer-events-none will-change-transform"></div>
    </>
  );
};

export default Layout;
