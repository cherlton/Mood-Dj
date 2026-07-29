import HomePage from "../pages/HomePage";
import PlaylistPage from "../pages/PlaylistPage";

/**
 * Application Routes Configuration Registry
 */
export const ROUTES = [
  {
    path: "/",
    name: "Home",
    description: "AI Mood DJ Generator & Playlist Discovery",
    component: HomePage,
    isDefault: true,
  },
  {
    path: "/playlist",
    name: "Playlist View",
    description: "Curated Spotify Player & Playlist Controls",
    component: PlaylistPage,
    isDefault: false,
  },
];

export default ROUTES;
