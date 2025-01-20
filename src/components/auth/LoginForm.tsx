'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import fikraLogo from 'assets/images/fikra-Logo.png';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const t = useTranslations('auth');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-yellow-500/20">
        <div className="flex flex-col items-center">
          <Image
            src={fikraLogo}
            alt="Fikra Farida"
            width={180}
            height={60}
            className="mb-6"
            priority
          />
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('login.welcome')}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-black/40 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent"
                placeholder={t('login.emailPlaceholder')}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-black/40 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent"
                placeholder={t('login.passwordPlaceholder')}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded bg-black/40"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                {t('login.rememberMe')}
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-yellow-500 hover:text-yellow-400"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {t('login.submit')}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-white">{t('login.noAccount')} </span>
            <Link
              href="/register"
              className="font-medium text-yellow-500 hover:text-yellow-400"
            >
              {t('login.signUp')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
