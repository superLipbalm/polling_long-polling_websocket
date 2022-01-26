import { useEffect, useState } from 'react';

function PollingChat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const poll = setInterval(async () => {
      const res = await fetch(`api/polling/${messages.at(-1)?.id ?? 0}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.messages.length === 0) return;
      setMessages((messages) => [...messages, ...data.messages]);
    }, 1000);
    return () => {
      clearInterval(poll);
    };
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

export default PollingChat;
