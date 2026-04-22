/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './components/LandingPage';
import InstagramGenerator from './components/InstagramGenerator';
import TikTokGenerator from './components/TikTokGenerator';
import TextBoxGenerator from './components/TextBoxGenerator';
import AITools from './components/AITools';
import DonatePage from './components/DonatePage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 scroll-smooth">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/instagram" element={<InstagramGenerator />} />
            <Route path="/tiktok" element={<TikTokGenerator />} />
            <Route path="/text-box" element={<TextBoxGenerator />} />
            <Route path="/tools" element={<AITools />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

