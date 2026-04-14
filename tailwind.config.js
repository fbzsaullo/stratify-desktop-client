/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === STRATIFY DESIGN SYSTEM — COLORS ===
        bg: {
          primary: '#0B0F14',
          secondary: '#0F1419',
        },
        surface: {
          DEFAULT: '#121821',
          raised: '#1A2233',
          overlay: '#1E2A3A',
        },
        border: {
          subtle: '#1E2A3A',
          DEFAULT: '#243044',
          strong: '#2E3D55',
        },
        primary: {
          DEFAULT: '#4F8CFF',
          hover: '#6B9FFF',
          active: '#3A73E8',
          muted: 'rgba(79,140,255,0.15)',
        },
        success: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
          muted: 'rgba(34,197,94,0.15)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          muted: 'rgba(245,158,11,0.15)',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          muted: 'rgba(239,68,68,0.15)',
        },
        text: {
          primary: '#E5E7EB',
          secondary: '#9CA3AF',
          tertiary: '#6B7280',
          disabled: '#4B5563',
        },
        // Severity colors
        severity: {
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#4F8CFF',
          success: '#22C55E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'title-xl': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'title-lg': ['22px', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '700' }],
        'title': ['18px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'subtitle': ['14px', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption-xs': ['11px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.04em' }],
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
        'badge': '6px',
        'pill': '100px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,140,255,0.2)',
        'glow-primary': '0 0 20px rgba(79,140,255,0.25)',
        'glow-success': '0 0 20px rgba(34,197,94,0.25)',
        'glow-danger': '0 0 20px rgba(239,68,68,0.25)',
        'glow-warning': '0 0 20px rgba(245,158,11,0.25)',
        'inner': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 0.4s ease-out',
        'ping-slow': 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(4px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-surface': 'linear-gradient(135deg, #121821 0%, #0F1419 100%)',
        'gradient-primary': 'linear-gradient(135deg, #4F8CFF 0%, #7B5EA7 100%)',
        'gradient-danger': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        'gradient-success': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
