import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const httpServer = http.createServer(app);
const webSocketServer = new WebSocketServer({ server: httpServer });
app.set('port', process.env.PORT || 8000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const messageStore = {
  messages: [],
  pending: [],
  fulfill: () => {
    messageStore.pending.forEach((observer) => observer());
    messageStore.pending = [];
  },
};

webSocketServer.broadcast = function (msg) {
  this.clients.forEach((webSocketClient) => {
    if (webSocketClient.readyState === WebSocket.OPEN) {
      webSocketClient.send(JSON.stringify(msg));
    }
  });
};

// 메시지 등록 함수
const postMessage = ({ sender, contents }) => {
  const id = messageStore.messages.length + 1;
  messageStore.messages.push({ id, sender, contents });
  // 응답 대기를 위한 Promise들 이행
  messageStore.fulfill();
  // 메시지 브로드 캐스팅 - WebSocket
  webSocketServer.broadcast({ id, sender, contents });
};

// 메시지 등록 HTTP
app.post('/api/message', (req, res, next) => {
  postMessage(req.body);
  res.send();
});

// 메시지 조회 - Polling
app.get('/api/polling/:id', (req, res, next) => {
  const offset = req.params.id;
  return res.json({ messages: messageStore.messages.slice(offset) });
});

// 메시지 조회 - Long Polling
app.get('/api/long-polling/:id', async (req, res, next) => {
  const offset = req.params.id;

  if (offset >= messageStore.messages.length) {
    await new Promise((resolve) => {
      messageStore.pending.push(resolve);
    });
  }

  return res.json({ messages: messageStore.messages.slice(offset) });
});

webSocketServer.on('connection', (webSocket) => {
  // 메시지 등록 - WebSocket
  webSocket.on('message', (msg) => {
    postMessage(JSON.parse(msg));
  });
});

httpServer.listen(app.get('port'), () =>
  console.log('Express server has started on port', app.get('port'))
);
