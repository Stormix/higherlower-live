import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ws')({
  component: RouteComponent,
})

function RouteComponent() {
  const [messages, setMessages] = React.useState<string[]>([]);
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  
  React.useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/_ws");
    setSocket(ws);
    ws.onmessage = (event) => {
      console.log("Received message:", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  
    return () => {
      ws.close();
    };
  }, []);
  
  return (
    <div>
      <h1>Websocket messages</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
