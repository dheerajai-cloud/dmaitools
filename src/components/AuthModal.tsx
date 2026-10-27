/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Mail, 
  ArrowRight, 
  LogOut, 
  Globe, 
  Zap,
  Award
} from 'lucide-react';
import { UserProfile, GoogleAccount } from '../types';
import { DEMO_USERS, PLATFORM_CREATOR } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  theme,
}) => {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'google' | 'creator'>('google');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    setIsSigningIn(true);
    setTimeout(() => {
      const email = customEmail.trim();
      const name = customName.trim() || email.split('@')[0].replace(/[._]/g, ' ');
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        role: 'member',
        isGoogleConnected: true,
        connectedAt: new Date().toISOString(),
      };
      onLogin(newUser);
      setIsSigningIn(false);
      onClose();
    }, 400);
  };

  const handleSelectDemoUser = (user: UserProfile) => {
    onLogin(user);
    onClose();
  };

  const handleSimulatedGoogleOAuth = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `google-${Date.now()}`,
        name: 'Google Workspace User',
        email: 'workspace.user@gmail.com',
        role: 'member',
        isGoogleConnected: true,
        connectedAt: new Date().toISOString(),
      };
      onLogin(newUser);
      setIsSigningIn(false);
      onClose();
    }, 600);
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-750 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-start justify-between ${isDark ? 'border-slate-800 bg-slate-850/50' : 'border-slate-100 bg-slate-50/70'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {currentUser.isGoogleConnected ? 'User Account & Workspaces' : 'Sign in to RankAgent OS'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Multi-tenant SEO intelligence for marketers, teams & agencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className={`flex border-b text-xs font-semibold px-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={() => setActiveTab('google')}
            className={`py-3 border-b-2 mr-6 transition-colors ${
              activeTab === 'google'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Google Sign-In & Users
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`py-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'creator'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Platform Architect & Creator</span>
          </button>
        </div>

        {/* Tab Body */}
        {activeTab === 'google' ? (
          <div className="p-6 space-y-5">
            {/* Current Active Account Status */}
            {currentUser.isGoogleConnected && (
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-indigo-50/50 border-indigo-100'
              }`}>
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email}
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Active Google Session
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLogout();
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-1.5 transition-colors ${
                    isDark 
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-750 hover:text-white' 
                      : 'border-slate-200 text-slate-700 hover:bg-white hover:text-red-600'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}

            {/* Official One-Click Google Sign-In */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Sign in with any Gmail / Google Workspace account:
              </label>
              <button
                type="button"
                onClick={handleSimulatedGoogleOAuth}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-medium text-xs shadow-sm transition-all hover:shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isSigningIn ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
              </button>
            </div>

            {/* Manual Gmail / Email Entry */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Or enter custom credentials
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. John Doe / Rahul Kumar"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none transition-all ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Your Gmail / Workspace Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none transition-all ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/20 transition-colors"
              >
                <span>{isSigningIn ? 'Logging in...' : 'Sign In with This Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Workspace Selector */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Or Quick Switch to Sample User:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectDemoUser(user)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      currentUser.email === user.email
                        ? 'border-indigo-600 bg-indigo-500/10'
                        : isDark
                          ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate text-slate-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {user.email.split('@')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Platform Creator / Founder Tab */
          <div className="p-6 space-y-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-800' : 'bg-gradient-to-br from-indigo-50/60 to-blue-50/60 border-indigo-100'}`}>
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/25">
                  D
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {PLATFORM_CREATOR.name}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      Founder & Architect
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {PLATFORM_CREATOR.title}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {PLATFORM_CREATOR.bio}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-slate-800/60' : 'bg-slate-100/70'}`}>
                <span className="text-slate-500 dark:text-slate-400">Architecture</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Multi-tenant Autonomous SEO Agent & CMS Bridge</span>
              </div>
              <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-slate-800/60' : 'bg-slate-100/70'}`}>
                <span className="text-slate-500 dark:text-slate-400">Integrations</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">GSC &bull; GA4 &bull; WordPress &bull; Shopify &bull; Gemini 3.8</span>
              </div>
              <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-slate-800/60' : 'bg-slate-100/70'}`}>
                <span className="text-slate-500 dark:text-slate-400">Safeguards</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Atomic 1-Click Rollback & Staging</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveTab('google')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                &larr; Return to Sign-In / Account Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
