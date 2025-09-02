import React from 'react';
import { Message } from '../types';

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
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${
        isLatest ? 'animate-slide-in' : ''
      }`}
    >
      <div
        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 shadow-md ${
          isUser
            ? 'bg-purple-600 text-white'
            : 'bg-slate-800 text-white border border-slate-700'
        }`}
      >
        {textWithoutImages && (
          <p className="text-sm leading-relaxed mb-2">{textWithoutImages}</p>
        )}
        
        {imageUrls.length > 0 && (
          <div className="space-y-2">
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={imageUrl}
                  alt="Shared image"
                  className="w-full max-w-full h-auto rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
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
          className={`text-xs mt-2 ${
            isUser ? 'text-purple-200' : 'text-slate-400'
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}