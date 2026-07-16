const fs = require('fs');
const files = [
  'app/listings/page.tsx',
  'app/add-property/page.tsx',
  'app/agents/page.tsx',
  'app/about/page.tsx',
  'app/services/page.tsx',
  'app/contact/page.tsx',
  'app/faq/page.tsx',
  'app/privacy/page.tsx',
  'app/terms/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Typography
  content = content.replace(/font-serif/g, 'font-sans');

  // Colors - Backgrounds
  content = content.replace(/bg-emerald-50/g, 'bg-[#f4f4f5]');
  content = content.replace(/bg-emerald-100/g, 'bg-[#ececee]');
  content = content.replace(/bg-emerald-200\/50/g, 'bg-transparent');
  content = content.replace(/bg-emerald-500\/10/g, 'bg-[#ececee]');
  content = content.replace(/bg-emerald-[6-9]00/g, 'bg-[#09090b]');
  content = content.replace(/bg-emerald-500/g, 'bg-[#18181b]');
  content = content.replace(/bg-amber-[0-9]+\/?[0-9]*/g, 'bg-[#ececee]');
  content = content.replace(/bg-gray-50/g, 'bg-[#f4f4f5]');

  // Colors - Text
  content = content.replace(/text-emerald-500/g, 'text-[#09090b]');
  content = content.replace(/text-emerald-600/g, 'text-[#09090b]');
  content = content.replace(/text-emerald-400/g, 'text-[#52525b]');
  content = content.replace(/text-amber-[0-9]+/g, 'text-[#09090b]');

  // Colors - Borders
  content = content.replace(/border-emerald-[^\s"]+/g, 'border-[#ececee]');
  content = content.replace(/border-gray-100/g, 'border-[#ececee]');
  content = content.replace(/border-gray-200/g, 'border-[#ececee]');

  // Colors - Hover
  content = content.replace(/hover:bg-emerald-[^\s"]+/g, 'hover:bg-[#18181b]');
  content = content.replace(/hover:text-emerald-[^\s"]+/g, 'hover:text-[#09090b]');
  content = content.replace(/focus-visible:ring-emerald-[^\s"]+/g, 'focus-visible:ring-[#ececee]');
  content = content.replace(/group-focus-within:text-emerald-[^\s"]+/g, 'group-focus-within:text-[#09090b]');

  // Shadows
  content = content.replace(/shadow-2xl/g, 'border border-[#ececee] shadow-none');
  content = content.replace(/shadow-xl/g, 'border border-[#ececee] shadow-none');
  content = content.replace(/shadow-lg/g, 'border border-[#ececee] shadow-none');
  content = content.replace(/shadow-md/g, 'border border-[#ececee] shadow-none');
  content = content.replace(/shadow-sm/g, 'border border-[#ececee] shadow-none');
  
  // Specific fix for viewType error in app/listings/page.tsx
  if (file === 'app/listings/page.tsx') {
    content = content.replace(/<PropertyCard property=\{property\} viewType=\{viewType\} \/>/g, '<PropertyCard property={property} />');
  }

  // Radii
  content = content.replace(/rounded-2xl/g, 'rounded-[14px]');
  content = content.replace(/rounded-xl/g, 'rounded-[14px]');
  content = content.replace(/rounded-3xl/g, 'rounded-[36px]');
  content = content.replace(/rounded-\[4rem\]/g, 'rounded-[36px]');
  content = content.replace(/rounded-\[3rem\]/g, 'rounded-[36px]');
  content = content.replace(/rounded-\[2\.5rem\]/g, 'rounded-[36px]');
  
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
