import React from 'react';
import Logo from './Logo';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#fdfbf7] z-[100] flex flex-col items-center justify-center">
       <div className="animate-breathe">
           <Logo size={120} />
       </div>
       <div className="mt-8 flex gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></span>
       </div>
    </div>
  );
};

export default SplashScreen;
