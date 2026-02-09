import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import CallToActionSection from "@/components/CallToActionSection";
import Header from "@/layout/navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <AboutSection />
      <ServicesSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
}