
// versi "react-qr-reader" 1.0.0. component API harus disesuaikan dengan yg baru

import { useState } from "react";
import QrReader from "react-qr-reader";

const QRCodeReader = () => {
  const [selected, setSelected] = useState("environment");
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState("");

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log(`loaded data data`, scanData);
    if (scanData && scanData !== "") {
      console.log(`loaded >>>`, scanData);
      setData(scanData);
      setStartScan(false);
      setLoadingScan(false);
      // setPrecScan(scanData);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>
        Last Scan:
        {selected}
      </h2>

      <button
        onClick={() => {
          setStartScan(!startScan);
        }}
      >
        {startScan ? "Stop Scan" : "Start Scan"}
      </button>
      {startScan && (
        <>
          <select onChange={(e) => setSelected(e.target.value)}>
            <option value={"environment"}>Back Camera</option>
            <option value={"user"}>Front Camera</option>
          </select>
          <QrReader
            facingMode={selected}
            delay={1000}
            onError={handleError}
            onScan={handleScan}
            // chooseDeviceId={()=>selected}
            style={{ width: "300px" }}
          />
        </>
      )}
      {loadingScan && <p>Loading</p>}
      {data !== "" && <p>{data}</p>}
    </div>
  );
};

export default QRCodeReader;

// // versi "react-qr-reader" 1.0.0. component API harus disesuaikan dengan yg baru

// import { useState } from "react";
// import { QrReader } from "react-qr-reader";

// const QRCodeReader = () => {
//   const [startScan, setStartScan] = useState(false);
//   const [loadingScan, setLoadingScan] = useState(false);
//   const [data, setData] = useState("");

//   const handleScan = async (scanData) => {
//     setLoadingScan(true);
//     console.log("loaded data data", scanData);
//     if (scanData && scanData !== "") {
//       console.log("loaded >>>", scanData);
//       setData(scanData);
//       setStartScan(false);
//       setLoadingScan(false);
//     }
//   };

//   const handleError = (err) => {
//     console.error(err);
//   };

//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>Last Scan: Back Camera</h2>

//       <button
//         onClick={() => {
//           setStartScan(!startScan);
//         }}
//       >
//         {startScan ? "Stop Scan" : "Start Scan"}
//       </button>

//       {startScan && (
//         <QrReader
//           facingMode="environment"
//           delay={1000}
//           onError={handleError}
//           onScan={handleScan}
//           style={{ width: "300px" }}
//         />
//       )}

//       {loadingScan && <p>Loading</p>}
//       {data !== "" && <p>{data}</p>}
//     </div>
//   );
// };

// export default QRCodeReader;



// // versi "react-qr-reader" 1.0.0. component API harus disesuaikan dengan yg baru


// import { useState } from "react";
// import {QrReader} from "react-qr-reader";

// const QRCodeReader = () => {
//   const [selected, setSelected] = useState("environment");
//   const [startScan, setStartScan] = useState(false);
//   const [loadingScan, setLoadingScan] = useState(false);
//   const [data, setData] = useState("");

//   const handleScan = async (scanData) => {
//     setLoadingScan(true);
//     console.log(`loaded data data`, scanData);
//     if (scanData && scanData !== "") {
//       console.log(`loaded >>>`, scanData);
//       setData(scanData);
//       setStartScan(false);
//       setLoadingScan(false);
//       // setPrecScan(scanData);
//     }
//   };
//   const handleError = (err) => {
//     console.error(err);
//   };
//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>
//         Last Scan:
//         {selected}
//       </h2>

//       <button
//         onClick={() => {
//           setStartScan(!startScan);
//         }}
//       >
//         {startScan ? "Stop Scan" : "Start Scan"}
//       </button>
//       {startScan && (
//         <>
//           <select onChange={(e) => setSelected(e.target.value)}>
//             <option value={"environment"}>Back Camera</option>
//             <option value={"user"}>Front Camera</option>
//           </select>
//           <QrReader
//             facingMode={selected}
//             delay={1000}
//             onError={handleError}
//             onScan={handleScan}
//             // chooseDeviceId={()=>selected}
//             style={{ width: "300px" }}
//           />
//         </>
//       )}
//       {loadingScan && <p>Loading</p>}
//       {data !== "" && <p>{data}</p>}
//     </div>
//   );
// };

