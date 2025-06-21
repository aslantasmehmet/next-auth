"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Error Boundary - Single Responsibility: Sadece hata yakalama
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // Hata yakalandığında state'i güncelle
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  // Hata bilgilerini logla
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary yakaladı:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback varsa onu göster
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default hata sayfası
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Bir hata oluştu</h1>
                <p className="text-gray-600 mb-6">Beklenmeyen bir sorun yaşandı. Lütfen sayfayı yenileyin.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                  Sayfayı Yenile
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 