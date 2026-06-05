// Simple slot-machine idea generator
const modeApps = document.getElementById('mode-apps')
const modeYT = document.getElementById('mode-youtube')
const modeGames = document.getElementById('mode-games')
const modeTools = document.getElementById('mode-tools')
const modeContent = document.getElementById('mode-content')
const ideaEl = document.getElementById('paper')
const generateBtn = document.getElementById('generate')
const copyBtn = document.getElementById('copy')
const downloadBtn = document.getElementById('download')
const shareBtn = document.getElementById('share')
const timeEl = document.getElementById('time')
const ideaOutput = document.getElementById('idea')
const stackEl = document.getElementById('suggestedStack')
const tagsEl = document.getElementById('tags')
const nextEl = document.getElementById('nextActions')
let mode = 'apps'
const poolSize = 180
const rolePoolSize = 180
const actionPoolSize = 220

// Pools generator: produce many permutations without huge startup arrays
function expandPool(seeds, modifiers, target=200){
  const set = new Set()
  // seed combos
  while(set.size < target){
    const a = seeds[Math.floor(Math.random()*seeds.length)]
    const b = modifiers[Math.floor(Math.random()*modifiers.length)]
    const c = modifiers[Math.floor(Math.random()*modifiers.length)]
    const candidate = `${a} ${b} ${Math.random()<0.25?c:''}`.replace(/\s+/g,' ').trim()
    set.add(candidate)
  }
  return Array.from(set)
}

const appSeeds = ['Habit','Photo','Finance','Chat','Fitness','Recipe','Study','Reminder','Travel','Note','Map','Journal','Tracker','Alarm','Budget','Shop','Guide','Editor','Timer']
const appMods = ['AI','Pro','Lite','Plus','Sync','Hub','Flow','Now','Edge','Studio','Portal','Buddy','Mate','Gen','Auto','Smart','Cloud','Local']

const ytSeeds = ['Build','Make','Reverse-engineer','Hack','Prototype','Train','Optimize','Analyze','Deploy','Ship','Demo','Refactor','Automate','Scale']
const ytMods = ['an AI tool','a tiny app','a dataset pipeline','a code transformer','a bot','a simulator','an experiment','a challenge','a tutorial','a neat demo','a timed challenge']

const pools = {
  apps: [
    expandPool(appSeeds, appMods, poolSize),
    expandPool(appMods, ['with AI','offline-first','realtime','gamified','monetized','AR','ML','for kids','for creators','for teams'], poolSize),
    expandPool(['for students','for remote workers','for parents','for small businesses','for gamers','for photographers','for podcasters','for learners','for seniors','for devs'], appMods, poolSize),
    expandPool(['on mobile','as a PWA','as an extension','on desktop','on wearable','for smart TVs','for browsers','for Slack','for Discord','as an API'], appMods, poolSize),
    expandPool(['that auto-summarizes','that schedules tasks','that generates content','with leaderboards','that auto-tags photos','that creates themes','that reads voice notes','that automates payments','that creates templates'], appMods, poolSize)
  ],
  youtube:[
    expandPool(ytSeeds, ['in 24 hours','in a weekend','in 3 days','in one week','in 2 days','in an afternoon','in 48 hours','in a day','in two weeks','in an hour'], poolSize),
    expandPool(ytMods, ['with JS','with Python','with no frameworks','with web APIs','with prompts','with small datasets','mobile-first','serverless','open datasets','CI'], poolSize),
    expandPool(['fast','scrappy','iterative','minimal','production-ready','experimental','educational','challenge-style','tutorial','livestream'], ytMods, poolSize),
    expandPool(['and explain step-by-step','and ship a demo','and open-source','and iterate live','and document the process','and add tests','and make a series','and create challenges','and add AI features','and show metrics'], ytMods, poolSize),
    expandPool(['for beginners','for intermediate devs','for creators','for learners','for students','for YouTubers','for hackers','for researchers','for makers','for entrepreneurs'], ytMods, poolSize)
  ]
}

