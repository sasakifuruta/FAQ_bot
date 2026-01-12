// import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

// export default function Home() {
//   return <Welcome />;
// }


import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


// メッセージタイプ
type Message = {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    suggestions?: string[];
};

export default function FAQChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            content: 'こんにちは！よくある質問についてお答えします。何かお困りのことはありますか？',
            timestamp: new Date(),
            suggestions: ['勤怠について', 'VPNについて', '交通費補助について']
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    
    // メッセージを自動スクロール
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function askAPI(question: string) {
        const res = await fetch(`${API_BASE_URL}/api/ask`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            question,
            top_k: 5,
            }),
        });
        
        if (!res.ok) {
            throw new Error('API error');
        }
        
        return res.json();
    }


    // FAQ検索関数
    const searchFAQ = (query: string): { answer: string; suggestions: string[] } | null => {
        const lowerQuery = query.toLowerCase();

        for (const faq of FAQ_DATABASE) {
            if (faq.keywords.some(keyword => lowerQuery.includes(keyword))) {
                // 関連する他の質問を提案
                const otherFAQs = FAQ_DATABASE
                    .filter(f => f.id !== faq.id)
                    .slice(0, 3)
                    .map(f => f.question);

                return {
                    answer: faq.answer,
                    suggestions: otherFAQs
                };
            }
        }

        return null;
    };

    // メッセージ送信処理
    const handleSend = async (text?: string) => {
        const messageText = text || inputValue.trim();
        if (!messageText) return;
      
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: messageText,
          timestamp: new Date(),
        };
      
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);
      
        try {
          const result = await askAPI(messageText);
      
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: result.answer ?? '回答を取得できませんでした。',
            timestamp: new Date(),
          };
      
          setMessages(prev => [...prev, botMessage]);
        } catch (e) {
        console.log("デバック". e);
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              type: 'bot',
              content: 'サーバーエラーが発生しました。',
              timestamp: new Date(),
            },
          ]);
        } finally {
          setIsTyping(false);
        }
      };
      

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300;400;600;700;900&family=Noto+Sans+JP:wght@300;400;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Noto Sans JP', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .chatbot-container {
          width: 100%;
          max-width: 1300px;
          height: 700px;
          background: #ffffff;
          border-radius: 32px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .chatbot-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 28px 24px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .chatbot-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .chatbot-header::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          border-radius: 50%;
        }

        .header-content {
          position: relative;
          z-index: 1;
        }

        .bot-avatar {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .header-title {
          font-family: 'Darker Grotesque', sans-serif;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .header-subtitle {
          font-size: 13px;
          opacity: 0.9;
          font-weight: 300;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          background: #f8f9fc;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }

        .message {
          display: flex;
          gap: 12px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .bot .message-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .user .message-avatar {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .message-content {
          max-width: 75%;
        }

        .message-bubble {
          padding: 14px 18px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.6;
          position: relative;
        }

        .bot .message-bubble {
          background: white;
          color: #1f2937;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .user .message-bubble {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 2px 12px rgba(102, 126, 234, 0.4);
        }

        .message-time {
          font-size: 11px;
          margin-top: 6px;
          opacity: 0.5;
        }

        .bot .message-time {
          text-align: left;
        }

        .user .message-time {
          text-align: right;
        }

        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .suggestion-chip {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Noto Sans JP', sans-serif;
        }

        .suggestion-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 14px 18px;
          background: white;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          width: fit-content;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #667eea;
          animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .input-container {
          padding: 20px 24px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .input-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
          background: #f3f4f6;
          border-radius: 24px;
          padding: 6px 6px 6px 20px;
          transition: all 0.3s ease;
        }

        .input-wrapper:focus-within {
          background: #e5e7eb;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .message-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          font-family: 'Noto Sans JP', sans-serif;
          color: #1f2937;
          outline: none;
          padding: 8px 0;
        }

        .message-input::placeholder {
          color: #9ca3af;
        }

        .send-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

            {/* ヘッダー */}
            <div className="chatbot-header">
                <div className="header-content">
                    <div className="bot-avatar">🤖</div>
                    <div className="header-title">FAQサポート</div>
                    <div className="header-subtitle">よくある質問にお答えします</div>
                </div>
            </div>

            {/* メッセージエリア */}
            <div className="messages-container">
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={message.id}
                            className={`message ${message.type}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <div className="message-avatar">
                                {message.type === 'bot' ? '🤖' : '👤'}
                            </div>
                            <div className="message-content">
                                <div className="message-bubble">
                                    {message.content}
                                </div>
                                <div className="message-time">
                                    {message.timestamp.toLocaleTimeString('ja-JP', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                {message.suggestions && (
                                    <div className="suggestions">
                                        {message.suggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                className="suggestion-chip"
                                                onClick={() => handleSend(suggestion)}
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        className="message bot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="message-avatar">🤖</div>
                        <div className="typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 入力エリア */}
            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        className="message-input"
                        placeholder="メッセージを入力..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="send-button"
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim()}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}
