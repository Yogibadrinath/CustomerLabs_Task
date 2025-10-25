import React from 'react';
import './App.css';
import SaveSegmant from './components/saveSegment/SaveSegment';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
    <SaveSegmant />
    <ToastContainer />
    </>
  );
}

export default App;
