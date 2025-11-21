import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // LUXURY PACIFIC PALETTE
        'ocean': '#0F52BA',
        'teal': '#008080',
        'gold': '#D4AF37',
        'coral': '#FF6B6B',
        'sand': '#F9FAFB',
        'midnight': '#0B0F19',
        'charcoal': '#151B2B',

        // LEGACY (keep for compatibility)
        'primary-blue': 'var(--primary-blue)',
        'secondary-teal': 'var(--secondary-teal)',
        'accent-coral': 'var(--accent-coral)',
        'neutral-sand': 'var(--neutral-sand)',
        'text-dark': 'var(--text-dark)',
        'text-muted': 'var(--text-muted)',

        // SEMANTIC COLORS
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'error': 'var(--error)',
        'info': 'var(--info)',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      spacing: {
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0F52BA 0%, #0B0F19 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #AA8A2E 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
