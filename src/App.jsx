import React, { useState, useEffect } from "react";
import ROUTES from "./routes";
import useTheme from "./hooks/useTheme";

/**
 * App Component - Central Navigator / Router Entry Point
 */
export default function App() {
  const [currentPath, setCurrentPath] = useState("/");
  const [mood, setMood] = useState("");
  const [tracks, setTracks] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const { currentTheme } = useTheme();

  // Handle browser URL hash or path changes for lightweight routing
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.hash.replace("#", "") || "/";
      setCurrentPath(path);
    };

    window.addEventListener("hashchange", handleLocationChange);
    handleLocationChange();

    return () => window.removeEventListener("hashchange", handleLocationChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  // Find active route or fallback to default route
  const activeRoute = ROUTES.find((r) => r.path === currentPath) || ROUTES.find((r) => r.isDefault);
  const ActiveComponent = activeRoute ? activeRoute.component : ROUTES[0].component;

  return (
    <div className="min-h-screen relative">
      {/* Central Navigation Bar / Router Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-auto flex justify-center">
        <nav className={`${currentTheme.glass} px-6 py-2 rounded-full shadow-lg flex items-center gap-6 backdrop-blur-md border border-white/20`}>
          <div className="flex items-center gap-2 pr-4 border-r border-white/20">
            <span className="text-xl">🎧</span>
            <span className={`font-bold ${currentTheme.text} text-sm sm:text-base`}>Mood-DJ</span>
          </div>

          {/* Dynamic Route Navigation Links */}
          <div className="flex items-center gap-2">
            {ROUTES.map((route) => (
              <button
                key={route.path}
                onClick={() => navigate(route.path)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  currentPath === route.path
                    ? `${currentTheme.button} text-white shadow-md`
                    : `${currentTheme.text} opacity-70 hover:opacity-100 hover:bg-white/10`
                }`}
                title={route.description}
              >
                {route.name}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Render Active Route Page Component */}
      <main className="pt-16">
        <ActiveComponent
          mood={mood}
          setMood={setMood}
          tracks={tracks}
          setTracks={setTracks}
          showResults={showResults}
          setShowResults={setShowResults}
          onNavigate={navigate}
          onBack={() => navigate("/")}
        />
      </main>
    </div>
  );
}