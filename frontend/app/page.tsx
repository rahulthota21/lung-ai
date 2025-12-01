'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDark = theme === 'dark';
  const [demoView, setDemoView] = useState<'normal' | 'highlighted'>('normal');
  const [activeStep, setActiveStep] = useState(0);

  // Auto-rotate steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm ${
        isDark ? 'bg-black/80 border-neutral-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-neutral-900' : 'bg-gray-100'
            }`}>
              <svg className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Lung Health
            </span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={`px-6 py-2 rounded-lg font-medium transition-colors border ${
                isDark
                  ? 'border-neutral-700 text-white hover:bg-neutral-900'
                  : 'border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-white text-black hover:bg-neutral-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-8">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-neutral-900' : 'bg-gray-100'
              }`}>
                <svg className={`w-9 h-9 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>

            {/* Headline */}
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Lung CT Scan at Your Village Health Center
            </h1>

            {/* Subheadline */}
            <p className={`text-lg sm:text-xl mb-12 max-w-3xl mx-auto ${
              isDark ? 'text-neutral-300' : 'text-gray-700'
            }`}>
              Get fast, accurate lung health reports in all Indian languages - right in your neighborhood
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className={`w-full sm:w-auto px-8 py-4 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-white text-black hover:bg-neutral-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className={`w-full sm:w-auto px-8 py-4 rounded-lg font-medium transition-colors border ${
                  isDark
                    ? 'border-neutral-700 text-white hover:bg-neutral-900'
                    : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
              >
                Sign In
              </Link>
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full sm:w-auto px-8 py-4 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Learn How It Works
              </button>
            </div>
          </div>

          {/* Hero Visual - Simple Illustration */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className={`rounded-2xl p-8 border ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {/* Village Health Center */}
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                    isDark ? 'bg-neutral-800' : 'bg-white'
                  }`}>
                    <svg className={`w-10 h-10 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                    Village Health Center
                  </p>
                </div>

                {/* CT Scan */}
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                    isDark ? 'bg-neutral-800' : 'bg-white'
                  }`}>
                    <svg className={`w-10 h-10 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                    AI Analysis
                  </p>
                </div>

                {/* Report */}
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                    isDark ? 'bg-neutral-800' : 'bg-white'
                  }`}>
                    <svg className={`w-10 h-10 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                    Report Ready
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Interactive Timeline */}
      <section id="how-it-works" className={`py-20 border-t ${
        isDark ? 'border-neutral-800' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-20 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            How It Works
          </h2>

          <div className="max-w-6xl mx-auto">
            {/* Interactive Step Indicators */}
            <div className="flex items-center justify-between mb-12 relative">
              {/* Progress Line */}
              <div className={`absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 ${
                isDark ? 'bg-neutral-800' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-full transition-all duration-500 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                  }`}
                  style={{ width: `${(activeStep / 2) * 100}%` }}
                />
              </div>

              {/* Step Buttons */}
              {[0, 1, 2].map((step) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                    activeStep === step
                      ? isDark
                        ? 'bg-white text-black scale-110'
                        : 'bg-gray-900 text-white scale-110'
                      : step < activeStep
                        ? isDark
                          ? 'bg-neutral-700 text-white'
                          : 'bg-gray-300 text-gray-700'
                        : isDark
                          ? 'bg-neutral-800 text-neutral-500'
                          : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step + 1}
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div className={`rounded-2xl border p-12 min-h-[300px] transition-all ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50 border-gray-200'
            }`}>
              {activeStep === 0 && (
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Visit Your Local Health Center
                    </h3>
                    <p className={`text-lg mb-6 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                      No need to travel to the city. Our AI-powered system is available at village health centers near you.
                    </p>
                    <ul className={`space-y-3 ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                      <li className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Walk-in appointments available</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Quick 15-minute scan process</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Affordable pricing for everyone</span>
                      </li>
                    </ul>
                  </div>
                  <div className={`rounded-xl p-8 flex items-center justify-center ${
                    isDark ? 'bg-neutral-800' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-48 h-48 ${isDark ? 'text-neutral-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className={`rounded-xl p-8 flex items-center justify-center ${
                    isDark ? 'bg-neutral-800' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-48 h-48 ${isDark ? 'text-neutral-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      AI Analyzes Your Scan
                    </h3>
                    <p className={`text-lg mb-6 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                      Our advanced AI system examines your CT scan with precision, detecting potential issues that need attention.
                    </p>
                    <ul className={`space-y-3 ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                      <li className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Results ready in minutes</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>95% accuracy in detection</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Works offline - no internet needed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Get Your Report
                    </h3>
                    <p className={`text-lg mb-6 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                      Receive a detailed report in your preferred language, reviewed and explained by a qualified doctor.
                    </p>
                    <ul className={`space-y-3 ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                      <li className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Available in all Indian languages</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Doctor consultation included</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Digital copy accessible anytime</span>
                      </li>
                    </ul>
                  </div>
                  <div className={`rounded-xl p-8 flex items-center justify-center ${
                    isDark ? 'bg-neutral-800' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-48 h-48 ${isDark ? 'text-neutral-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2].map((step) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeStep === step
                      ? isDark
                        ? 'w-8 bg-white'
                        : 'w-8 bg-gray-900'
                      : isDark
                        ? 'bg-neutral-700'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Bento Grid */}
      <section className={`py-20 border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Why Choose AI Lung Health
          </h2>
          <p className={`text-center text-lg mb-16 max-w-2xl mx-auto ${
            isDark ? 'text-neutral-400' : 'text-gray-600'
          }`}>
            Advanced technology meets compassionate care
          </p>

          {/* Bento Grid Layout */}
          <div className="grid md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Large Featured Card */}
            <div className={`md:col-span-2 md:row-span-2 rounded-2xl border p-8 flex flex-col justify-between ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
            }`}>
              <div>
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  isDark ? 'bg-neutral-800' : 'bg-white shadow-sm'
                }`}>
                  <svg className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Available Locally
                </h3>
                <p className={`text-lg ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                  Access world-class lung health screening right in your village. No expensive travel, no long waits.
                </p>
              </div>
              <div className={`mt-6 pt-6 border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>50+</div>
                    <div className={`text-sm ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>Villages</div>
                  </div>
                  <div className={`w-px h-12 ${isDark ? 'bg-neutral-800' : 'bg-gray-200'}`}></div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>100+</div>
                    <div className={`text-sm ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>Centers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Cards */}
            <div className={`rounded-2xl border p-6 ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                isDark ? 'bg-neutral-800' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Fast Results
              </h3>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                Get your report in minutes, not weeks
              </p>
            </div>

            <div className={`rounded-2xl border p-6 ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                isDark ? 'bg-neutral-800' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Private & Safe
              </h3>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                Your data stays secure and confidential
              </p>
            </div>

            <div className={`rounded-2xl border p-6 ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                isDark ? 'bg-neutral-800' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Language
              </h3>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                Reports in all Indian languages
              </p>
            </div>

            <div className={`rounded-2xl border p-6 ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                isDark ? 'bg-neutral-800' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Doctor Verified
              </h3>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                Every report reviewed by experts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section - Card Carousel Style */}
      <section className={`py-20 border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Who Is This For?
          </h2>
          <p className={`text-center text-lg mb-16 max-w-2xl mx-auto ${
            isDark ? 'text-neutral-400' : 'text-gray-600'
          }`}>
            Designed for everyone in the healthcare ecosystem
          </p>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Patient Card - Premium Style */}
            <div className={`group rounded-2xl border overflow-hidden transition-all hover:scale-105 ${
              isDark ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl'
            }`}>
              <div className={`h-2 ${isDark ? 'bg-gradient-to-r from-neutral-700 to-neutral-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}></div>
              <div className="p-8">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  isDark ? 'bg-neutral-800' : 'bg-blue-50'
                }`}>
                  <svg className={`w-8 h-8 ${isDark ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  For Patients
                </h3>
                <p className={`mb-6 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                  Quick, affordable lung check-ups near your home. Early detection can save lives.
                </p>
                <ul className={`space-y-2 mb-8 text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Walk-in appointments
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Report in your language
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Doctor consultation included
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark
                      ? 'bg-white text-black hover:bg-neutral-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Operator Card */}
            <div className={`group rounded-2xl border overflow-hidden transition-all hover:scale-105 ${
              isDark ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl'
            }`}>
              <div className={`h-2 ${isDark ? 'bg-gradient-to-r from-neutral-700 to-neutral-600' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}></div>
              <div className="p-8">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  isDark ? 'bg-neutral-800' : 'bg-green-50'
                }`}>
                  <svg className={`w-8 h-8 ${isDark ? 'text-white' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  For Health Workers
                </h3>
                <p className={`mb-6 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                  Simple scan upload system. Help your community access better healthcare.
                </p>
                <ul className={`space-y-2 mb-8 text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Easy-to-use interface
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Works offline
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Track patient progress
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark
                      ? 'bg-white text-black hover:bg-neutral-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Doctor Card */}
            <div className={`group rounded-2xl border overflow-hidden transition-all hover:scale-105 ${
              isDark ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl'
            }`}>
              <div className={`h-2 ${isDark ? 'bg-gradient-to-r from-neutral-700 to-neutral-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}></div>
              <div className="p-8">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  isDark ? 'bg-neutral-800' : 'bg-purple-50'
                }`}>
                  <svg className={`w-8 h-8 ${isDark ? 'text-white' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  For Doctors
                </h3>
                <p className={`mb-6 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                  Review cases remotely. Provide expert care to rural communities.
                </p>
                <ul className={`space-y-2 mb-8 text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Review from anywhere
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AI-assisted diagnosis
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Flexible scheduling
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark
                      ? 'bg-white text-black hover:bg-neutral-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className={`py-20 border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            See What a Report Looks Like
          </h2>

          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'
          }`}>
            {/* Toggle */}
            <div className={`p-4 border-b flex justify-center gap-4 ${
              isDark ? 'border-neutral-800' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setDemoView('normal')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  demoView === 'normal'
                    ? isDark
                      ? 'bg-white text-black'
                      : 'bg-gray-900 text-white'
                    : isDark
                      ? 'text-neutral-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Normal View
              </button>
              <button
                onClick={() => setDemoView('highlighted')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  demoView === 'highlighted'
                    ? isDark
                      ? 'bg-white text-black'
                      : 'bg-gray-900 text-white'
                    : isDark
                      ? 'text-neutral-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Highlighted
              </button>
            </div>

            {/* Image Preview */}
            <div className={`p-8 ${isDark ? 'bg-neutral-950' : 'bg-gray-50'}`}>
              <div className={`aspect-video rounded-lg flex items-center justify-center ${
                isDark ? 'bg-neutral-900' : 'bg-white'
              }`}>
                {demoView === 'normal' ? (
                  <div className="text-center p-8">
                    <svg className={`w-24 h-24 mx-auto mb-4 ${isDark ? 'text-neutral-700' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className={`${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
                      Normal CT Scan View
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <svg className={`w-24 h-24 mx-auto mb-4 ${isDark ? 'text-neutral-700' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className={`${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
                      Highlighted Areas of Interest
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sample Report */}
            <div className={`p-6 border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sample Report Preview:
              </h3>
              <p className={`${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                No major issues found. Small spot detected - doctor will review and explain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className={`py-20 border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Why Trust Us?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Works Offline', desc: 'No internet needed at health center' },
              { title: 'Private & Safe', desc: 'Your data stays secure' },
              { title: 'Doctor Verified', desc: 'Real doctors review every case' },
              { title: 'Proven Accurate', desc: 'Tested by medical experts' }
            ].map((point, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDark ? 'bg-green-950' : 'bg-green-100'
                }`}>
                  <svg className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {point.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className={`py-20 border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Our Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: '500+', label: 'Patients Helped' },
              { number: '50+', label: 'Villages Covered' },
              { number: '95%', label: 'Accurate Results' }
            ].map((stat, idx) => (
              <div key={idx} className={`p-8 rounded-xl border text-center ${
                isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'
              }`}>
                <div className={`text-5xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.number}
                </div>
                <div className={`${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={`py-20 border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Get Started?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
            Join thousands of patients and healthcare workers using AI Lung Health
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className={`px-8 py-4 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-white text-black hover:bg-neutral-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className={`px-8 py-4 rounded-lg font-medium transition-colors border ${
                isDark
                  ? 'border-neutral-700 text-white hover:bg-neutral-900'
                  : 'border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Links */}
            <div className="flex flex-wrap gap-6">
              <a href="#" className={`text-sm hover:underline ${isDark ? 'text-neutral-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                About
              </a>
              <a href="#how-it-works" className={`text-sm hover:underline ${isDark ? 'text-neutral-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                How It Works
              </a>
              <a href="#" className={`text-sm hover:underline ${isDark ? 'text-neutral-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Contact
              </a>
              <a href="#" className={`text-sm hover:underline ${isDark ? 'text-neutral-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Privacy
              </a>
            </div>

            {/* Auth Links */}
            <div className="flex flex-wrap gap-6 md:justify-end">
              <Link href="/login" className={`text-sm hover:underline ${isDark ? 'text-neutral-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Sign In
              </Link>
              <Link href="/signup" className={`text-sm hover:underline ${isDark ? 'text-neutral-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Sign Up
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className={`text-center text-sm pt-8 border-t ${
            isDark ? 'border-neutral-800 text-neutral-400' : 'border-gray-200 text-gray-600'
          }`}>
            © {new Date().getFullYear()} AI Lung Health. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}