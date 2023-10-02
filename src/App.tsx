import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ExampleProvider, useDogAge} from "./ExampleRXJS";

function App() {
  return (
  <ExampleProvider>
    <Render />
  </ExampleProvider>
  );
}

const Render = () => {
    const age = useDogAge();
    console.log('rendering age');
    return <>{age}</>;
}

export default App;