// export default QRCodeReader;



// import React, { useState, useEffect, useRef } from "react";
// import jsQR from "jsqr";

// const QRCodeReader = () => {
//   const [scannedData, setScannedData] = useState({});
//   const videoRef = useRef(null);

//   const handleScan = (data) => {
//     if (data) {
//       const { text } = data;
//       try {
//         const jsonData = JSON.parse(text);
//         setScannedData(jsonData);
//       } catch (error) {
//         console.error("Invalid JSON data:", error);
//       }
//     }
//   };

//   const handleNewScan = () => {
//     setScannedData({});
//   };

//   useEffect(() => {
//     const startVideoStream = async () => {
//       try {
//         const constraints = { video: { facingMode: "environment" } };
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//         }
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//       }
//     };

//     startVideoStream();

//     return () => {
//       // Clean up the video stream when component unmounts
//       if (videoRef.current) {
//         const stream = videoRef.current.srcObject;
//         if (stream) {
//           const tracks = stream.getTracks();
//           tracks.forEach((track) => track.stop());
//         }
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <div>
//         <video
//           ref={videoRef}
//           style={{ width: "100%" }}
//           onPlay={() => {
//             const canvas = window.qrcodeCaptureCanvas;
//             const context = canvas.getContext("2d");

//             const captureFrame = () => {
//               context.drawImage(
//                 videoRef.current,
//                 0,
//                 0,
//                 canvas.width,
//                 canvas.height
//               );
//               const imageData = context.getImageData(
//                 0,
//                 0,
//                 canvas.width,
//                 canvas.height
//               );
//               const code = jsQR(
//                 imageData.data,
//                 imageData.width,
//                 imageData.height,
//                 {
//                   inversionAttempts: "dontInvert",
//                 }
//               );

//               if (code) {
//                 handleScan({ text: code.data });
//               }

//               requestAnimationFrame(captureFrame);
//             };

//             captureFrame();
//           }}
//         />
//         <canvas
//           id="qrcode-canvas"
//           style={{ display: "none" }}
//           ref={(canvas) => (window.qrcodeCaptureCanvas = canvas)}
//         />
//       </div>
//       <div>
//         <h2>Scanned Data:</h2>
//         {Object.keys(scannedData).length !== 0 ? (
//           <>
//             <p>Name: {scannedData.name}</p>
//             <p>Age: {scannedData.age}</p>
//             <p>UserId: {scannedData.userId}</p>
//           </>
//         ) : (
//           <p>No QR code scanned yet.</p>
//         )}
//       </div>
//       <div>
//         <button onClick={handleNewScan}>Scan Another QR Code</button>
//       </div>
//     </div>
//   );
// };

// export default QRCodeReader;
// import React, { useState, useRef, useEffect } from "react";
// import {QrReader} from "react-qr-reader";


// const QRCodeReader = () => {
//   const [scannedData, setScannedData] = useState({});
//   const qrReaderRef = useRef(null);

//   const handleScan = (data) => {
//     if (data) {
//       try {
//         const jsonData = JSON.parse(data);
//         setScannedData(jsonData);
//       } catch (error) {
//         console.error("Invalid JSON data:", error);
//       }
//     }
//   };

//   const handleError = (error) => {
//     console.error("Error accessing camera:", error);
//   };

//   const openImageDialog = () => {
//     qrReaderRef.current.openImageDialog();
//   };

//   useEffect(() => {
//     if (qrReaderRef.current) {
//       qrReaderRef.current.openImageDialog = openImageDialog;
//     }
//   }, []);

//   return (
//     <div>
//       <QrReader
//         delay={300}
//         onError={handleError}
//         onScan={handleScan}
//         style={{ width: "100%" }}
//         facingMode={"environment"} // Set the back camera as default
//         legacyMode={true} // Use legacy mode to access the video stream on mobile devices
//         ref={qrReaderRef}
//       />

