import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";

/* ICONS */

const redIcon = new L.Icon({
  iconUrl:
    "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32]
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32]
});

function NearbyMap({ engineer, customers }) {

  if (!engineer) return null;

  return (

    <MapContainer
      center={[
        engineer.latitude,
        engineer.longitude
      ]}
      zoom={13}
      style={{ height: "400px" }}
    >

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 🔴 ENGINEER */}

      <Marker
        position={[
          engineer.latitude,
          engineer.longitude
        ]}
        icon={redIcon}
      >
        <Popup>
          👨‍🔧 {engineer.name}
        </Popup>
      </Marker>

      {/* 🔵 CUSTOMERS */}

      {customers.map((c, i) => (

        <Marker
          key={i}
          position={[
            c.latitude,
            c.longitude
          ]}
          icon={blueIcon}
        >
          <Popup>
            🏢 {c.customer}
            <br />
            {c.product}
          </Popup>
        </Marker>

      ))}

    </MapContainer>

  );
}

export default NearbyMap;