// Role-based pools for grammatically coherent sentences (curated for quality)
const rolePools = {
  apps: {
    subj: expandPool([
      'Habit tracker','Photo organizer','Personal finance manager','AI chat companion','Recipe planner','Study helper','Travel planner','Smart notes','Health tracker','Team scheduler','Content scheduler','Micro-journal','Budget assistant','Inventory manager','Onboarding coach'
    ], ['app','service','tool','platform'], rolePoolSize),
    mod: expandPool([
      'AI-powered','offline-first','realtime-sync','privacy-first','collaborative','gamified','monetizable','cross-platform','local-first','low-code friendly'
    ], ['with AI','for creators','for teams','for beginners'], rolePoolSize),
    aud: expandPool([
      'creators','parents','students','remote teams','small businesses','podcasters','photographers','teachers','freelancers','developers'
    ], ['as users','as customers','as power users','for families'], rolePoolSize),
    plat: expandPool([
      'mobile (iOS/Android)','PWA','VSCode extension','Slack integration','Discord bot','browser extension','desktop app','serverless API','headless CMS'
    ], ['on mobile','as a PWA','as an extension','with API'], rolePoolSize),
    act: expandPool([
      'auto-summarizes notes','generates weekly insights','automatically tags content','schedules and reminds tasks','creates reusable templates','suggests next actions','auto-captures receipts','syncs storefronts','recommends products','auto-curates playlists'
    ], ['using ML','with background sync','with privacy controls','on-device'], actionPoolSize)
  },

  youtube: {
    subj: expandPool([
      'Build','Make','Prototype','Demo','Reverse-engineer','Analyze','Ship','Refactor','Automate','Explore'
    ], ['a quick project','a timed build','a tutorial','a demo'], rolePoolSize),
    mod: expandPool([
      'an AI tool','a tiny app','a dataset pipeline','a code transformer','a simulator','a neat demo','a challenge-style build'
    ], ['from scratch','live-coding','in a weekend','in an afternoon'], rolePoolSize),
    aud: expandPool([
      'for beginners','for creators','for students','for makers','for indie devs','for hackers'
    ], ['with examples','with source code','with follow-up challenge'], rolePoolSize),
    plat: expandPool([
      'using JavaScript','using Python','with web APIs','with serverless','with Node tooling','with FFmpeg'
    ], ['with live edits','with code snippets'], rolePoolSize),
    act: expandPool([
      'and explain step-by-step','and ship a demo','and open-source it','and show metrics','and iterate live','and add tests'
    ], ['and include timestamps','and provide assets'], rolePoolSize)
  },

  games: {
    subj: expandPool([
      'Casual puzzle','Arcade roguelite','Narrative-driven indie','Turn-based strategy','Co-op survival','Asymmetric multiplayer','Physics-based arcade'
    ], ['game','prototype','jam entry'], rolePoolSize),
    mod: expandPool([
      'with procedural levels','with emergent AI','with local multiplayer','with asynchronous multiplayer','with simple controls','with physics-based interactions'
    ], ['lite','minimal','jam-ready'], rolePoolSize),
    aud: expandPool([
      'mobile players','families','speedrunners','puzzle lovers','casual players','party players'
    ], ['on phones','on PC','on consoles'], rolePoolSize),
    plat: expandPool([
      'mobile (touch)','WebGL','PC','console','cross-platform','HTML5'
    ], ['export target'], rolePoolSize),
    act: expandPool([
      'adapts difficulty to skill','generates varied levels','learns player preferences','rewards skillful play','shares leaderboards','auto-saves progress'
    ], ['and records replays','with social sharing'], actionPoolSize)
  },

  tools: {
    subj: expandPool([
      'CLI helper','VSCode extension','GitHub Action','Formatter','Commit-lint tool','PR automation','Local dev server','Data validator'
    ], ['tool','plugin','action'], rolePoolSize),
    mod: expandPool([
      'for developers','for designers','for writers','for data teams','for open-source','for maintainers'
    ], ['fast','lightweight','configurable'], rolePoolSize),
    aud: expandPool([
      'teams','open-source maintainers','solo devs','content teams','data engineers'
    ], ['in CI','in workflows'], rolePoolSize),
    plat: expandPool([
      'VSCode','GitHub Actions','Node.js CLI','Docker','Browser extension','CI pipeline'
    ], ['integration'], rolePoolSize),
    act: expandPool([
      'automates repetitive PR tasks','formats and normalizes code','analyzes performance hotspots','creates reproducible builds','validates schemas','simplifies releases'
    ], ['with quick setup','with sane defaults'], actionPoolSize)
  },

  content: {
    subj: expandPool([
      'Newsletter series','Content repackager','Episode template','Creator toolkit','Automated brief generator','Content calendar'
    ], ['for creators','for channels','for newsletters'], rolePoolSize),
    mod: expandPool([
      'with prompts','with AI summaries','with templates','with repurpose flows','with batch publishing'
    ], ['daily','weekly','monthly'], rolePoolSize),
    aud: expandPool([
      'YouTubers','bloggers','podcasters','marketers','creators'
    ], ['to reuse','to remix','to republish'], rolePoolSize),
    plat: expandPool([
      'web editor','Notion template','YouTube workflow','newsletter platform','RSS pipeline'
    ], ['integration'], rolePoolSize),
    act: expandPool([
      'auto-suggests topics','auto-generates outlines','schedules posts','creates thumbnails','batches repurposed clips','generates episode scripts'
    ], ['with analytics','with A/B ideas'], actionPoolSize)
  }
}

