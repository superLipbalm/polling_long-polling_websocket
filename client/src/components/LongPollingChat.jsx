import { useEffect, useState } from 'react';

function LongPollingChat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const longPolling = async () => {
      const res = await fetch(`api/long-polling/${messages.at(-1)?.id ?? 0}`);
      if (!res.ok) return setTimeout(longPolling, 1000);
      const data = await res.json();
      if (data.messages.length === 0) return;
      setMessages((messages) => [...messages, ...data.messages]);
    };
    longPolling();
  }, [messages]);

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

export default LongPollingChat;
