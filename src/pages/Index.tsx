import { useState, useEffect } from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { AdCarousel } from '@/components/ads/AdCarousel';
import { adsApi, Ad } from '@/lib/api';

const Index = () => {
    const [ads, setAds] = useState<Ad[]>([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const data = await adsApi.getAds('landing_page');
                setAds(data);
            } catch (error) {
                console.error('Failed to load landing ads', error);
            }
        };
        fetchAds();
    }, []);

  return (
    <div className="min-h-screen bg-background font-cairo">
      <LandingHeader />
      <main>
        <HeroSection />
        
        {/* Ads Section */}
        {ads.length > 0 && (
            <div className="container mx-auto px-4 py-8">
                <AdCarousel ads={ads} aspectRatio="aspect-[21/9] md:aspect-[4/1]" />
            </div>
        )}

        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
