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
  const [selected, setSelected] = useState("");
  const [loc, setLoc] = useState(null);

  const baseURL = "http://localhost:5000";

  /* LOAD ENGINEERS */

  useEffect(() => {
    axios
      .get(`${baseURL}/engineers`)
      .then(res =>
        setEngineers(res.data || [])
      );
  }, []);

  /* TRACK LOCATION */

  const track = async name => {

    if (!name) return;

    const res = await axios.get(
      `${baseURL}/engineer-live/${name}`
    );

    setLoc(res.data);
  };

  return (
    <div>

      {/* DROPDOWN */}

      <select
        className="form-control mb-3"
        value={selected}
        onChange={e => {

          setSelected(e.target.value);
          track(e.target.value);

        }}
      >

        <option value="">
          Select Engineer
        </option>

        {engineers.map((e, i) => (
          <option key={i} value={e.name}>
            {e.name}
          </option>
        ))}

      </select>

      {/* MAP */}

      {loc && (

        <MapContainer
          center={[
            loc.latitude,
            loc.longitude
          ]}
          zoom={15}
          style={{ height: "400px" }}
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker
            position={[
              loc.latitude,
              loc.longitude
            ]}
          >
            <Popup>
              {loc.engineer}
              <br />
              Live Location
            </Popup>
          </Marker>

        </MapContainer>

      )}

    </div>
  );
}

export default LiveMap;
