// Standalone generator module for testing (no DOM)
function randomChoice(arr){ return arr[Math.floor(Math.random()*arr.length)] }

function expandPool(seeds, modifiers, target=500){
  const set = new Set()
  while(set.size < target){
    const a = seeds[Math.floor(Math.random()*seeds.length)]
    const b = modifiers[Math.floor(Math.random()*modifiers.length)]
    const c = modifiers[Math.floor(Math.random()*modifiers.length)]
    const candidate = `${a} ${b} ${Math.random()<0.25?c:''}`.replace(/\s+/g,' ').trim()
    set.add(candidate)
  }
  return Array.from(set)
}

// reuse curated pools similar to script.js (shortened for test)
const rolePools = {
  apps: {
    subj: expandPool(['Habit tracker','Photo organizer','Personal finance manager','AI chat companion'], ['app','service'], 200),
    mod: expandPool(['AI-powered','offline-first','realtime-sync','privacy-first'], ['with AI','for creators'], 200),
    aud: expandPool(['creators','parents','students','remote teams'], ['as users','as customers'], 200),
    plat: expandPool(['mobile (iOS/Android)','PWA','VSCode extension','Slack integration'], ['on mobile','as a PWA'], 200),
    act: expandPool(['auto-summarizes notes','generates weekly insights','automatically tags content','schedules and reminds tasks'], ['using ML','with background sync'], 300)
  },
  youtube: {
    subj: expandPool(['Build','Make','Prototype','Demo'], ['a quick project','a tutorial'], 200),
    mod: expandPool(['an AI tool','a tiny app','a dataset pipeline','a simulator'], ['from scratch','in a weekend'], 200),
    aud: expandPool(['for beginners','for creators','for students'], ['with examples'], 200),
    plat: expandPool(['using JavaScript','using Python','with web APIs'], ['with live edits'], 200),
    act: expandPool(['and explain step-by-step','and ship a demo','and open-source it'], ['and show metrics'], 200)
  },
  games: {
    subj: expandPool(['Casual puzzle','Arcade roguelite','Narrative indie'], ['game','prototype'], 200),
    mod: expandPool(['with procedural levels','with emergent AI','with local multiplayer'], ['lite','jam-ready'], 200),
    aud: expandPool(['mobile players','families','speedrunners'], ['on phones','on PC'], 200),
    plat: expandPool(['mobile (touch)','WebGL','PC'], ['export target'], 200),
    act: expandPool(['adapts difficulty','generates varied levels','learns player preferences'], ['and records replays'], 300)
  },
  tools: {
    subj: expandPool(['CLI helper','VSCode extension','GitHub Action','Formatter'], ['tool','plugin'], 200),
    mod: expandPool(['for developers','for designers','for writers'], ['fast','lightweight'], 200),
    aud: expandPool(['teams','open-source maintainers','solo devs'], ['in CI','in workflows'], 200),
    plat: expandPool(['VSCode','GitHub Actions','Node.js CLI'], ['integration'], 200),
    act: expandPool(['automates repetitive PR tasks','formats and normalizes code','analyzes performance hotspots'], ['with quick setup'], 300)
  },
  content: {
    subj: expandPool(['Newsletter series','Content repackager','Episode template'], ['for creators'], 200),
    mod: expandPool(['with prompts','with AI summaries','with templates'], ['daily','weekly'], 200),
    aud: expandPool(['YouTubers','bloggers','podcasters'], ['to reuse'], 200),
    plat: expandPool(['web editor','Notion template','YouTube workflow'], ['integration'], 200),
    act: expandPool(['auto-suggests topics','auto-generates outlines','schedules posts'], ['with analytics'], 300)
  }
}

function normalizeChosen(arr){
  const seen = new Set(); const out=[]
  for(let i=0;i<arr.length && out.length<5;i++){
    if(!arr[i]) continue
    const s = String(arr[i]).replace(/\s+/g,' ').trim()
    if(!s) continue
    if(seen.has(s.toLowerCase())) continue
    seen.add(s.toLowerCase()); out.push(s)
  }
  while(out.length<5) out.push('')
  return out
}

function makeSpecific(text, idx){ if(!text) return text; const t=text.toLowerCase();
  const map = [[/dataset pipeline/,'a reproducible dataset pipeline that ingests and validates data'],[/code transformer/,'a serverless code transformer that rewrites code with presets'],[/simulator/,'an interactive simulator with replay and metrics']]
  for(const [rx,repl] of map) if(rx.test(t)) return repl
  if(idx===0 && t.split(' ').length===1) return `a ${text}`
  return text
}

