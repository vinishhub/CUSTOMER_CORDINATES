import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./App.css";

export default function App() {
  const webcamRef = useRef(null);

  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const capture = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({
          lat,
          lng,
        });

        const screenshot = webcamRef.current.getScreenshot();

        if (!screenshot) {
          alert("Unable to capture image");
          return;
        }

        const img = new Image();
        img.src = screenshot;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0);

          // Background
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillRect(10, img.height - 140, 650, 120);

          // Text
          ctx.fillStyle = "#ffffff";
          ctx.font = "24px Arial";

          ctx.fillText(
            `Latitude : ${lat.toFixed(6)}`,
            20,
            img.height - 95
          );

          ctx.fillText(
            `Longitude : ${lng.toFixed(6)}`,
            20,
            img.height - 60
          );

          ctx.fillText(
            `Time : ${new Date().toLocaleString()}`,
            20,
            img.height - 25
          );

          setImage(canvas.toDataURL("image/png"));
        };
      },
      (error) => {
        alert(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <h2>Customer Live Photo Capture</h2>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        audio={false}
        width={600}
      />

      <br />
      <br />

      <button onClick={capture}>
        📷 Capture Photo
      </button>

      <br />
      <br />

      {coords && (
        <>
          <h4>Latitude : {coords.lat.toFixed(6)}</h4>
          <h4>Longitude : {coords.lng.toFixed(6)}</h4>

          <div
            style={{
              display: "inline-block",
              position: "relative",
              marginTop: "15px",
            }}
            onMouseEnter={() => setShowMap(true)}
            onMouseLeave={() => setShowMap(false)}
          >
            <button>
              📍 View Map
            </button>

            {showMap && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  left: "0",
                  width: "500px",
                  height: "350px",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                  zIndex: 999,
                }}
              >
                <iframe
                  title="Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    coords.lng - 0.01
                  },${coords.lat - 0.01},${
                    coords.lng + 0.01
                  },${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
                />
              </div>
            )}
          </div>
        </>
      )}

      <br />
      <br />

      {image && (
        <>
          <img
            src={image}
            alt="Captured"
            width="600"
            style={{
              border: "1px solid #ddd",
            }}
          />

          <br />
          <br />

          <a href={image} download="customer-photo.png">
            <button>
              ⬇ Download Image
            </button>
          </a>
        </>
      )}
    </div>
  );
}