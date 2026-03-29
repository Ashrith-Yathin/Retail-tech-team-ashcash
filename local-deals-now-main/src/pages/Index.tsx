import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ConceptSection from "@/components/ConceptSection";
import QualitySection from "@/components/QualitySection";
import FeaturedDeals from "@/components/FeaturedDeals";
import ValuesSection from "@/components/ValuesSection";
import HowItWorks from "@/components/HowItWorks";
import CategoriesSection from "@/components/CategoriesSection";
import ImpactSection from "@/components/ImpactSection";
import RetailerCTA from "@/components/RetailerCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSlider />
      <ConceptSection />
      <QualitySection />
      <FeaturedDeals />
      <ValuesSection />
      <HowItWorks />
      <CategoriesSection />
      <ImpactSection />
      <RetailerCTA />
      <Footer />
    </div>
  );
};

export default Index;
