import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import webSnifferEsm from 'web-sniffer/dist/web-sniffer.esm';
import Hello from './components/hello'

function App() {
  useEffect(() => {
    let ws = new webSnifferEsm({
      url: '//localhost:3000'
    })
    
    ws.createDomWatcher({
      root: document.documentElement
    })
  }, [])

  return (
    <div className="App" data-expose="App show">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Hello/>
    </div>
  );
}

export default App;
