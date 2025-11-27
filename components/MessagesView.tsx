import React, { useState } from 'react';
import { Message } from '../types';

interface MessagesViewProps {
  initialMessages: Message[];
}

const MessagesView: React.FC<MessagesViewProps> = ({ initialMessages }) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(initialMessages[0]);
  const [replyText, setReplyText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    // In a real app, this would send data to backend
    setReplyText('');
    alert('Message sent! (Simulation)');
  };

  return (
    <div className="h-full flex bg-white rounded-2xl overflow-hidden">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="font-bold text-lg text-gray-800">Messages</h2>
          <button className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {initialMessages.map(msg => (
            <div 
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-white ${selectedMessage?.id === msg.id ? 'bg-white border-l-4 border-l-emerald-500 shadow-sm' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                 <div className="flex items-center gap-2">
                    <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full" />
                    <span className={`font-bold text-sm ${msg.unread ? 'text-gray-900' : 'text-gray-600'}`}>{msg.sender}</span>
                 </div>
                 <span className="text-[10px] text-gray-400">{msg.time}</span>
              </div>
              <p className={`text-xs truncate ${msg.unread ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{msg.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedMessage ? (
            <>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <img src={selectedMessage.avatar} alt={selectedMessage.sender} className="w-10 h-10 rounded-full" />
                        <div>
                            <h3 className="font-bold text-gray-800">{selectedMessage.sender}</h3>
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2 text-gray-400">
                        <button className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 max-w-md text-sm text-gray-700">
                            {selectedMessage.content}
                            <div className="text-[10px] text-gray-400 mt-1 text-right">{selectedMessage.time}</div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-emerald-600 rounded-2xl rounded-tr-sm p-4 max-w-md text-sm text-white shadow-md shadow-emerald-200">
                           Sure, keep me updated on the ETA. Drive safely.
                           <div className="text-[10px] text-emerald-100 mt-1 text-right">10:32 AM</div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none text-sm transition-all"
                        />
                        <button type="submit" className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </form>
            </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p>Select a conversation to start messaging</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;