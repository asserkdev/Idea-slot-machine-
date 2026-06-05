// Simple slot-machine idea generator
const modeApps = document.getElementById('mode-apps')
const modeYT = document.getElementById('mode-youtube')
const ideaEl = document.getElementById('paper')
const generateBtn = document.getElementById('generate')
const copyBtn = document.getElementById('copy')
const downloadBtn = document.getElementById('download')
const shareBtn = document.getElementById('share')
const timeEl = document.getElementById('time')
let mode = 'apps'

// Pools generator: produce many permutations from small seeds so pools are large (~1000 entries each)
function expandPool(seeds, modifiers, target=1000){
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
    expandPool(appSeeds, appMods, 900),
    expandPool(appMods, ['with AI','offline-first','realtime','gamified','monetized','AR','ML','for kids','for creators','for teams'], 900),
    expandPool(['for students','for remote workers','for parents','for small businesses','for gamers','for photographers','for podcasters','for learners','for seniors','for devs'], appMods, 900),
    expandPool(['on mobile','as a PWA','as an extension','on desktop','on wearable','for smart TVs','for browsers','for Slack','for Discord','as an API'], appMods, 900),
    expandPool(['that auto-summarizes','that schedules tasks','that generates content','with leaderboards','that auto-tags photos','that creates themes','that reads voice notes','that automates payments','that creates templates'], appMods, 900)
  ],
  youtube:[
    expandPool(ytSeeds, ['in 24 hours','in a weekend','in 3 days','in one week','in 2 days','in an afternoon','in 48 hours','in a day','in two weeks','in an hour'], 900),
    expandPool(ytMods, ['with JS','with Python','with no frameworks','with web APIs','with prompts','with small datasets','mobile-first','serverless','open datasets','CI'], 900),
    expandPool(['fast','scrappy','iterative','minimal','production-ready','experimental','educational','challenge-style','tutorial','livestream'], ytMods, 900),
    expandPool(['and explain step-by-step','and ship a demo','and open-source','and iterate live','and document the process','and add tests','and make a series','and create challenges','and add AI features','and show metrics'], ytMods, 900),
    expandPool(['for beginners','for intermediate devs','for creators','for learners','for students','for YouTubers','for hackers','for researchers','for makers','for entrepreneurs'], ytMods, 900)
  ]
}

// Role-based pools for grammatically coherent sentences
const rolePools = {
  apps: {
    subj: expandPool(appSeeds, ['App','Service','Tool'], 600),
    mod: expandPool(appMods, ['with AI','offline-first','realtime','gamified','monetized','AR','ML'], 600),
    aud: expandPool(['students','remote workers','parents','small businesses','gamers','photographers','podcasters','creators','seniors','developers'], ['community','audience','users','teams'], 600),
    plat: expandPool(['mobile','PWA','extension','desktop','wearable','smart TV','browser','Slack','Discord','API'], ['platform'], 600),
    act: expandPool(['auto-summarizes photos','generates weekly reports','automatically tags content','schedules tasks','creates templates','generates themes','reads voice notes','automates payments','finds duplicates','recommends items'], ['using AI','with automation','in background'], 900)
  },
  youtube: {
    subj: expandPool(['Build','Make','Prototype','Train','Optimize','Analyze','Deploy','Ship'], ['a project','a demo','a tutorial'], 600),
    mod: expandPool(['an AI tool','a tiny app','a dataset pipeline','a code transformer','a bot','a simulator'], ['quickly','from scratch','with live coding'], 600),
    aud: expandPool(['for beginners','for intermediate devs','for creators','for learners','for students'], ['with examples'], 600),
    plat: expandPool(['using JavaScript','using Python','with web APIs','with prompts','with serverless'], ['in 1 day','in a weekend'], 600),
    act: expandPool(['and explain step-by-step','and ship a demo','and open-source it','and iterate live','and add tests'], ['and show metrics'], 600)
  },
  games: {
    subj: expandPool(['Casual','Puzzle','Arcade','RPG','Strategy','Multiplayer'], ['game'], 600),
    mod: expandPool(['with physics','with procedural levels','with social features','with AI enemies','with co-op'], ['lite','pro'], 600),
    aud: expandPool(['for mobile players','for families','for speedrunners','for puzzle lovers'], ['on phones','on PC'], 600),
    plat: expandPool(['mobile','PC','web','console'], ['platform'], 600),
    act: expandPool(['that adapts difficulty','that generates levels','that learns player style','that auto-saves progress'], ['and shares leaderboards'], 600)
  },
  tools: {
    subj: expandPool(['CLI','Extension','Plugin','Debugger','Formatter','Linter'], ['tool'], 600),
    mod: expandPool(['for developers','for designers','for writers','for data scientists'], ['fast','lightweight'], 600),
    aud: expandPool(['for teams','for open-source projects','for solo devs'], ['in workflows'], 600),
    plat: expandPool(['VSCode','GitHub Actions','Node.js CLI','Browser'], ['integration'], 600),
    act: expandPool(['that automates builds','that formats code','that analyzes performance','that simplifies PRs'], ['with quick setup'], 600)
  },
  content: {
    subj: expandPool(['Newsletter','Template','Content generator','Playlist','Series'], ['for creators'], 600),
    mod: expandPool(['with prompts','with AI summaries','with templates','with snippets'], ['daily','weekly'], 600),
    aud: expandPool(['for YouTubers','for bloggers','for podcasters'], ['to reuse'], 600),
    plat: expandPool(['web','editor','platform'], ['integration'], 600),
    act: expandPool(['that auto-suggests topics','that auto-generates outlines','that schedules posts','that creates thumbnails'], ['with analytics'], 600)
  }
}

