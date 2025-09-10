'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as React from 'react';

interface IMessage {
  role: 'assistant' | 'user';
  content?: string;
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState<string>('');
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom when new message arrives
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChatMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    // Clear input
    setMessage('');

    try {
      const res = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(message)}`);
      const data = await res.json();

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data?.content || 'Bhai, me nahi janta.',
        },
      ]);
    } catch (err) {
      console.error('Error fetching chat response:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Server error. Try again later.' },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] break-words whitespace-pre-wrap ${
              msg.role === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-gray-100 self-start text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="flex gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          className="flex-1"
        />
        <Button onClick={handleSendChatMessage} disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;
