
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, List } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-langlearn-blue text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <Book size={24} />
          <span>LangLearn</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`flex items-center gap-2 hover:text-langlearn-beige transition-colors ${
              location.pathname === '/' ? 'text-langlearn-beige' : ''
            }`}
          >
            <Book size={20} />
            <span>Jouer</span>
          </Link>
          
          <Link 
            to="/words-manager" 
            className={`flex items-center gap-2 hover:text-langlearn-beige transition-colors ${
              location.pathname === '/words-manager' ? 'text-langlearn-beige' : ''
            }`}
          >
            <List size={20} />
            <span>Gérer les mots</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
