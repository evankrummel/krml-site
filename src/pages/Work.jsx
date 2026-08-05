import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import Markdown from 'react-markdown';
import { useLocation, useNavigate } from 'react-router-dom';

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [isMobileListHidden, setIsMobileListHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const listContainerRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/projects.md');
        if (!response.ok) return;
        const text = await response.text();

        const projectsRaw = text.split('---').map(s => s.trim()).filter(s => s.length > 0);
        const parsedProjects = projectsRaw.map((raw, index) => {
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

          return {
            id: customId || `article-${index}`,
            title,
            date,
            thumbnail,
            description,
            content: contentLines.join('\n')
          };
        });

        setProjects(parsedProjects);

        const hashId = location.hash.replace('#', '');
        if (hashId && parsedProjects.some(p => p.id === hashId)) {
          setActiveProject(hashId);
          if (window.innerWidth < 768) setIsMobileListHidden(true);
        } else if (parsedProjects.length > 0) {
          setActiveProject(parsedProjects[0].id);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const hashId = location.hash.replace('#', '');
    if (hashId && projects.some(p => p.id === hashId) && activeProject !== hashId) {
      setActiveProject(hashId);
      if (window.innerWidth < 768) setIsMobileListHidden(true);
    }
  }, [location.hash, projects]);

  const handleProjectClick = (id) => {
    setActiveProject(id);
    navigate(`#${id}`, { replace: true });
    if (window.innerWidth < 768) {
      setIsMobileListHidden(true);
    }
  };

  const goBackToProjects = () => {
    setIsMobileListHidden(false);
  };

  const handleScroll = () => {
    if (listContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listContainerRef.current;
      const atTop = scrollTop <= 0;
      const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      listContainerRef.current.classList.toggle('at-top', atTop);
      listContainerRef.current.classList.toggle('at-bottom', atBottom);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileListHidden(false);
      }
      handleScroll();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeProjectData = projects.find(p => p.id === activeProject);

  return (
    <Layout>
      <div id="main-content" className="min-h-screen w-full flex flex-col transition-all duration-500">
        {/* Background */}
        <div className="background-image fixed inset-0 -z-30 will-change-transform"></div>
        <div className="fixed inset-0 -z-10 bg-black opacity-10"></div>

        {/* Main Content Split Layout */}
        <div id="video-split-layout" className="absolute inset-0 pt-28 px-4 md:px-8 pb-8 flex flex-col md:flex-row gap-6 z-10 pointer-events-none">
          
          {/* Left Panel: Project List */}
          <div 
            id="project-list" 
            ref={listContainerRef}
            onScroll={handleScroll}
            className={`w-full md:w-1/3 flex-col gap-5 overflow-y-auto pb-24 md:pb-0 h-full hide-scrollbar pointer-events-auto ${isMobileListHidden ? 'hidden md:flex' : 'flex'}`}
          >
            <div className="w-full rounded-2xl bg-dark-blue/40 backdrop-blur-lg border border-cream/10 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-inner mb-5">
              <h2 className="h1-text text-3xl text-cream drop-shadow-md m-0">Projects</h2>
              <div className="font-mono text-xs text-cream/50 mt-1">{projects.length} Items</div>
            </div>

            {projects.map((project) => {
              const isActive = project.id === activeProject;
              return (
                <button 
                  key={project.id}
                  id={`nav-${project.id}`}
                  onClick={() => handleProjectClick(project.id)}
                  className={`project-item group w-full text-left relative overflow-hidden rounded-2xl backdrop-blur-lg shadow-lg transition-all duration-300 flex items-stretch p-4 flex-shrink-0 min-h-[140px] md:min-h-[160px] ${isActive ? 'bg-cream/30 border-cream/50 border' : 'bg-cream/10 border border-cream/20 hover:bg-cream/20'}`}
                >
                  <div className="flex flex-col justify-center w-2/3 pr-4 z-10 py-2">
                    <div>
                      <h2 className="h1-text text-2xl md:text-3xl text-cream font-bold leading-tight drop-shadow-md m-0">{project.title}</h2>
                      <p className="dashiell-text text-sm md:text-base text-cream/90 mt-2 line-clamp-2 drop-shadow-sm">{project.description}</p>
                    </div>
                    <div className="font-mono text-xs text-cream/70 mt-4">{project.date}</div>
                  </div>
                  <div className="w-1/3 relative z-10 rounded-xl overflow-hidden border border-cream/20 shadow-inner">
                    <img src={project.thumbnail} loading="lazy" alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Panel: Article Container */}
          <div 
            id="project-article-container" 
            className={`w-full md:w-2/3 h-full relative pointer-events-auto ${isMobileListHidden ? 'block' : 'hidden md:block'}`}
          >
            {/* Mobile Back Button */}
            <button 
              id="mobile-back-btn" 
              onClick={goBackToProjects}
              className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 pill-button bg-cream/90 text-dark-blue border border-cream shadow-2xl backdrop-blur-md px-8 py-3 items-center gap-2 z-[100] transition-transform hover:scale-105 active:scale-95 whitespace-nowrap ${isMobileListHidden ? 'flex' : 'hidden'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              All Projects
            </button>

            <div id="articles-wrapper" className="bg-cream/10 backdrop-blur-lg rounded-2xl border border-cream/20 p-6 md:p-10 overflow-y-auto h-full hide-scrollbar shadow-2xl relative">
              {activeProjectData && (
                <article id={activeProjectData.id} className="project-content pb-24 md:pb-0 relative animate-[fadeIn_0.4s_ease-out]">
                  <h1 className="h1-text text-4xl md:text-5xl lg:text-6xl text-cream mb-4 md:mb-6 drop-shadow-md mt-0">{activeProjectData.title}</h1>
                  <div className="font-mono text-sm text-cream/70 mb-8 border-b border-cream/20 pb-4">{activeProjectData.date}</div>
                  <div className="dashiell-text text-cream/90 space-y-6 text-lg leading-relaxed markdown-content">
                    <Markdown components={{
                      img: ({node, ...props}) => <img loading="lazy" {...props} alt={props.alt || ''} />,
                    }}>
                      {activeProjectData.content}
                    </Markdown>
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Work;
