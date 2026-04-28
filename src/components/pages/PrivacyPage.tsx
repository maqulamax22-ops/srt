import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-12"
      >
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Privacy Policy</h1>
          <p className="text-slate-500 font-light italic">Last updated: April 22, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
            <p>
              Welcome to Commentify. We value your privacy and are committed to protecting your personal data. 
              This policy explains how we handle information when you use our creator tools.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">2. Data Collection</h2>
            <p>
              Commentify is designed to be a "privacy-first" tool. We do not store the custom comments, usernames, 
              or profile pictures you upload for sticker generation on our servers. Processing happens on your device 
              or through transient API calls that do not persist your creative content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">3. Cookies and Analytics</h2>
            <p>
              We use minimal cookies for site functionality and basic analytics to understand how users interact 
              with our platform. This data is anonymized and used only to improve our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">4. Third-Party Services</h2>
            <p>
              Our application integrates with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Firebase:</strong> For basic site configuration and CMS functionality.</li>
              <li><strong>PayPal:</strong> For processing donations (we never see or store your payment card details).</li>
              <li><strong>Unsplash:</strong> To provide high-quality placeholder images.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our Contact page.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
