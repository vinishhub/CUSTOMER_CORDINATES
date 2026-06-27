import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./App.css";

export default function App() {

  const webcamRef = useRef(null);

  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null);



const capture = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const screenshot = webcamRef.current.getScreenshot();

      const img = new Image();
      img.src = screenshot;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = "red";
        ctx.font = "28px Arial";

        ctx.fillText(
          `Lat : ${lat.toFixed(6)}`,
          20,
          img.height - 120
        );

        ctx.fillText(
          `Lng : ${lng.toFixed(6)}`,
          20,
          img.height - 80
        );

        ctx.fillText(
          new Date().toLocaleString(),
          20,
          img.height - 40
        );

        setImage(canvas.toDataURL("image/png"));
      };
    },
    (error) => {
      alert("Unable to fetch GPS location. " + error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

  return (

    <div className="App">

      <h2>Customer Live Photo Capture</h2>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        />

      <br/>

   

      <button onClick={capture}>
        Capture Photo
      </button>

      <br/><br/>

      {coords && (

        <>
          <h4>Latitude : {coords.lat}</h4>
          <h4>Longitude : {coords.lng}</h4>
        </>

      )}

      {image && (

        <>
          <img
            src={image}
            alt=""
            width="600"
          />

          <br/>

          <a
            href={image}
            download="customer-photo.png"
          >
            Download Image
          </a>

        </>

      )}

    </div>

  );

}