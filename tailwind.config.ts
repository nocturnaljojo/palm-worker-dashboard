import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY PALETTE (Pacific-inspired)
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
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      spacing: {
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
      },
    },
  },
  plugins: [],
};
export default config;
