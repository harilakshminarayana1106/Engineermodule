import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

function NearbyMap({ engineerLocation, customers }) {

  if (!engineerLocation) return null;

  return (

    <MapContainer
      center={[
        engineerLocation.latitude,
        engineerLocation.longitude
      ]}
      zoom={13}
      style={{
        height: "400px",
        width: "100%"
      }}
    >

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[
        engineerLocation.latitude,
        engineerLocation.longitude
      ]}>
        <Popup>
          {engineerLocation.name}
        </Popup>
      </Marker>

      {customers.map((c,i)=>(
        <Marker key={i}
          position={[
            c.latitude,
            c.longitude
          ]}>
          <Popup>
            {c.customer}
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}

export default NearbyMap;
