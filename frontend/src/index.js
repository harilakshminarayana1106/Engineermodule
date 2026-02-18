import React from "react";
import ReactDOM from "react-dom/client";

/* 🔥 Main App */
import App from "./App";

/* 🎨 Global CSS */
import "./index.css";

/* 🅱️ Bootstrap */
import "bootstrap/dist/css/bootstrap.min.css";

/* 🗺️ Leaflet Map CSS */
import "leaflet/dist/leaflet.css";

/* 🧭 Leaflet Marker Fix (Very Important) */
import L from "leaflet";
import markerIcon2x from
  "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from
  "leaflet/dist/images/marker-icon.png";
import markerShadow from
  "leaflet/dist/images/marker-shadow.png";

/* Fix default marker issue */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});


/* 🚀 Render App */

const root =
  ReactDOM.createRoot(
    document.getElementById("root")
  );

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
