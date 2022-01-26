import React from 'react';

function ChatInput() {
  const onSubmit = (e) => {
    e.preventDefault();
    const { sender, contents } = e.target;
    if (!sender.value || !contents.value) return;
    fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender: sender.value, contents: contents.value }),
    });
    contents.value = '';
  };

  return (
    <form onSubmit={onSubmit} className="vbox">
      <label>
        sender
        <input type="text" name="sender" id="sender" />
      </label>
      <label>
        contents
        <input type="text" name="contents" id="contents" />
      </label>
      <button>send</button>
    </form>
  );
}

export default ChatInput;
