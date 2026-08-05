import React from 'react';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      {/* Main Content Wrapper */}
      <div id="main-content" className="h-full w-full flex flex-col items-center justify-center transition-all duration-500">

        {/* Background */}
        <div className="background-image absolute inset-0 -z-10"></div>
        <div className="absolute inset-0 -z-10 bg-black opacity-10"></div>

        {/* Hero Text */}
        <div className="text-center relative z-10">
          <h1 className="h1-text text-5xl md:text-6xl lg:text-8xl font-bold mb-4 text-cream">
            Hey, I'm Evan.
          </h1>
          <p className="text-lg md:text-xl lg:text-1.5xl font-medium px-4 dashiell-text max-w-2lg mx-auto text-cream">
            I'm a student and creative based <br className="md:hidden" /> in Ann Arbor, Michigan.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