//       <div>
//         <h2>Scanned Data:</h2>
//         {Object.keys(scannedData).length !== 0 ? (
//           <>
//             <p>User ID: {scannedData.userId}</p>
//           </>
//         ) : (
//           <p>No QR code scanned yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };


// export default QRCodeReader;


//pen
// import { useEffect, useState } from "react";
// import { QrReader } from "react-qr-reader";
// import axios from "axios";

// const QrCodeReader = () => {
//   const [code, setCode] = useState(null);
//   const [showDialog, setDiaglog] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [precScan, setPrecScan] = useState("");
//   const [selected, setSelected] = useState("environment");
//   const [errorMessage, setErrorMessage] = useState(null);

//   useEffect(() => {
//     const handleCameraPermission = async () => {
//       try {
//         if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//           alert('Camera access is not supported in this browser.');
//           return;
//         }
  
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         // Do something with the camera stream if needed
//       } catch (error) {
//         alert('Camera permission denied');
//         // Handle error or show error message
//       }
//     };

//     handleCameraPermission()
//   }, [])

//   async function fetchData({ qr = "" }) {
//     try {
//       setProcessing(true);
//       const result = await axios.get(
//         `https://ucs-goma-backend.herokuapp.com/payement/scan?matricule=${qr}&forThisYear=1`
//       );
//       console.log("scanned code", qr);
//       const { message, payement } = result.data;
//       console.log(payement);
//       if (!message) {
//         setCode({
//           text: payement.matricule,
//           identite: `${payement.nom} ${payement.postnom} ${payement.prenom}`,
//           promotion: payement.auditoire,
//           annee: payement.annee,
//           frais: Number.parseFloat(payement.totalPayer),
//           total: Number.parseFloat(payement.totalAPayer),
//           recouvrement: "Premiere tranche",
//           maxEncours: 800
//         });
//         // setPrecScan(null);
//         setDiaglog(true);
//       } else {
//         setCode(null);
//         setPrecScan(null);
//         setErrorMessage(message);
//         setDiaglog(true);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const handleScan = async (scanData) => {
//     console.log(`loaded data data`, scanData);
//     if (scanData && scanData !== "" && !showDialog && !processing) {
//       console.log(`loaded >>>`, scanData);
//       // setPrecScan(scanData);
//       await fetchData({ qr: scanData });
//     }
//   };
//   const handleError = (err) => {
//     console.error(err);
//   };
//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>
//         Last Scan:{precScan}
//         {selected}
//       </h2>
//       <select onChange={(e) => setSelected(e.target.value)}>
//         <option value={"environment"}>Back Camera</option>
//         <option value={"user"}>Front Camera</option>
//       </select>
//       {showDialog && (
//         <div className="dialog">
//           <div className="dialog-content">
//             <div className="close">
//               <button
//                 onClick={() => {
//                   setCode(null);
//                   setErrorMessage(null);
//                   setDiaglog(false);
//                   setProcessing(false);
//                 }}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             {errorMessage && (
//               <div className="errorMessage">
//                 <h2>{errorMessage}</h2>
//               </div>
//             )}
//             {code && (
//               <div className="description">
//                 <h4 className="title">Scan Result</h4>
//                 <div className="detail detail-first-child">
//                   <h6 className="detail-header">Matricule :</h6>
//                   <h6 className="detail-content green">{code.text}</h6>
//                 </div>
//                 <div className="detail">
//                   <h6 className="detail-header">Identité :</h6>
//                   <h6 className="detail-content">{code.identite}</h6>
//                 </div>
//                 <div className="detail">
//                   <h6 className="detail-header">Pomotion :</h6>
//                   <h6 className="detail-content">{code.promotion}</h6>
//                 </div>
//                 <div className="detail">
//                   <h6 className="detail-header">Année Academique :</h6>
//                   <h6 className="detail-content">{code.annee}</h6>
//                 </div>
//                 <div className="detail">
//                   <h6 className="detail-header">Total payé :</h6>
//                   <h6 className="detail-content red">
//                     {code.frais} (USD,dollars americains)
//                   </h6>
//                 </div>
//                 <div className="detail">
//                   <h6 className="detail-header">Total prévu :</h6>
//                   <h6 className="detail-content red">
//                     {code.total} (USD,dollars americains)
//                   </h6>
//                 </div>
//                 <div className="detail">
//                   <h6 className="detail-header">Reste à payer :</h6>
//                   <h6 className="detail-content red">
//                     {code.total - code.frais} (USD,dollars americains)
//                   </h6>
//                 </div>
//                 <div className="detail">
//                   <h6 className="detail-header">Votre Situation :</h6>
//                   <h6
//                     className={
//                       code.total <= code.frais
//                         ? `detail-content green`
//                         : "detail-content red small"
//                     }
//                   >
//                     {code.total <= code.frais
//                       ? "Eligible"
//                       : "Vous etes en retard de payement"}
//                   </h6>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//       {/* {code && <h2>{code.text}</h2>} */}
//       {!showDialog && !processing && (
//         <QrReader
//           facingMode={selected}
//           delay={500}
//           onError={handleError}
//           onScan={handleScan}
//           // chooseDeviceId={()=>selected}
//           style={{ width: "200px", heigth: "100px" }}
//         />
//       )}
//     </div>
//   );
// };

