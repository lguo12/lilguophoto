import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import FeaturedProject from "@/components/FeaturedProject";
import About from "@/components/About";
import ContactFooter from "@/components/ContactFooter";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Work />
        <FeaturedProject />
        <About />
      </main>
      <ContactFooter />
      <ScrollReveal />
    </>
  );
}
