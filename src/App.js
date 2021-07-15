import React, {useState, useRef} from "react";
import logo from './logo.svg';
import './App.css';

import * as tf from "@tensorflow/tfjs";
import * as facemash from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isSmiled, changeSmileState] = useState(false);

  const runFacemash = async () => {
    const net = await facemash.load({
      inputResolution: {width: 640, height: 480}, scale: 0.8
    })

    setInterval(() => {
      detect(net, changeSmileState);
    }, 100);
  };

  const detect = async (net, smileFunction) => {
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces(video);
      //console.log(face);
      
      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx, smileFunction);
    }
  };

  runFacemash();

  return (
    <div className="App">
      <header style = {{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        textAlign: "center",
        zindex: 9,
        paddingTop: 10,
        color: "white",
        fontSize: 24
      }}>
        {isSmiled ? "Smiled" : "Always look on the bright side of life"}
      </header>
      <header className="App-header">
        <Webcam ref = {webcamRef} style = {{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480
        }}/>
        <canvas ref = {canvasRef} style = {{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480
        }}/>
      </header>
    </div>
  );
}

export default App;