// Mode-specific tech stack suggestions and tags to make outputs more actionable
const techSuggestions = {
  apps: ['React PWA + Firebase','SvelteKit + Supabase','Flutter + Firebase','Next.js + Vercel + Prisma','Vanilla JS PWA + Local-first storage'],
  youtube: ['OBS + Node tooling','Next.js + Vercel for site','FFmpeg pipelines + Node','Deno scripts + Netlify','Python notebooks + Binder'],
  games: ['Unity (C#)','Godot (GDScript)','Phaser + HTML5','Unreal (C++)','Construct 3 (no-code)'],
  tools: ['Node CLI + oclif','Go + Cobra CLI','VSCode Extension + TypeScript','GitHub Action + JavaScript','Python CLI + Click'],
  content: ['Notion + Templates','Ghost + SEO plugin','Static site with Eleventy','YouTube series + Shorts repackaging','Newsletter via Substack']
}

const tagPools = {
  apps: ['productivity','ai','mobile','pwa','creator-tools','automation','education'],
  youtube: ['tutorial','build-in-public','ai','demo','timelapse','challenge'],
  games: ['casual','puzzle','multiplayer','indie','prototype','game-jam'],
  tools: ['devtools','cli','automation','opensource','productivity'],
  content: ['newsletter','series','templates','creator-tools','repurposing']
}

const timeOptions = ['1 day','2 days','3 days','1 week','2 weeks','1 month']

// UI elements for new features
const useSound = document.getElementById('useSound')
let soundEnabled = true
useSound.addEventListener('change', ()=> soundEnabled = useSound.checked)

const modeButtons = [modeApps, modeYT, modeGames, modeTools, modeContent]
function setMode(m){
  mode = m
  modeButtons.forEach(btn => btn.classList.toggle('active', btn.id === `mode-${m}`))
}

modeApps.onclick = ()=>setMode('apps')
modeYT.onclick = ()=>setMode('youtube')
modeGames.onclick = ()=>setMode('games')
modeTools.onclick = ()=>setMode('tools')
modeContent.onclick = ()=>setMode('content')

// speed radio
function getSpeed(){
  const r = document.querySelector('input[name="speed"]:checked')
  return r ? r.value : 'normal'
}

