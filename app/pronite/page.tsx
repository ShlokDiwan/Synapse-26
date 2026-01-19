'use client';

import React from "react";
import ProniteHero from "@/components/ProniteHero";
import ArtistCarousel from "@/components/ArtistCarousel";
import ProniteGallery from "@/components/ProniteGallery";
import Footer from "@/components/ui/Footer";
import { Navbar, NavbarButton } from "@/components/ui/Resizable-navbar";
import NavigationPanel from "@/components/ui/NavigationPanel";
import { useAuth } from "@/hooks/useAuth";
import TextReveal from "@/components/TextReveal";

export default function PronitePage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="bg-black text-white selection:bg-red-600 selection:text-white">
      <Navbar visible={true}>
        <NavigationPanel />
      </Navbar>

      {/* Hero Section */}
      <ProniteHero />

      {/* Stacked Carousel Section */}
      <section className="bg-black">
        <ArtistCarousel />
      </section>

      {/* Quote Section */}
      <section className="bg-black pt-10 pb-40 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <TextReveal
            text="Synapse is a living celebration of music, art, and creativity, brought to life through performances, people, and passion."
          />
        </div>
      </section>

      {/* Gallery Section */}
      <ProniteGallery />

      {/* Registration Section */}
      <section className="bg-black py-40 px-4 text-center">
        <h1 className="text-[clamp(3.5rem,15vw,10rem)] font-texgyreadventor leading-none mb-4">
          Join the <br /> Celebration
        </h1>
        <p className="font-jqka text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          One night. Endless energy. Unforgettable memories. <br />A moment
          you&apos;ll wish you were part of.
        </p>

        {!isAuthenticated ? (
          <div className="flex justify-center">
            <NavbarButton href="/auth" variant="register">
              REGISTER
            </NavbarButton>
          </div>
        ) : (
          <div className="flex justify-center">
            <NavbarButton
              variant="register"
              onClick={async () => {
                const { createClient } = await import(
                  "@/utils/supabase/client"
                );
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
            >
              LOGOUT
            </NavbarButton>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
