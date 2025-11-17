/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Todoist-inspired dark theme
        background: '#1f1f1f',
        'background-secondary': '#2a2a2a',
        primary: '#de4c4a',
        secondary: '#6b6b6b',
        border: '#4a4a4a',
        text: '#ffffff',
        'text-secondary': '#9d9d9d',
        'text-tertiary': '#6b6b6b',
        success: '#4eaf4a',
        warning: '#ffb300',
        overdue: '#de4c4a',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'xxl': '24px',
      },
      borderRadius: {
        'md': '8px',
        'lg': '12px',
        'full': '9999px',
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'md': '16px',
        'lg': '18px',
        'xl': '20px',
        'xxl': '28px',
      },
      fontWeight: {
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
}