// sound helpers (WebAudio)
const audioCtx = new (window.AudioContext||window.webkitAudioContext)()
function playTick(){
  if(!soundEnabled) return
  const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
  o.type='sine'; o.frequency.value=800; g.gain.value=0.03;
  o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+0.06);
}
function playStop(){
  if(!soundEnabled) return
  const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
  o.type='square'; o.frequency.value=240; g.gain.value=0.04;
  o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+0.14);
}

function randomChoice(arr){return arr[Math.floor(Math.random()*arr.length)]}

// Normalize chosen words: trim, dedupe (preserve order), limit to 5
function normalizeChosen(arr){
  const seen = new Set()
  const out = []
  for(let i=0;i<arr.length && out.length<5;i++){
    if(!arr[i]) continue
    const s = String(arr[i]).replace(/\s+/g,' ').trim()
    if(!s) continue
    if(seen.has(s.toLowerCase())) continue
    seen.add(s.toLowerCase())
    out.push(s)
  }
  while(out.length<5) out.push('')
  return out
}

// Make some entries more specific/meaningful depending on their role index
function makeSpecific(text, idx){
  if(!text) return text
  const t = text.toLowerCase()
  const map = [
    [/tiny app/, 'a tiny mobile app with a focused feature set'],
    [/dataset pipeline/, 'a reproducible dataset pipeline that ingests and validates data'],
    [/code transformer/, 'a serverless code transformer that rewrites code with presets'],
    [/simulator/, 'an interactive simulator with replay and metrics'],
    [/shop sync hub|shop sync/, 'a Shop Sync Hub for creators to sync storefronts'],
    [/auto-summariz/, 'an automated summarization engine for content'],
    [/ai tool/, 'an AI-powered tool that automates a repetitive task']
  ]
  for(const [rx, repl] of map){ if(rx.test(t)) return repl }
  // slightly expand single-word nouns when used as subject
  if(idx===0 && t.split(' ').length===1) return `a ${text}`
  return text
}

// Ensure determiner 'a'/'an' where it improves grammar for subjects
function ensureDeterminer(phrase){
  if(!phrase) return phrase
  const p = phrase.trim()
  if(/^(a |an |the |our |my |your )/i.test(p)) return p
  const first = p[0].toLowerCase()
  if('aeiou'.includes(first)) return 'an '+p
  return 'a '+p
}

// on-page error display for devices without console access
function showError(msg){
  console.error(msg)
  const el = document.getElementById('errorLog')
  if(!el) return
  el.hidden = false
  el.textContent = String(msg)
  // re-enable generate if it was disabled
  try{ if(generateBtn) generateBtn.disabled = false }catch(e){}
}

window.addEventListener('error', (ev)=>{
  showError(ev.message + ' — ' + (ev.filename||'') + ':' + (ev.lineno||''))
})
window.addEventListener('unhandledrejection', (ev)=>{
  showError('Unhandled promise rejection: '+(ev.reason && ev.reason.message? ev.reason.message : String(ev.reason)))
})

