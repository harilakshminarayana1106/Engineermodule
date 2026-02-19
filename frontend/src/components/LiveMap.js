import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import { useEffect, useState } from "react";
import axios from "axios";

function LiveMap() {

  const [engineers, setEngineers] = useState([]);
  const [loc, setLoc] = useState(null);

  const baseURL = "http://localhost:5000";

  useEffect(() => {
    axios.get(`${baseURL}/engineers`)
      .then(res => setEngineers(res.data));
  }, []);

  const track = async name => {

    const res = await axios.get(
      `${baseURL}/engineer-live/${name}`
    );

    setLoc(res.data);
  };

  return (

    <div>

      <select
        className="form-control mb-3"
        onChange={e => track(e.target.value)}
      >
        <option>Select Engineer</option>

        {engineers.map(e => (
          <option key={e.name}>
            {e.name}
          </option>
        ))}
      </select>

      {loc && (

        <MapContainer
          center={[
            loc.latitude,
            loc.longitude
          ]}
          zoom={15}
          style={{
            height: "400px",
            width: "100%"
          }}
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[
            loc.latitude,
            loc.longitude
          ]}>
            <Popup>{loc.engineer}</Popup>
          </Marker>

        </MapContainer>

      )}

    </div>
  );
}

export default LiveMap;
