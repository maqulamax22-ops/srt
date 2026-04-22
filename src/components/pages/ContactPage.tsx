import React, { useState } from 'react';
import { Mail, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 sm:px-10 py-16">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          <span className="text-insta-gradient">Get in Touch</span>
        </h1>
        <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">
          Have a feature request or found a bug? We'd love to hear from you.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-[40px] border border-slate-100 shadow-2xl">
        {isSent ? (
          <div className="py-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-500 rounded-full">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Message Sent!</h2>
              <p className="text-slate-500">
                Thank you for your feedback. We'll get back to you as soon as possible.
              </p>
            </div>
            <button 
              onClick={() => setIsSent(false)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input 
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dilovan Abdo"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <input 
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold text-slate-700 ml-1">Message</label>
              <textarea 
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What can we help you with?"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full group flex items-center justify-center gap-3 bg-slate-900 text-white rounded-2xl py-5 font-bold transition-all hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
