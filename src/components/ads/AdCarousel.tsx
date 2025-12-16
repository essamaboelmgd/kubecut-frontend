import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ad, API_URL } from '@/lib/api';
import { ExternalLink } from 'lucide-react';

interface AdCarouselProps {
  ads: Ad[];
  aspectRatio?: string; // e.g., "aspect-[3/1]"
  className?: string;
}

export const AdCarousel = ({ ads, aspectRatio = "aspect-[21/9] md:aspect-[3/1]", className = "" }: AdCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];
  
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-xl group ${aspectRatio} ${className}`}>
        <AnimatePresence mode='wait'>
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full"
            >
                {currentAd.link_url ? (
                    <a href={currentAd.link_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                         <img 
                            src={getImageUrl(currentAd.image_url)} 
                            alt={currentAd.title} 
                            className="w-full h-full object-cover"
                        />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <ExternalLink className="text-white w-8 h-8 drop-shadow-md" />
                         </div>
                    </a>
                ) : (
                    <img 
                        src={getImageUrl(currentAd.image_url)} 
                        alt={currentAd.title} 
                        className="w-full h-full object-cover"
                    />
                )}
               
                {/* Optional Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium text-sm md:text-base">{currentAd.title}</p>
                </div>
            </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        {ads.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {ads.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                        }`}
                    />
                ))}
            </div>
        )}
    </div>
  );
};
