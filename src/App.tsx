/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import LandingPage from './components/LandingPage';
import InstagramGenerator from './components/InstagramGenerator';
import TikTokGenerator from './components/TikTokGenerator';
import TextBoxGenerator from './components/TextBoxGenerator';
import QuestionGenerator from './components/QuestionGenerator';
import AITools from './components/AITools';
import DonatePage from './components/DonatePage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import PrivacyPage from './components/pages/PrivacyPage';
import TermsPage from './components/pages/TermsPage';
import BlogList from './components/community/BlogList';
import BlogDetail from './components/community/BlogDetail';
import BlogAdmin from './components/community/BlogAdmin';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './lib/AuthContext';
import { useAnalytics } from './lib/analytics';
import { useSiteConfig } from './hooks/useSiteConfig';
import AdminDashboard from './components/admin/AdminDashboard';
import Login from './components/auth/Login';
import ProtectedRoute from './lib/ProtectedRoute';
import DynamicPage from './components/DynamicPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  useAnalytics();
  const { config } = useSiteConfig();

  useEffect(() => {
    if (config.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = config.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [config.faviconUrl]);
  
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 scroll-smooth">
      <Toaster position="bottom-right" richColors theme="dark" />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login isSignUp />} />
          <Route path="/tools" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
          <Route path="/instagram" element={<ProtectedRoute><InstagramGenerator /></ProtectedRoute>} />
          <Route path="/instagram-question" element={<ProtectedRoute><QuestionGenerator /></ProtectedRoute>} />
          <Route path="/tiktok" element={<ProtectedRoute><TikTokGenerator /></ProtectedRoute>} />
          <Route path="/text-box" element={<ProtectedRoute><TextBoxGenerator /></ProtectedRoute>} />
          <Route path="/donate" element={<ProtectedRoute><DonatePage /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
          <Route path="/community/:id" element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
          
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          <Route path="/community/admin" element={<ProtectedRoute requireAdmin><BlogAdmin /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/:pageId" element={<DynamicPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

