// Simple slot-machine idea generator
const modeApps = document.getElementById('mode-apps')
const modeYT = document.getElementById('mode-youtube')
const ideaEl = document.getElementById('idea')
const spinBtn = document.getElementById('spin')
const copyBtn = document.getElementById('copy')
const p1 = document.getElementById('p1'), p2 = document.getElementById('p2')
const p1v = document.getElementById('p1v'), p2v = document.getElementById('p2v')
const reels = Array.from(document.querySelectorAll('#reels .reel'))
const timeReel = document.getElementById('time')
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

const timeOptions = ['1 day','2 days','3 days','1 week','2 weeks','1 month']

// UI elements for new features
const useAI = document.getElementById('useAI')
const apiKeyInput = document.getElementById('apiKey')
const useSound = document.getElementById('useSound')
const downloadBtn = document.getElementById('download')
const shareBtn = document.getElementById('share')

let soundEnabled = true
useSound.addEventListener('change', ()=> soundEnabled = useSound.checked)

function setMode(m){
  mode = m
  modeApps.classList.toggle('active', m==='apps')
  modeYT.classList.toggle('active', m==='youtube')
}

modeApps.onclick = ()=>setMode('apps')
modeYT.onclick = ()=>setMode('youtube')

p1.oninput = ()=>p1v.textContent = p1.value
p2.oninput = ()=>p2v.textContent = p2.value

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

function spin(){
  // start sound
  audioCtx.resume()
  playTick()
  spinBtn.disabled = true
  ideaEl.textContent = 'Spinning...'
  try{

  // determine X behavior: percent chance that exactly 1 or 2 slots become X (absent)
  const pOne = Number(p1.value)/100
  const pTwo = Number(p2.value)/100
  // Decide whether to force 1 or 2 Xs, otherwise none
  let xCount = 0
  if(Math.random() < pTwo) xCount = 2
  else if(Math.random() < pOne) xCount = 1

  // pick X indices
  let xIndices = []
  if(xCount>0){
    const idxs = [...Array(5).keys()]
    for(let i=0;i<xCount;i++){
      const j = Math.floor(Math.random()*idxs.length)
      xIndices.push(idxs.splice(j,1)[0])
    }
  }

  const chosen = []
  reels.forEach((r,i)=>{
    r.classList.add('spin')
    // show quick animation and then settle
    const pool = (mode==='apps'?pools.apps:pools.youtube)[i]
    // random interim updates
    let ticks = 12 + Math.floor(Math.random()*14)
    let t=0
    const iv = setInterval(()=>{
      r.querySelector('.cell').textContent = randomChoice(pool)
      playTick()
      t++
      if(t>=ticks){
        clearInterval(iv)
        // if this index is X, show X marker
        if(xIndices.includes(i)){
          r.querySelector('.cell').textContent = '✕'
          chosen[i] = null
        } else {
          const val = randomChoice(pool)
          r.querySelector('.cell').textContent = val
          chosen[i] = val
        }
        r.classList.remove('spin')
        playStop()
      }
    }, 40 + Math.random()*40)
  })

  // time reel
  timeReel.classList.add('spin')
  setTimeout(()=>{
    const t = randomChoice(timeOptions)
    timeReel.querySelector('.cell').textContent = t
    timeReel.classList.remove('spin')
  }, 600 + Math.random()*400)

  // after all reels settled -> assemble sentence
  const finishDelay = 1200
  setTimeout(()=>{
    try{
    // if AI requested and api key provided, ask AI to compose a coherent sentence
    if(useAI.checked && apiKeyInput.value.trim()){ 
        generateWithAI(mode, chosen).then(res=>{
          const time = timeReel.querySelector('.cell').textContent
          // if AI returned structured object
          if(typeof res === 'object' && res !== null){
            const prompt = res.prompt || res.text || ''
            const actions = Array.isArray(res.next_actions)?res.next_actions:[]
            let html = `<p>${escapeHtml(prompt)}</p>`
            if(actions.length) html += '<ul>' + actions.map(a=>`<li>${escapeHtml(a)}</li>`).join('') + '</ul>'
            html += `<div class="estimate">Build it in ${escapeHtml(time)}.</div>`
            ideaEl.innerHTML = html
          } else {
            ideaEl.textContent = (res || '') + ' — Build it in ' + time + '.'
          }
          spinBtn.disabled = false
        }).catch(err=>{
          console.warn('AI generation failed',err)
          assembleFallback()
        })
      return
    }
    // build idea sentence depending on mode
    assembleFallback()

    function assembleFallback(){
      let words = chosen.map(w=>w).filter(Boolean)
      let idea = ''
      if(mode==='apps'){
        // produce a prompt and three clear next actions + suggested stack
        const A = chosen[0] || 'a small app'
        const B = chosen[1] || ''
        const C = chosen[2] || 'a target audience'
        const D = chosen[3] || 'a platform'
        const E = chosen[4] || ''
        const promptText = `Build ${A} ${B} for ${C} ${D}${E?`, ${E}`:''}`.replace(/\s+/g,' ').trim()
        const actions = []
        actions.push(`Define the MVP: list 3 core features and the acceptance criteria`)
        actions.push(`Pick a minimal tech stack (example: React PWA + Firebase or Next.js + Supabase) and scaffold the app`)
        actions.push(`Build a clickable prototype, run a short usability test, then iterate on the top improvement`)
        const suggestions = [`Suggested stacks: React PWA + Firebase`, `Next.js + Supabase`, `Flutter + Firebase for mobile`]
        const time = timeReel.querySelector('.cell').textContent
        let html = `<p>${escapeHtml(promptText)}</p><ul>` + actions.map(a=>`<li>${escapeHtml(a)}</li>`).join('') + `</ul>`
        html += `<p class="small">${suggestions.map(s=>escapeHtml(s)).join(' • ')}</p>`
        html += `<div class="estimate">Build it in ${escapeHtml(time)}.</div>`
        ideaEl.innerHTML = html
        spinBtn.disabled = false
        return
      } else {
        // youtube template
        const V1 = chosen[0] || 'Build'
        const V2 = chosen[1] || 'a tiny project'
        const V3 = chosen[2] || 'in a day'
        const V4 = chosen[3] || 'with minimal tools'
        const V5 = chosen[4] || 'and explain it'
        idea = `${V1} ${V2} ${V3} ${V4}, ${V5}`.replace(/\s+/g,' ').trim()
      }

      // make sure sentence makes sense: if everything is X, fallback
      if(words.length===0) idea = mode==='apps' ? 'Make a small utility app for creators in 1 day.' : 'Make a short coding challenge video in 1 day.'

      const time = timeReel.querySelector('.cell').textContent
      ideaEl.textContent = idea + ' — Build it in ' + time + '.'
      spinBtn.disabled = false
    }
      }catch(e){
        console.error('Error assembling idea', e)
        ideaEl.textContent = 'Something went wrong. Check console.'
        spinBtn.disabled = false
      }
  }, finishDelay)
    }catch(e){
      console.error('Spin failed', e)
      ideaEl.textContent = 'Something went wrong. Check console.'
      spinBtn.disabled = false
    }
}

