// import logoDark from "./logo-dark.svg";
// import logoLight from "./logo-light.svg";

// export function Welcome() {
//   return (
//     <main className="flex items-center justify-center pt-16 pb-4">
//       <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
//         <header className="flex flex-col items-center gap-9">
//           <div className="w-[500px] max-w-[100vw] p-4">
//             <img
//               src={logoLight}
//               alt="React Router"
//               className="block w-full dark:hidden"
//             />
//             <img
//               src={logoDark}
//               alt="React Router"
//               className="hidden w-full dark:block"
//             />
//           </div>
//         </header>
//         <div className="max-w-[300px] w-full space-y-6 px-4">
//           <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
//             <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
//               What&apos;s next?
//             </p>
//             <ul>
//               {resources.map(({ href, text, icon }) => (
//                 <li key={href}>
//                   <a
//                     className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
//                     href={href}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     {icon}
//                     {text}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </main>
//   );
// }

// const resources = [
//   {
//     href: "https://reactrouter.com/docs",
//     text: "React Router Docs",
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="20"
//         viewBox="0 0 20 20"
//         fill="none"
//         className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
//       >
//         <path
//           d="M9.99981 10.0751V9.99992M17.4688 17.4688C15.889 19.0485 11.2645 16.9853 7.13958 12.8604C3.01467 8.73546 0.951405 4.11091 2.53116 2.53116C4.11091 0.951405 8.73546 3.01467 12.8604 7.13958C16.9853 11.2645 19.0485 15.889 17.4688 17.4688ZM2.53132 17.4688C0.951566 15.8891 3.01483 11.2645 7.13974 7.13963C11.2647 3.01471 15.8892 0.951453 17.469 2.53121C19.0487 4.11096 16.9854 8.73551 12.8605 12.8604C8.73562 16.9853 4.11107 19.0486 2.53132 17.4688Z"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//         />
//       </svg>
//     ),
//   },
//   {
//     href: "https://rmx.as/discord",
//     text: "Join Discord",
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="20"
//         viewBox="0 0 24 20"
//         fill="none"
//         className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
//       >
//         <path
//           d="M15.0686 1.25995L14.5477 1.17423L14.2913 1.63578C14.1754 1.84439 14.0545 2.08275 13.9422 2.31963C12.6461 2.16488 11.3406 2.16505 10.0445 2.32014C9.92822 2.08178 9.80478 1.84975 9.67412 1.62413L9.41449 1.17584L8.90333 1.25995C7.33547 1.51794 5.80717 1.99419 4.37748 2.66939L4.19 2.75793L4.07461 2.93019C1.23864 7.16437 0.46302 11.3053 0.838165 15.3924L0.868838 15.7266L1.13844 15.9264C2.81818 17.1714 4.68053 18.1233 6.68582 18.719L7.18892 18.8684L7.50166 18.4469C7.96179 17.8268 8.36504 17.1824 8.709 16.4944L8.71099 16.4904C10.8645 17.0471 13.128 17.0485 15.2821 16.4947C15.6261 17.1826 16.0293 17.8269 16.4892 18.4469L16.805 18.8725L17.3116 18.717C19.3056 18.105 21.1876 17.1751 22.8559 15.9238L23.1224 15.724L23.1528 15.3923C23.5873 10.6524 22.3579 6.53306 19.8947 2.90714L19.7759 2.73227L19.5833 2.64518C18.1437 1.99439 16.6386 1.51826 15.0686 1.25995ZM16.6074 10.7755L16.6074 10.7756C16.5934 11.6409 16.0212 12.1444 15.4783 12.1444C14.9297 12.1444 14.3493 11.6173 14.3493 10.7877C14.3493 9.94885 14.9378 9.41192 15.4783 9.41192C16.0471 9.41192 16.6209 9.93851 16.6074 10.7755ZM8.49373 12.1444C7.94513 12.1444 7.36471 11.6173 7.36471 10.7877C7.36471 9.94885 7.95323 9.41192 8.49373 9.41192C9.06038 9.41192 9.63892 9.93712 9.6417 10.7815C9.62517 11.6239 9.05462 12.1444 8.49373 12.1444Z"
//           strokeWidth="1.5"
//         />
//       </svg>
//     ),
//   },
// ];

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
        const res = await fetch(`${API_BASE_URL}/ask`, {
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
          max-width: 480px;
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