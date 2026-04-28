import React from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-12"
      >
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-4">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Terms of Service</h1>
          <p className="text-slate-500 font-light italic">Last updated: April 22, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">1. Agreement to Terms</h2>
            <p>
              By accessing or using Commentify, you agree to be bound by these Terms of Service. 
              If you do not agree to all of these terms, do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">2. Description of Service</h2>
            <p>
              Commentify provides creative tools for social media content creators, including 
              comment sticker generators. The service is provided "as is" and we reserve the 
              right to modify or discontinue features at any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">3. User Responsibility</h2>
            <p>
              You are responsible for the content you create using our tools. You agree not to 
              generate content that is illegal, harmful, threatening, abusive, or otherwise 
              objectionable. You must ensure you have the rights to use any profile pictures or 
              content you input into the tools.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">4. Intellectual Property</h2>
            <p>
              The generators and the "Commentify" brand are property of Commentify Labs. 
              The stickers you generate are yours to use for your personal and commercial 
              social media content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              Commentify shall not be liable for any damages resulting from your use of the service. 
              We do not guarantee the stickers will meet all platform-specific aesthetic or technical 
              requirements indefinitely.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
