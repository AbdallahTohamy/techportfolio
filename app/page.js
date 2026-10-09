import BlueprintBackground from '@/components/BlueprintBackground';
import AIModels from '@/components/AIModels';
import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import Providers from '@/components/Providers';
// import Rowing from '@/components/Rowing'; // hidden for now
import Skills from '@/components/Skills';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import Work from '@/components/Work';

export default function Home() {
  return (
    <Providers>
      <BlueprintBackground />
      <Nav />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Stats />
        <Experience />
        <Work />
        <AIModels />
        <Testimonials />
        <Skills />
        {/* <Rowing /> hidden for now */}
        <Contact />
      </main>
    </Providers>
  );
}