function generate(){
  // start sound
  audioCtx.resume()
  playTick()
  generateBtn.disabled = true
  const prevText = generateBtn.textContent
  generateBtn.textContent = 'Generating…'
  ideaEl.textContent = ''
  

  // select words from pools to assemble a rich prompt
  const chosen = []
  for(let i=0;i<5;i++){
    const pool = (mode==='apps'?pools.apps:pools.youtube)[i]
    chosen[i] = randomChoice(pool)
  }

  // time reel
  const t = randomChoice(timeOptions)
  timeEl.textContent = t

  // assemble result using internal module
  try{
    // pick role-based words if available
    let picked = chosen
    if(rolePools[mode]){
      const rp = rolePools[mode]
      picked = [ randomChoice(rp.subj), randomChoice(rp.mod), randomChoice(rp.aud), randomChoice(rp.plat), randomChoice(rp.act) ]
    }
    // normalize, dedupe and make entries more specific
    picked = normalizeChosen(picked)
    picked = picked.map((t,i)=> makeSpecific(t,i))
    if(mode==='apps') picked[0] = ensureDeterminer(picked[0])

    const result = internalGenerator(mode, picked, timeEl.textContent)
    const text = result.text || ''
    const actions = result.next_actions || []
    const prompt = result.prompt || ''
    const tech = result.tech || ''
    const tags = result.tags || []
    const speed = getSpeed()
    if(speed==='fast'){
      ideaEl.textContent = prompt || text.split('\n')[0] || text
      ideaOutput.textContent = text
      stackEl.textContent = tech || '—'
      tagsEl.textContent = tags.length? tags.map(t=>'#'+t).join(' ') : '—'
      // render next actions
      nextEl.innerHTML = ''
      if(actions.length){ actions.forEach(a=>{ const li=document.createElement('li'); li.textContent=a; nextEl.appendChild(li) }) }
      else { nextEl.innerHTML = '<li>—</li>' }
      generateBtn.disabled = false
      generateBtn.textContent = prevText
    } else {
      // type one word per second
      // show prompt headline while typing full text
      ideaEl.textContent = prompt || text.split('\n')[0] || text
      stackEl.textContent = tech || '—'
      tagsEl.textContent = tags.length? tags.map(t=>'#'+t).join(' ') : '—'
      nextEl.innerHTML = ''
      if(actions.length){ actions.forEach(a=>{ const li=document.createElement('li'); li.textContent=a; nextEl.appendChild(li) }) }
      else { nextEl.innerHTML = '<li>—</li>' }
      typeWords(text, 1000).then(()=>{ ideaOutput.textContent = text; generateBtn.disabled = false; generateBtn.textContent = prevText })
    }
  }catch(e){
    console.error('Generation failed', e)
    showError(e && e.message? e.message : String(e))
    ideaEl.textContent = 'Something went wrong.'
    try{ generateBtn.disabled = false; generateBtn.textContent = 'Generate' }catch(_){ }
  }
}

