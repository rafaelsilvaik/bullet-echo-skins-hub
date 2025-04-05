
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  alternateLink: {
    text: string;
    route: string;
    label: string;
  };
};

const AuthLayout = ({ children, title, subtitle, alternateLink }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-game">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-bullet-red to-bullet-purple flex items-center justify-center animate-pulse-neon">
                <span className="text-white font-bold text-2xl">BE</span>
              </div>
            </Link>
            <h1 className="text-3xl font-rajdhani font-bold gradient-text mb-2">{title}</h1>
            <p className="text-gray-400">{subtitle}</p>
          </div>
          
          <div className="bg-bullet-darkgray/80 backdrop-blur-sm rounded-lg border border-gray-800 shadow-lg p-8">
            {children}
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">{alternateLink.text} </span>
              <Link to={alternateLink.route} className="text-bullet-red hover:text-bullet-red/80 font-medium transition-colors">
                {alternateLink.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Bullet Echo Checklist Skin</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
