const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace py-XX
  content = content.replace(/\bpy-(16|20|24|32|40|48)\b/g, 'py-[60px]');
  // Replace md:py-XX
  content = content.replace(/\bmd:py-(16|20|24|32|40|48)\b/g, 'md:py-[60px]');
  // Replace lg:py-XX
  content = content.replace(/\blg:py-(16|20|24|32|40|48)\b/g, 'lg:py-[60px]');
  
  // Replace pt-XX
  content = content.replace(/\bpt-(16|20|24|32|40|48)\b/g, 'pt-[60px]');
  content = content.replace(/\bmd:pt-(16|20|24|32|40|48)\b/g, 'md:pt-[60px]');
  
  // Replace pb-XX
  content = content.replace(/\bpb-(16|20|24|32|40|48)\b/g, 'pb-[60px]');
  content = content.replace(/\bmd:pb-(16|20|24|32|40|48)\b/g, 'md:pb-[60px]');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated gaps in', file);
  }
});
