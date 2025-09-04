import React from 'react';
import { Message } from '../types';

// Function to detect and make URLs clickable
function makeLinksClickable(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-200 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

// Function to detect if text contains image URLs
function extractImageUrls(text: string): string[] {
  const imageUrlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s]*)?/gi;
  return text.match(imageUrlRegex) || [];
}

// Function to check if a URL is an image
function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
}

// Function to extract all URLs from text
function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/gi;
  return text.match(urlRegex) || [];
}

interface MessageBubbleProps {
  message: Message;
  isLatest: boolean;
}

// Function to preserve line breaks and convert them to JSX
function preserveLineBreaks(text: string): React.ReactNode[] {
  return text.split('\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {makeLinksClickable(line)}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  // Extract image URLs from the message
  const urls = extractUrls(message.text);
  const imageUrls = urls.filter(isImageUrl);
  
  // Remove image URLs from text to avoid duplication
  let textWithoutImages = message.text;
  imageUrls.forEach(url => {
    textWithoutImages = textWithoutImages.replace(url, '').trim();
  });

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 md:mb-4 px-2 md:px-0 ${
        isLatest ? (isUser ? 'animate-slide-in-right' : 'animate-slide-in-left') : ''
      }`}
    >
      <div
        className={`max-w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover-lift ${
          isUser
            ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white'
            : 'bg-gradient-to-br from-slate-800 to-slate-700 text-white border border-slate-600'
        }`}
      >
        {textWithoutImages && (
          <p className="text-sm md:text-base leading-relaxed mb-2 whitespace-pre-wrap">
            {preserveLineBreaks(textWithoutImages)}
          </p>
        )}
        
        {imageUrls.length > 0 && (
          <div className="space-y-2 animate-scale-in">
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt="Shared image"
                  className="w-full max-w-full h-auto rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                  onClick={() => window.open(imageUrl, '_blank')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    // Show the URL as text if image fails to load
                    const fallback = document.createElement('p');
                    fallback.textContent = imageUrl;
                    fallback.className = 'text-xs text-gray-300 bg-gray-700 p-2 rounded break-all';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
            ))}
          </div>
        )}
        
        <p
          className={`text-xs mt-1 md:mt-2 opacity-75 ${
            isUser ? 'text-purple-100' : 'text-slate-300'
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}