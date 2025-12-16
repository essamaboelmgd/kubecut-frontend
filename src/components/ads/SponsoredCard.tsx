import { motion } from 'framer-motion';
import { ExternalLink, Megaphone } from 'lucide-react';
import { Ad, API_URL } from '@/lib/api';

interface SponsoredCardProps {
  ad: Ad;
}

export const SponsoredCard = ({ ad }: SponsoredCardProps) => {
    const getImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_URL}${path}`;
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden group border-amber-500/20 shadow-sm shadow-amber-500/5 hover:border-amber-500/40 hover:shadow-amber-500/10"
    >
       <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer" className="block h-full flex flex-col">
            <div className="aspect-square overflow-hidden bg-muted/20 relative">
                 <img
                    src={getImageUrl(ad.image_url)}
                    alt={ad.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                        <Megaphone className="w-3 h-3" />
                        إعلان
                    </span>
                </div>
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <ExternalLink className="text-white w-8 h-8 drop-shadow-md" />
                 </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between bg-amber-500/5">
                <div>
                    <h3 className="font-bold text-sm line-clamp-2 md:text-base group-hover:text-amber-600 transition-colors">
                        {ad.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">برعاية</p>
                </div>
                <div className="mt-3 pt-3 border-t border-amber-500/10 flex justify-between items-center text-xs">
                    <span className="text-amber-600 font-medium">عرض التفاصيل</span>
                    <ExternalLink className="w-3 h-3 text-amber-600" />
                </div>
            </div>
       </a>
    </motion.div>
  );
};