// AI generation via OpenAI Chat Completions (browser fetch). Requires a valid API key.
async function generateWithAI(mode, chosen){
  const key = apiKeyInput.value.trim()
  if(!key) throw new Error('No API key')
  const prompt = buildAIPrompt(mode, chosen)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer '+key
    },
    body: JSON.stringify({
      model:'gpt-4o-mini',
      messages:[{role:'user',content:prompt}],
      max_tokens:120,
      temperature:0.8
    })
  })
  if(!res.ok) throw new Error(await res.text())
  const j = await res.json()
  const text = j.choices?.[0]?.message?.content?.trim()
  if(!text) throw new Error('No answer')
    // try to parse JSON output (preferred for apps mode)
    try{
      const parsed = JSON.parse(text)
      return parsed
    }catch(e){
      return text.replace(/\n/g,' ')
    }
}

function buildAIPrompt(mode, chosen){
  const parts = chosen.map((c,i)=> c===null?`SLOT${i}: X (absent)`:`SLOT${i}: ${c}`)
    if(mode==='apps'){
      const base = `You are an assistant that converts slot values into a short app prompt and three next actions. Slots: ${parts.join(', ')}.`
      return base + ' Output ONLY valid JSON with keys: "prompt" (string) and "next_actions" (array of 3 strings). Do NOT include extra text.'
    }
    const base = `You are a concise idea generator. Given these slot values produce a single, natural-sounding idea sentence and a short build-time estimate. Use the mode: ${mode}. Slots: ${parts.join(', ')}.`
    return base + ' Output only the sentence (no explanation).'
}

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"
    }[s]))
  }

spinBtn.addEventListener('click', spin)

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