// export default QrCodeReader;

//all
// import React, { useState, useEffect, useRef } from "react";
// import jsQR from "jsqr";

// const QRCodeReader = () => {
//   const [scannedData, setScannedData] = useState("");
//   const videoRef = useRef(null);

//   const handleScan = (data) => {
//     if (data) {
//       setScannedData(data);
//     }
//   };

//   const handleNewScan = () => {
//     setScannedData("");
//   };

//   useEffect(() => {
//     const startVideoStream = async () => {
//       try {
//         const constraints = { video: { facingMode: "environment" } };
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//         }
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//       }
//     };

//     startVideoStream();

//     return () => {
//       // Clean up the video stream when component unmounts
//       if (videoRef.current) {
//         const stream = videoRef.current.srcObject;
//         if (stream) {
//           const tracks = stream.getTracks();
//           tracks.forEach((track) => track.stop());
//         }
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <div>
//         <video
//           ref={videoRef}
//           style={{ width: "100%" }}
//           onPlay={() => {
//             const canvas = window.qrcodeCaptureCanvas;
//             const context = canvas.getContext("2d");

//             const captureFrame = () => {
//               context.drawImage(
//                 videoRef.current,
//                 0,
//                 0,
//                 canvas.width,
//                 canvas.height
//               );
//               const imageData = context.getImageData(
//                 0,
//                 0,
//                 canvas.width,
//                 canvas.height
//               );
//               const code = jsQR(
//                 imageData.data,
//                 imageData.width,
//                 imageData.height,
//                 {
//                   inversionAttempts: "dontInvert",
//                 }
//               );

//               if (code) {
//                 handleScan(code.data);
//               }

//               requestAnimationFrame(captureFrame);
//             };

//             captureFrame();
//           }}
//         />
//         <canvas
//           id="qrcode-canvas"
//           style={{ display: "none" }}
//           ref={(canvas) => (window.qrcodeCaptureCanvas = canvas)}
//         />
//       </div>
//       <div>
//         <h2>Scanned Data:</h2>
//         {scannedData ? (
//           <p>{scannedData}</p>
//         ) : (
//           <p>No QR code scanned yet.</p>
//         )}
//       </div>
//       <div>
//         <button onClick={handleNewScan}>Scan Another QR Code</button>
//       </div>
//     </div>
//   );
// };

// export default QRCodeReader;

