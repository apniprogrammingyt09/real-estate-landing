const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Header section / General
content = content.replace(/selection:bg-emerald-100 selection:text-emerald-900/g, 'selection:bg-gray-200 selection:text-gray-900');
content = content.replace(/text-emerald-500/g, 'text-gray-900 dark:text-white');
content = content.replace(/text-emerald-600/g, 'text-gray-900 dark:text-white');
content = content.replace(/text-emerald-400/g, 'text-gray-500');
content = content.replace(/text-emerald-100\/70/g, 'text-gray-400');
content = content.replace(/text-orange-500/g, 'text-gray-900 dark:text-white');
content = content.replace(/text-amber-500/g, 'text-gray-900 dark:text-white');

// Borders & Backgrounds & Shadows
content = content.replace(/border-emerald-[^\s"]+/g, 'border-gray-900 dark:border-white');
content = content.replace(/bg-emerald-[^\s"]+/g, 'bg-gray-100 dark:bg-gray-800');
content = content.replace(/hover:bg-emerald-[^\s"]+/g, 'hover:bg-gray-200 dark:hover:bg-gray-700');
content = content.replace(/hover:text-emerald-[^\s"]+/g, 'hover:text-gray-900 dark:hover:text-white');
content = content.replace(/shadow-emerald-[^\s"]+/g, 'shadow-gray-900/10');

content = content.replace(/bg-amber-[^\s"]+/g, 'bg-gray-100 dark:bg-gray-800');
content = content.replace(/shadow-amber-[^\s"]+/g, 'shadow-gray-900/10');

// Specific map pin colors
content = content.replace(/bg-\[#a3e635\]/g, 'bg-white text-gray-900');
content = content.replace(/border-t-\[#a3e635\]/g, 'border-t-white');
content = content.replace(/bg-\[#ef4444\]/g, 'bg-gray-900');
content = content.replace(/rgba\(163,230,53,0\.3\)/g, 'rgba(0,0,0,0.1)');

// Luxury CTA section
content = content.replace(/bg-gradient-to-br from-\[#0E4B3E\] via-\[#093229\] to-\[#041713\]/g, 'bg-[#18181b]');
content = content.replace(/border-\[#bc9d6a\]\/[0-9]+/g, 'border-white/10');
content = content.replace(/text-\[#bc9d6a\]/g, 'text-white');
content = content.replace(/bg-\[#bc9d6a\]/g, 'bg-white');
content = content.replace(/hover:bg-\[#a88856\]/g, 'hover:bg-gray-200 text-[#09090b]');
content = content.replace(/hover:text-\[#0E4B3E\]/g, 'hover:text-[#09090b]');

fs.writeFileSync(file, content);
console.log("Colors fixed!");
