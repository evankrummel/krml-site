import React from 'react';
import Layout from '../components/Layout';

const Contact = () => {
  return (
    <Layout>
      {/* Core Content */}
      <div id="main-content" className="h-full w-full flex flex-col items-center justify-center transition-all duration-500">
        
        {/* Background */}
        <div className="background-image absolute inset-0 -z-30 will-change-transform"></div>
        <div className="absolute inset-0 -z-10 bg-black opacity-10"></div>

        {/* Contact Content */}
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-24 md:py-32 relative w-full">
          <div className="relative w-[90%] md:w-[150%] max-w-md h-[360px] md:h-[60%] flex flex-col items-center justify-center">
            {/* Background Box Layer */}
            <div className="contact-box absolute inset-0 rounded-xl z-0 pointer-events-none"></div>

            {/* Content Layer */}
            <div className="text-dark-blue dashiell-text w-full h-full py-4 px-6 flex flex-col items-center justify-center space-y-3 text-center relative z-10">
              <img src="/images/circle-contact.png" alt="Evan Krummel" className="w-28 h-28 object-cover rounded-lg" />
              
              <h3 className="h1-text text-3xl font-bold text-dark-blue">Evan Krummel</h3>

              <p className="text-xl font-medium text-dark-blue">Student & Creative Professional</p>
              
              <a href="mailto:evan@krml.me" className="text-lg font-medium text-dark-blue hover:opacity-70 transition-opacity">evan@krml.me</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
