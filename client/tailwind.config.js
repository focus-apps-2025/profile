/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          navy: '#123B7A',
          blue: '#2563EB',
          deep: '#0B1F3A',
          lightBlue: '#DBEAFE',
          bg: '#FFFFFF',
          secBg: '#F5F8FC',
          text: '#172B4D',
          mutedText: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(11, 31, 58, 0.05), 0 1px 2px 0 rgba(11, 31, 58, 0.03)',
        'premium': '0 10px 25px -5px rgba(18, 59, 122, 0.08), 0 8px 10px -6px rgba(18, 59, 122, 0.04)',
        'card': '0 4px 6px -1px rgba(18, 59, 122, 0.05), 0 2px 4px -2px rgba(18, 59, 122, 0.05)',
        'elevated': '0 20px 25px -5px rgba(11, 31, 58, 0.1), 0 8px 10px -6px rgba(11, 31, 58, 0.08)',
      },
    },
  },
  plugins: [],
}
