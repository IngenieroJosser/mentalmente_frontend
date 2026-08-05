import Header from "@/layout/navbar";
import HeroSection from "@/components/HeroSection";
import InicioSection from "@/components/InicioSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ValuesSection from "@/components/ValuesSection";
import MethodologySection from "@/components/MethodologySection";
import FAQSection from "@/components/FAQSection";
import CallToActionSection from "@/components/CallToActionSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <InicioSection />
      <AboutSection />
      <ServicesSection />
      <ValuesSection />
      <MethodologySection />
      <FAQSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
}