const timeOptions = ['1 day','2 days','3 days','1 week','2 weeks','1 month']

// UI elements for new features
const useSound = document.getElementById('useSound')
let soundEnabled = true
useSound.addEventListener('change', ()=> soundEnabled = useSound.checked)

function setMode(m){
  mode = m
  modeApps.classList.toggle('active', m==='apps')
  modeYT.classList.toggle('active', m==='youtube')
}

modeApps.onclick = ()=>setMode('apps')
modeYT.onclick = ()=>setMode('youtube')

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
    const result = internalGenerator(mode, picked, timeEl.textContent)
    const text = result.text
    const actions = result.next_actions || []
    const prompt = result.prompt || ''
    const speed = getSpeed()
    if(speed==='fast'){
      ideaEl.textContent = text
      generateBtn.disabled = false
      generateBtn.textContent = prevText
    } else {
      // type one word per second
      typeWords(text, 1000).then(()=>{ generateBtn.disabled = false; generateBtn.textContent = prevText })
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
    return {prompt: sentence, next_actions: next, text: sentence + ` — Build it in ${timeEstimate}.`}
  }

  if(mode==='youtube'){
    const sentence = `${chosen[0]} ${chosen[1]} ${chosen[3]} ${chosen[2]} ${chosen[4]}`.replace(/\s+/g,' ').trim()
    return {text: sentence}
  }

  if(mode==='games'){
    const sentence = `Create a ${chosen[0]} ${chosen[1]} for ${chosen[2]} on ${chosen[3]} that ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const next = ['Sketch core mechanics','Prototype one level','Playtest and iterate']
    return {text: sentence + ` — Build it in ${timeEstimate}.`, next_actions: next, prompt: sentence}
  }

  if(mode==='tools'){
    const sentence = `Build ${chosen[0]} ${chosen[1]} for ${chosen[2]} as a ${chosen[3]} that ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const next = ['Define CLI UX','Implement core command','Document usage and ship']
    return {text: sentence + ` — Build it in ${timeEstimate}.`, next_actions: next, prompt: sentence}
  }

  if(mode==='content'){
    const sentence = `${chosen[0]} ${chosen[1]} ${chosen[2]} ${chosen[4]}`.replace(/\s+/g,' ').trim()
    const next = ['Outline episodes','Produce first draft','Publish and measure engagement']
    return {text: sentence + ` — Deliver in ${timeEstimate}.`, next_actions: next, prompt: sentence}
  }

  // fallback: generic sentence
  const sentence = `${chosen[0]} ${chosen[1]} ${chosen[2]} ${chosen[3]}, ${chosen[4]}`.replace(/\s+/g,' ').trim()
  return {text: sentence}
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
