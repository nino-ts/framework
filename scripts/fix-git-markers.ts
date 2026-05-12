#!/usr/bin/env bun
/* scripts/fix-git-markers.ts
 * Scans repository for git conflict markers and emits a markers-report.json and patch preview.
 * Usage: bun run scripts/fix-git-markers.ts -- --dry-run (default) | --apply
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const REPAIRS_DIR = path.join(ROOT, '.memories', 'repairs');
function walk(dir:string, files:string[] = []){
  for(const name of fs.readdirSync(dir, {withFileTypes:true})){
    const p = path.join(dir, name.name);
    if(name.isDirectory()){
      if(p.includes(path.join(ROOT,'.git')) || p.includes(path.join(ROOT,'node_modules')) || p.includes(REPAIRS_DIR)) continue;
      walk(p, files);
    } else if(name.isFile()){
      files.push(p);
    }
  }
  return files;
}

function scanFile(file:string){
  const text = fs.readFileSync(file,'utf8');
  const lines = text.split(/\r?\n/);
  const occurrences:any[] = [];
  for(let i=0;i<lines.length;i++){
    if(/^<{7,}/.test(lines[i])){
      let start = i;
      let j=i+1; while(j<lines.length && !/^={7,}/.test(lines[j])) j++;
      let sep = j<lines.length?j:null;
      j = j+1; while(j<lines.length && !/^>{7,}/.test(lines[j])) j++;
      let end = j<lines.length?j:null;
      occurrences.push({startLine:start+1, sepLine:sep?sep+1:null, endLine:end?end+1:null, snippet: lines.slice(Math.max(0,start-3), Math.min(lines.length,end?end+3: start+10)).join('\n')});
      i = end?end: i;
    }
  }
  return occurrences;
}

function ensureRepairs(){
  if(!fs.existsSync(REPAIRS_DIR)) fs.mkdirSync(REPAIRS_DIR, {recursive:true});
}

(async function main(){
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const dry = !apply;
  ensureRepairs();
  const files = walk(ROOT);
  const hits:any = {};
  for(const f of files){
    if(f.includes('.git') || f.includes('.memories')) continue;
    try{
      const occ = scanFile(f);
      if(occ.length) hits[f] = occ;
    }catch(e){/* ignore binary files */}
  }
  const reportPath = path.join(REPAIRS_DIR,'markers-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({generatedAt:new Date().toISOString(), root:ROOT, totalFiles:Object.keys(hits).length, files:hits}, null, 2));
  const previewPath = path.join(REPAIRS_DIR,'patch-preview.txt');
  let preview = '';
  for(const [f, occ] of Object.entries(hits)){
    preview += `FILE: ${f}\n`;
    for(const o of occ as any[]){
      preview += `--- occurrence lines ${o.startLine}-${o.endLine || o.startLine}\n`;
      preview += o.snippet + '\n\n';
      preview += 'Suggested: MANUAL REVIEW (ambiguous).\n\n';
    }
    preview += '\n\n';
  }
  fs.writeFileSync(previewPath, preview);
  console.log(`Markers scan complete. Files with markers: ${Object.keys(hits).length}`);
  console.log(`Report: ${reportPath}`);
  console.log(`Preview: ${previewPath}`);
  if(apply){
    console.log('Apply mode not implemented in scaffolding - this run only generates reports.');
  }
})();