// AI generation via OpenAI Chat Completions (browser fetch). Requires a valid API key.
// Internal generator module (no external API)
function internalGenerator(mode, chosen, timeEstimate){
  // apps mode: ensure 'that' introduces an action clause (verb phrase)
  if(mode==='apps'){
    const subj = chosen[0]
    const mod = chosen[1]
    const aud = chosen[2]
    const plat = chosen[3]
    const act = chosen[4]
    const prompt = `Build ${subj} ${mod} for ${aud} on ${plat}`.replace(/\s+/g,' ').trim()
    const sentence = `${prompt} that ${act}`.replace(/\s+/g,' ').trim()
    const next = [
      'Define 3 core features and acceptance criteria',
      'Pick a minimal stack and scaffold the MVP (example: React PWA + Firebase)',
      'Make a prototype, test with 5 users, iterate on the top request'
    ]
    const tech = randomChoice(techSuggestions.apps)
    const tags = [randomChoice(tagPools.apps), randomChoice(tagPools.apps)].filter(Boolean)
    return {prompt: sentence, next_actions: next, text: sentence + ` — Build it in ${timeEstimate}.`, tech, tags}
  }

  if(mode==='youtube'){
    const sentence = `${chosen[0]} ${chosen[1]} ${chosen[3]} ${chosen[2]} ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const tech = randomChoice(techSuggestions.youtube)
    const tags = [randomChoice(tagPools.youtube), randomChoice(tagPools.youtube)].filter(Boolean)
    const title = `${chosen[0]} ${chosen[1]} — Quick build for ${chosen[2]}`
    const next = ['Plan video outline','Record a short demo','Edit and publish with timestamps']
    return {text: `${title}\n${sentence}`, prompt: title, tech, tags, next_actions: next}
  }

  if(mode==='games'){
    const sentence = `Create a ${chosen[0]} ${chosen[1]} for ${chosen[2]} on ${chosen[3]} that ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const tech = randomChoice(techSuggestions.games)
    const tags = [randomChoice(tagPools.games), randomChoice(tagPools.games)].filter(Boolean)
    const next = ['Sketch core mechanics','Prototype one level','Playtest and iterate']
    const title = `Prototype: ${chosen[0]} ${chosen[1]} — ${chosen[2]}`
    return {text: `${title}\n${sentence} — Build it in ${timeEstimate}.`, next_actions: next, prompt: title, tech, tags}
  }

  if(mode==='tools'){
    const sentence = `Build ${chosen[0]} ${chosen[1]} for ${chosen[2]} as a ${chosen[3]} that ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const tech = randomChoice(techSuggestions.tools)
    const tags = [randomChoice(tagPools.tools), randomChoice(tagPools.tools)].filter(Boolean)
    const next = ['Define CLI UX','Implement core command','Document usage and ship']
    const title = `Tool: ${chosen[0]} ${chosen[1]} — ${chosen[2]}`
    return {text: `${title}\n${sentence} — Build it in ${timeEstimate}.`, next_actions: next, prompt: title, tech, tags}
  }

  if(mode==='content'){
    const sentence = `${chosen[0]} ${chosen[1]} ${chosen[2]} ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const next = ['Outline episodes','Produce first draft','Publish and measure engagement']
    // enrich with tech suggestion and tags
    const tech = randomChoice(techSuggestions.content)
    const tags = [randomChoice(tagPools.content), randomChoice(tagPools.content), randomChoice(tagPools.content)].filter(Boolean)
    const sample = `Series: "${chosen[0]} ${chosen[1]} — quick wins for ${chosen[2]}"`
    return {text: sentence + ` — Deliver in ${timeEstimate}.\nSuggested stack: ${tech}\n${sample}\nTags: ${tags.map(t=>'#'+t).join(' ')}`, next_actions: next, prompt: sentence}
  }

  // fallback: generic sentence
  const sentence = `${chosen[0]} ${chosen[1]} ${chosen[2]} ${chosen[3]}, ${chosen[4]}`.replace(/\s+/g,' ').trim()
  const tech = techSuggestions[mode] ? randomChoice(techSuggestions[mode]) : ''
  const tags = tagPools[mode] ? [randomChoice(tagPools[mode]), randomChoice(tagPools[mode])] : []
  const extras = []
  if(tech) extras.push('Suggested stack: '+tech)
  if(tags.length) extras.push('Tags: '+tags.map(t=>'#'+t).join(' '))
  return {text: sentence + (extras.length? '\n'+extras.join(' \n') : '')}
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"
  }[s]))
}

// typing helper: reveal words in element at interval ms per word
function typeWords(text, msPerWord){
  return new Promise(resolve=>{
    ideaEl.textContent = ''
    const words = text.split(/\s+/)
    let i=0
    const iv = setInterval(()=>{
      ideaEl.textContent += (i? ' ':'') + words[i]
      i++
      if(i>=words.length){ clearInterval(iv); resolve() }
    }, msPerWord)
  })
}

generateBtn.addEventListener('click', generate)

copyBtn.addEventListener('click', ()=>{
  const txt = ideaEl.textContent
  navigator.clipboard.writeText(txt).then(()=>{
    copyBtn.textContent = 'Copied!'
    setTimeout(()=>copyBtn.textContent='Copy Idea',900)
  })
})

downloadBtn.addEventListener('click', ()=>{
  const txt = ideaEl.textContent || ''
  const blob = new Blob([txt], {type:'text/plain'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'idea.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
})

shareBtn.addEventListener('click', ()=>{
  const txt = ideaEl.textContent || ''
  const url = 'https://twitter.com/intent/tweet?text='+encodeURIComponent(txt)
  window.open(url,'_blank')
})

// initial
setMode('apps')
