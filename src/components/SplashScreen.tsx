import React, { useEffect, useState } from "react";
import splashGirl from "../assets/splash_girl.png";
import "animate.css";

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if user has seen splash screen
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) {
      setIsVisible(false);
      setShouldRender(false);
      return;
    }

    // If not seen, show it and then hide after a delay
    const timer = setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem("hasSeenSplash", "true");
      // Give time for exit animation
      setTimeout(() => setShouldRender(false), 1000);
    }, 4000); // Show for 4 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
      <div className="flex flex-col items-center justify-center p-8 max-w-4xl w-full">
        <div
          className={`relative ${isVisible ? "animate__animated animate__fadeInUp" : "animate__animated animate__fadeOutUp"}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl rounded-full" />
          <img
            src={splashGirl}
            alt="Welcome"
            className="relative w-auto h-[60vh] object-contain drop-shadow-2xl rounded-xl z-10"
          />
        </div>

        <h1
          className={`mt-8 text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 ${isVisible ? "animate__animated animate__fadeInUp animate__delay-1s" : ""}`}>
          Welcome to MOSP Chat
        </h1>

        <p
          className={`mt-4 text-xl text-muted-foreground ${isVisible ? "animate__animated animate__fadeInUp animate__delay-2s" : ""}`}>
          Your AI Companion
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
