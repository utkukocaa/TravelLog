import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "./app.css";
import { listLogEntries } from "./API";
import RoomIcon from "@material-ui/icons/Room";
import LogEntryForm from "./LogEntryForm";

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setshowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 36.7577,
    longitude: -95.66,
    zoom: 3,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      width="100vw"
      height="100vh"
      {...viewport}
      mapStyle="mapbox://styles/utkukoca/cks84tn1e1noj17qumtopwlmy"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker
            offsetLeft={-4.6 * viewport.zoom}
            offsetTop={-8.4 * viewport.zoom}
            longitude={entry.longitude}
            latitude={entry.latitude}
            onClick={() => setshowPopup({ [entry._id]: true })}
          >
            <RoomIcon
              className="roomIcon"
              style={{
                width: `calc(1vmin*${viewport.zoom})`,
                height: `calc(1vmin*${viewport.zoom})`,
              }}
            />
          </Marker>
          {showPopup[entry._id] ? (
            <Popup
              longitude={entry.longitude}
              latitude={entry.latitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setshowPopup({})}
              anchor="top"
            >
              <div className="popup">
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
                {entry.image && <img src={entry.image} alt={entry.title} />}
                <small>
                  Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                </small>
              </div>
            </Popup>
          ) : null}
        </React.Fragment>
      ))}
      {addEntryLocation ? (
        <>
          <Marker
            longitude={addEntryLocation.longitude}
            latitude={addEntryLocation.latitude}
            offsetLeft={-4.6 * viewport.zoom}
            offsetTop={-8.4 * viewport.zoom}
          >
            <RoomIcon
              className="roomIcon"
              style={{
                color: "blue",
                width: `calc(1vmin*${viewport.zoom})`,
                height: `calc(1vmin*${viewport.zoom})`,
              }}
            />
          </Marker>
          <Popup
            longitude={addEntryLocation.longitude}
            latitude={addEntryLocation.latitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
            anchor="top"
          >
            <div className="popup">
              <LogEntryForm
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
                location={addEntryLocation}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </ReactMapGL>
  );
};

export default App;
