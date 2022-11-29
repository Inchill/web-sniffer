import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { createDomWatcher } from 'web-sniffer/dist/web-sniffer.esm';
import Hello from './components/hello'

function App() {
  const reportCallback = (data) => {
    const body = JSON.stringify(data);
    const url = 'http://127.0.0.1:8080/analytics';

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true });
    }
  }

  useEffect(() => {
    createDomWatcher({
      visibility: true,
      event: true
    }, reportCallback)
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
