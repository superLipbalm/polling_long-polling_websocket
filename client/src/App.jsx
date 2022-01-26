import { useState } from 'react';
import ChatInput from './components/ChatInput';
import LongPollingChat from './components/LongPollingChat';
import PollingChat from './components/PollingChat';
import WebSocketChat from './components/WebSocketChat';

const COM_MODE = ['Polling', 'LongPolling', 'WebSocket'];
const CHAT_COMPONENTS = [<PollingChat />, <LongPollingChat />, <WebSocketChat />];

function App() {
  const [mode, setMode] = useState(0);
  const changeMode = () => setMode((mode) => ++mode % 3);

  return (
    <div className="width(300px)">
      <p>mode: {COM_MODE[mode]}</p>
      <button onClick={changeMode}>change mode</button>
      {CHAT_COMPONENTS[mode]}
      <ChatInput />
    </div>
  );
}

export default App;