//working
  // import React, { useState, useEffect, useRef } from "react";
  // import jsQR from "jsqr";

  // const QRCodeReader = () => {
  //   const [scannedData, setScannedData] = useState({});
  //   const videoRef = useRef(null);

  //   const handleScan = (data) => {
  //     if (data) {
  //       const { text } = data;
  //       try {
  //         const jsonData = JSON.parse(text);
  //         setScannedData(jsonData);
  //       } catch (error) {
  //         console.error("Invalid JSON data:", error);
  //       }
  //     }
  //   };

  //   const handleNewScan = () => {
  //     setScannedData({});
  //   };

  //   useEffect(() => {
  //     const startVideoStream = async () => {
  //       try {
  //         const constraints = { video: { facingMode: "environment" } };
  //         const stream = await navigator.mediaDevices.getUserMedia(constraints);
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //           videoRef.current.play();
  //         }
  //       } catch (error) {
  //         console.error("Error accessing camera:", error);
  //       }
  //     };

  //     startVideoStream();

  //     return () => {
  //       // Clean up the video stream when component unmounts
  //       if (videoRef.current) {
  //         const stream = videoRef.current.srcObject;
  //         if (stream) {
  //           const tracks = stream.getTracks();
  //           tracks.forEach((track) => track.stop());
  //         }
  //       }
  //     };
  //   }, []);

  //   return (
  //     <div>
  //       <div>
  //         <video
  //           ref={videoRef}
  //           style={{ width: "100%" }}
  //           onPlay={() => {
  //             const canvas = window.qrcodeCaptureCanvas;
  //             const context = canvas.getContext("2d");

  //             const captureFrame = () => {
  //               context.drawImage(
  //                 videoRef.current,
  //                 0,
  //                 0,
  //                 canvas.width,
  //                 canvas.height
  //               );
  //               const imageData = context.getImageData(
  //                 0,
  //                 0,
  //                 canvas.width,
  //                 canvas.height
  //               );
  //               const code = jsQR(
  //                 imageData.data,
  //                 imageData.width,
  //                 imageData.height,
  //                 {
  //                   inversionAttempts: "dontInvert",
  //                 }
  //               );

  //               if (code) {
  //                 handleScan({ text: code.data });
  //               }

  //               requestAnimationFrame(captureFrame);
  //             };

  //             captureFrame();
  //           }}
  //         />
  //         <canvas
  //           id="qrcode-canvas"
  //           style={{ display: "none" }}
  //           ref={(canvas) => (window.qrcodeCaptureCanvas = canvas)}
  //         />
  //       </div>
  //       <div>
  //         <h2>Scanned Data:</h2>
  //         {Object.keys(scannedData).length !== 0 ? (
  //           <>
  //             <p>Name: {scannedData.name}</p>
  //             <p>Age: {scannedData.age}</p>
  //           </>
  //         ) : (
  //           <p>No QR code scanned yet.</p>
  //         )}
  //       </div>
  //       <div>
  //         <button onClick={handleNewScan}>Scan Another QR Code</button>
  //       </div>
  //     </div>
  //   );
  // };

  // export default QRCodeReader;

// import React, { useState, useEffect, useRef } from "react";
// import jsQR from "jsqr";

// const QRCodeReader = () => {
//   const [scannedData, setScannedData] = useState({ firstName: "", lastName: "" });

//   const videoRef = useRef(null);

//   const handleScan = (data) => {
//     if (data) {
//       const { text } = data;
//       try {
//         const [firstName, lastName] = text.split(" ");
//         setScannedData({ firstName, lastName });
//       } catch (error) {
//         console.error("Invalid QR code data:", error);
//       }
//     }
//   };  
  

//   const handleNewScan = () => {
//     setScannedData({});
//   };

//   useEffect(() => {
//     const startVideoStream = async () => {
//       try {
//         const constraints = { video: { facingMode: "environment" } };
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//         }
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//       }
//     };

//     startVideoStream();

//     return () => {
//       // Clean up the video stream when component unmounts
//       if (videoRef.current) {
//         const stream = videoRef.current.srcObject;
//         if (stream) {
//           const tracks = stream.getTracks();
//           tracks.forEach((track) => track.stop());
//         }
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <div>
//         <video
//           ref={videoRef}
//           style={{ width: "100%" }}
//           onPlay={() => {
//             const canvas = window.qrcodeCaptureCanvas;
//             const context = canvas.getContext("2d");

