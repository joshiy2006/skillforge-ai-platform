import React, { useState } from 'react';
import { MessageSquare, Send, Globe } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  language: string;
}

const detectLanguage = (text: string): string => {
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';
  if (/[a-zA-Z].*[\u0900-\u097F]|[\u0900-\u097F].*[a-zA-Z]/.test(text)) return 'Hinglish';
  return 'English';
};

const generateResponse = (userMessage: string, language: string): string => {
  const lower = userMessage.toLowerCase();

  // Arrays
  if (lower.includes('array') || lower.includes('ऐरे') || lower.includes('அர்ரே')) {
    if (language === 'Hindi') {
      return 'Array ek data structure hai jo elements ko contiguous memory mein store karta hai. Indexing O(1) time mein hota hai.';
    } else if (language === 'Tamil') {
      return 'Array என்பது elements-ஐ contiguous memory-ல் store செய்யும் data structure. Indexing O(1) time-ல் நடக்கும்.';
    } else if (language === 'Hinglish') {
      return 'Array ek data structure hai jo elements ko sequential memory me store karta hai. Index se access karna O(1) time leta hai.';
    }
    return 'An array is a data structure that stores elements in contiguous memory locations. Accessing an element by index takes O(1) time.';
  }

  // Loops
  if (lower.includes('loop') || lower.includes('लूप') || lower.includes('for') || lower.includes('while')) {
    if (language === 'Hindi') {
      return 'Loops code ko repeatedly execute karte hain. For loop aur while loop dono O(n) complexity ke saath kaam karte hain jab n iterations hote hain.';
    } else if (language === 'Tamil') {
      return 'Loops code-ஐ repeatedly execute செய்யும். For loop மற்றும் while loop இரண்டும் O(n) complexity-உடன் n iterations-க்கு வேலை செய்யும்.';
    } else if (language === 'Hinglish') {
      return 'Loops code ko baar baar execute karte hain. For aur while loop dono O(n) time complexity ke saath kaam karte hain.';
    }
    return 'Loops execute code repeatedly. Both for and while loops have O(n) time complexity for n iterations.';
  }

  // Recursion
  if (lower.includes('recur') || lower.includes('रिकर्शन') || lower.includes('ரிகர்ஷன்')) {
    if (language === 'Hindi') {
      return 'Recursion mein function khud ko call karta hai. Base case zaroori hai infinite recursion rokne ke liye. Space complexity O(n) hoti hai call stack ke wajah se.';
    } else if (language === 'Tamil') {
      return 'Recursion-ல் function தன்னையே call செய்யும். Infinite recursion-ஐ தடுக்க base case அவசியம். Call stack-னால் space complexity O(n) ஆகும்.';
    } else if (language === 'Hinglish') {
      return 'Recursion me function khud ko call karta hai. Base case hona zaroori hai infinite recursion se bachne ke liye.';
    }
    return 'Recursion is when a function calls itself. A base case is essential to prevent infinite recursion. Space complexity is O(n) due to the call stack.';
  }

  // Time complexity
  if (lower.includes('time complex') || lower.includes('big o') || lower.includes('टाइम कॉम्प्लेक्सिटी')) {
    if (language === 'Hindi') {
      return 'Time complexity algorithm ki efficiency measure karta hai. O(1) = constant, O(n) = linear, O(log n) = logarithmic, O(n²) = quadratic.';
    } else if (language === 'Tamil') {
      return 'Time complexity algorithm-னின் efficiency-ஐ measure செய்யும். O(1) = constant, O(n) = linear, O(log n) = logarithmic, O(n²) = quadratic.';
    } else if (language === 'Hinglish') {
      return 'Time complexity algorithm ki efficiency batata hai. O(1) sabse fast, O(n) linear, O(n²) slow hota hai large input ke liye.';
    }
    return 'Time complexity measures algorithm efficiency. O(1) is constant, O(n) is linear, O(log n) is logarithmic, and O(n²) is quadratic.';
  }

  // Default response
  if (language === 'Hindi') {
    return 'Main aapki madad karne ke liye yahaan hoon! Arrays, loops, recursion, ya time complexity ke baare mein poochiye.';
  } else if (language === 'Tamil') {
    return 'நான் உங்களுக்கு உதவ இங்கே இருக்கிறேன்! Arrays, loops, recursion, அல்லது time complexity பற்றி கேளுங்கள்.';
  } else if (language === 'Hinglish') {
    return 'Main aapki help ke liye ready hoon! Arrays, loops, recursion ya kisi bhi coding concept ke baare me puchiye.';
  }
  return 'I\'m here to help! Ask me about arrays, loops, recursion, time complexity, or any coding concept.';
};

export const MultilingualBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you in English, Hindi, Tamil, or Hinglish. Ask me any programming doubt!',
      sender: 'bot',
      language: 'English',
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    const language = detectLanguage(input);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      language,
    };

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: generateResponse(input, language),
      sender: 'bot',
      language,
    };

    setMessages([...messages, userMessage, botResponse]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
          <MessageSquare className="size-10 text-green-400" />
          Multilingual Doubt Assistant
        </h1>
        <p className="text-gray-400 mb-8">
          Ask in English, Hindi, Tamil, or Hinglish – Context-aware replies
        </p>

        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500/30 border border-blue-500/50 text-white'
                      : 'bg-gray-700/30 border border-gray-600/50 text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.sender === 'bot' && (
                      <Globe className="size-3 text-green-400" />
                    )}
                    <span className="text-xs text-gray-400">{message.language}</span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-blue-500/20 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your doubt in any language..."
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all text-white flex items-center gap-2"
              >
                <Send className="size-5" />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Language Examples */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <h3 className="text-blue-400 font-semibold mb-3">Try asking in:</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>🇬🇧 English: "What is an array?"</p>
              <p>🇮🇳 Hindi: "Array क्या है?"</p>
              <p>🇮🇳 Hinglish: "Loop ka time complexity kya hai?"</p>
              <p>🇮🇳 Tamil: "Recursion என்றால் என்ன?"</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <h3 className="text-green-400 font-semibold mb-3">Topics I can help with:</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p>• Arrays & Data Structures</p>
              <p>• Loops & Iteration</p>
              <p>• Recursion</p>
              <p>• Time Complexity</p>
              <p>• Dynamic Programming</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
