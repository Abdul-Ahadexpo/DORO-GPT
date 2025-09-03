import React, { useState } from 'react';
import { Brain, X, Send } from 'lucide-react';

interface TeachBotModalProps {
  isOpen: boolean;
  question: string;
  onClose: () => void;
  onTeach: (question: string, answer: string) => void;
}

export function TeachBotModal({ isOpen, question, onClose, onTeach }: TeachBotModalProps) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onTeach(question, answer.trim());
        setAnswer('');
        onClose();
      } catch (error) {
        console.error('Error teaching bot:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setAnswer('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-700 animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Brain size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-white">Teach SenTorial</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Question Asked:
            </label>
            <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
              <p className="text-white text-sm">{question}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Teach the correct answer:
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type the correct answer here...\n\nTip: Press Enter for line breaks - they will be preserved in the response!"
                className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-700 text-white placeholder-slate-400 resize-none"
                rows={6}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={!answer.trim() || isSubmitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Teaching...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Teach Bot</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg transition-all duration-200 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}