function ensureDeterminer(phrase){ if(!phrase) return phrase; const p=phrase.trim(); if(/^(a |an |the )/i.test(p)) return p; const first=p[0].toLowerCase(); if('aeiou'.includes(first)) return 'an '+p; return 'a '+p }

const techSuggestions = {
  apps: ['React PWA + Firebase','SvelteKit + Supabase','Flutter + Firebase'],
  youtube: ['OBS + Node tooling','Next.js + Vercel','FFmpeg pipelines + Node'],
  games: ['Unity (C#)','Godot (GDScript)','Phaser + HTML5'],
  tools: ['Node CLI + oclif','Go + Cobra CLI','VSCode Extension + TypeScript'],
  content: ['Notion + Templates','Ghost + SEO plugin','Static site with Eleventy']
}

const tagPools = { apps:['productivity','ai','mobile'], youtube:['tutorial','build-in-public'], games:['casual','indie'], tools:['devtools','cli'], content:['newsletter','templates'] }

function internalGenerator(mode, chosen, timeEstimate){
  if(mode==='apps'){
    const subj=ensureDeterminer(makeSpecific(chosen[0],0))
    const mod=makeSpecific(chosen[1],1)
    const aud=makeSpecific(chosen[2],2)
    const plat=makeSpecific(chosen[3],3)
    const act=makeSpecific(chosen[4],4)
    const prompt=`Build ${subj} ${mod} for ${aud} on ${plat}`.replace(/\s+/g,' ').trim()
    const sentence=`${prompt} that ${act}`.replace(/\s+/g,' ').trim()
    const tech=randomChoice(techSuggestions.apps); const tags=[randomChoice(tagPools.apps),randomChoice(tagPools.apps)]
    const next=['Define 3 core features','Pick a minimal stack','Prototype and test']
    return {prompt: sentence, text: sentence+` — Build it in ${timeEstimate}.`, next_actions: next, tech, tags}
  }
  if(mode==='youtube'){
    const title=`${chosen[0]} ${chosen[1]} — Quick build for ${chosen[2]}`
    const sentence=`${chosen[0]} ${chosen[1]} ${chosen[3]} ${chosen[2]} ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const tech=randomChoice(techSuggestions.youtube); const tags=[randomChoice(tagPools.youtube)]; const next=['Plan outline','Record demo','Edit and publish']
    return {prompt:title, text: `${title}\n${sentence}`, tech, tags, next_actions: next}
  }
  if(mode==='games'){
    const title=`Prototype: ${chosen[0]} ${chosen[1]} — ${chosen[2]}`
    const sentence=`Create a ${chosen[0]} ${chosen[1]} for ${chosen[2]} on ${chosen[3]} that ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const tech=randomChoice(techSuggestions.games); const tags=[randomChoice(tagPools.games)]; const next=['Sketch mechanics','Prototype level','Playtest']
    return {prompt:title, text: `${title}\n${sentence} — Build it in ${timeEstimate}.`, tech, tags, next_actions: next}
  }
  if(mode==='tools'){
    const title=`Tool: ${chosen[0]} ${chosen[1]} — ${chosen[2]}`
    const sentence=`Build ${chosen[0]} ${chosen[1]} for ${chosen[2]} as a ${chosen[3]} that ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const tech=randomChoice(techSuggestions.tools); const tags=[randomChoice(tagPools.tools)]; const next=['Define UX','Implement core command','Document and ship']
    return {prompt:title, text: `${title}\n${sentence} — Build it in ${timeEstimate}.`, tech, tags, next_actions: next}
  }
  if(mode==='content'){
    const title=`${chosen[0]} ${chosen[1]} — for ${chosen[2]}`
    const sentence=`${chosen[0]} ${chosen[1]} ${chosen[2]} ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const tech=randomChoice(techSuggestions.content); const tags=[randomChoice(tagPools.content)]; const next=['Outline episodes','Produce first draft','Publish']
    return {prompt:title, text: `${title}\n${sentence} — Deliver in ${timeEstimate}.`, tech, tags, next_actions: next}
  }
  return {text: 'No mode'}
}

module.exports = { rolePools, internalGenerator, normalizeChosen, makeSpecific, ensureDeterminer, randomChoice }
