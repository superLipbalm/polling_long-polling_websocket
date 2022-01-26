import { useEffect, useState } from 'react';

const webSocket = new WebSocket('ws://localhost:8000');

function WebSocketChat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('/api/polling/0')
      .then((res) => res.json())
      .then(({ messages }) => setMessages([...messages]));
  }, []);

  useEffect(() => {
    const onMessage = ({ data }) => {
      setMessages((messages) => [...messages, JSON.parse(data)]);
    };
    webSocket.addEventListener('message', onMessage);

    return () => {
      webSocket.removeEventListener('message', onMessage);
    };
  }, []);

  return (
    <ul className="width(300px) height(300px) overflow(scroll)">
      {messages.map(({ id, sender, contents }) => (
        <li key={id}>
          {sender} : <span>{contents}</span>
        </li>
      ))}
    </ul>
  );
}

export default WebSocketChat;
