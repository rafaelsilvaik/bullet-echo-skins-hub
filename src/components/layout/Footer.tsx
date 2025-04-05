
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bullet-black border-t border-bullet-red/30 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-bullet-red to-bullet-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">BE</span>
              </div>
              <span className="text-xl font-rajdhani font-bold gradient-text">Bullet Echo Checklist</span>
            </Link>
            <p className="text-sm text-gray-400 text-center md:text-left">
              Um aplicativo não-oficial para gerenciar suas skins de Bullet Echo.
              <br />
              Este site não é afiliado ou endossado pela Fun Plus ou ZeptoLab.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4 mb-2">
              <Link to="/heroes" className="text-gray-400 hover:text-bullet-red transition-colors text-sm">
                Heróis
              </Link>
              <Link to="/checklist" className="text-gray-400 hover:text-bullet-red transition-colors text-sm">
                Checklist
              </Link>
              <Link to="/chat" className="text-gray-400 hover:text-bullet-red transition-colors text-sm">
                Chat
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              &copy; {currentYear} Bullet Echo Checklist Skin
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
