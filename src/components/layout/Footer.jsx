import React from 'react';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = ({ onCtaClick }) => {
  return (
    <footer className="bg-black/40 border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">AutoUP</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} AutoUP. Visos teisės saugomos.
            </p>
          </div>

          <div className="flex justify-center md:justify-end space-x-4">
            {/*  
              <Button 
                onClick={onCtaClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Gauti konsultaciją
              </Button>
            */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;