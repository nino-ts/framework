#!/usr/bin/env bun
/* scripts/check-conflict-markers.ts
 * Quick local scanner for conflict markers. Returns non-zero if any markers found.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
function walk(dir:string, files:string[] = []){
  for(const name of fs.readdirSync(dir, {withFileTypes:true})){
    const p = path.join(dir, name.name);
    if(name.isDirectory()){
      if(p.includes(path.join(ROOT,'.git')) || p.includes('node_modules') || p.includes('.memories')) continue;
      walk(p, files);
    } else if(name.isFile()){
      files.push(p);
    }
  }
  return files;
}

function hasMarkers(text:string){
  return /^(<{7,}|={7,}|>{7,})/m.test(text);
}

let found=false;
for(const f of walk(ROOT)){
  try{
    const t = fs.readFileSync(f,'utf8');
    if(hasMarkers(t)){
      console.error('Markers in', f);
      found = true;
    }
  }catch(e){/* ignore binary */}
}
if(found){
  process.exit(2);
} else {
  console.log('No markers found.');
}
