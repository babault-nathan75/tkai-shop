/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: {
    colors: { background:'#050505', surface:'#111111', surface2:'#1A1A1A', primary:'#D61F1F', accent:'#FF3B3B', foreground:'#F5F5F5', muted:'#A1A1AA' },
    boxShadow: { glow:'0 0 28px rgba(214,31,31,.45)' },
    backgroundImage: { 'red-sun':'radial-gradient(circle at 50% 20%, rgba(214,31,31,.35), transparent 38%)', 'grid':'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)' }
  } }, plugins: []
};