//             const captureFrame = () => {
//               context.drawImage(
//                 videoRef.current,
//                 0,
//                 0,
//                 canvas.width,
//                 canvas.height
//               );
//               const imageData = context.getImageData(
//                 0,
//                 0,
//                 canvas.width,
//                 canvas.height
//               );
//               const code = jsQR(
//                 imageData.data,
//                 imageData.width,
//                 imageData.height,
//                 {
//                   inversionAttempts: "dontInvert",
//                 }
//               );

//               if (code) {
//                 handleScan({ text: code.data });
//               }

//               requestAnimationFrame(captureFrame);
//             };

//             captureFrame();
//           }}
//         />
//         <canvas
//           id="qrcode-canvas"
//           style={{ display: "none" }}
//           ref={(canvas) => (window.qrcodeCaptureCanvas = canvas)}
//         />
//       </div>
//       <div>
//         <h2>Scanned Data:</h2>
//         {scannedData.firstName && scannedData.lastName ? (
//         <>
//           <p>First Name: {scannedData.firstName}</p>
//           <p>Last Name: {scannedData.lastName}</p>
//         </>
//       ) : (
//         <p>No QR code scanned yet.</p>
//       )}
//       </div>
//       <div>
//         <button onClick={handleNewScan}>Scan Another QR Code</button>
//       </div>
//     </div>
//   );
// };

// export default QRCodeReader;


// import React, { useState, useEffect, useRef } from "react";
// import jsQR from "jsqr";

// const QRCodeReader = () => {
//   const [scannedData, setScannedData] = useState({});
//   const videoRef = useRef(null);

//   const handleScan = (data) => {
//     if (data) {
//       const { text } = data;
//       try {
//         const jsonData = JSON.parse(text);
//         setScannedData(jsonData);
//       } catch (error) {
//         console.error("Invalid JSON data:", error);
//       }
//     }
//   };

//   const handleNewScan = () => {
//     setScannedData({});
//   };

//   useEffect(() => {
//     const startVideoStream = async () => {
//       try {
//         const constraints = { video: { facingMode: "environment" } };
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//         }
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//       }
//     };

//     startVideoStream();

//     return () => {
//       // Clean up the video stream when component unmounts
//       if (videoRef.current) {
//         const stream = videoRef.current.srcObject;
//         if (stream) {
//           const tracks = stream.getTracks();
//           tracks.forEach((track) => track.stop());
//         }
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <div>
//         <video
//           ref={videoRef}
//           style={{ width: "100%" }}
//           onPlay={() => {
//             const canvas = window.qrcodeCaptureCanvas;
//             const context = canvas.getContext("2d");

//             const captureFrame = () => {
//               context.drawImage(
//                 videoRef.current,
//                 0,
//                 0,
//                 canvas.width,
//                 canvas.height
//               );
//               const imageData = context.getImageData(
//                 0,
//                 0,
//                 canvas.width,
//                 canvas.height
//               );
//               const code = jsQR(
//                 imageData.data,
//                 imageData.width,
//                 imageData.height,
//                 {
//                   inversionAttempts: "dontInvert",
//                 }
//               );

//               if (code) {
//                 handleScan({ text: code.data });
//               }

//               requestAnimationFrame(captureFrame);
//             };

//             captureFrame();
//           }}
//         />
//         <canvas
//           id="qrcode-canvas"
//           style={{ display: "none" }}
//           ref={(canvas) => (window.qrcodeCaptureCanvas = canvas)}
//         />
//       </div>
//       <div>
//         <h2>Scanned Data:</h2>
//         {Object.keys(scannedData).length !== 0 ? (
//           <>
//             <p>Name: {scannedData.name}</p>
//             <p>Age: {scannedData.age}</p>
//           </>
//         ) : (
//           <p>No QR code scanned yet.</p>
//         )}
//       </div>
//       <div>
//         <button onClick={handleNewScan}>Scan Another QR Code</button>
//       </div>
//     </div>
//   );
// };

// export default QRCodeReader;

