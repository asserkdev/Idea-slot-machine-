const gen = require('../gen_module')
const fs = require('fs')

const modes = ['apps','youtube','games','tools','content']
let output = ''

function sampleFromPool(mode){
  const rp = gen.rolePools[mode]
  if(!rp) return ['','','','','']
  return [ gen.randomChoice(rp.subj), gen.randomChoice(rp.mod), gen.randomChoice(rp.aud), gen.randomChoice(rp.plat), gen.randomChoice(rp.act) ]
}

function runTests(){
  for(const mode of modes){
    output += `\n--- MODE: ${mode} ---\n`
    let failures = 0
    for(let i=0;i<30;i++){
      let picked = sampleFromPool(mode)
      picked = gen.normalizeChosen(picked)
      picked = picked.map((t,i)=>gen.makeSpecific(t,i))
      if(mode==='apps') picked[0] = gen.ensureDeterminer(picked[0])
      const out = gen.internalGenerator(mode, picked, '2 days')
      const text = out.text || ''
      const prompt = out.prompt || ''
      const tech = out.tech || ''
      const tags = out.tags || []
      if(mode==='apps'){
        if(!/that\s/.test(text) && !/that\s/.test(prompt)) failures++
      }
      if(!text || text.length<10) failures++
      if(!tech) failures++
      if(!tags || tags.length===0) failures++
      if(i%10===0) output += `sample ${i}\n${text.split('\n')[0]}\n` 
    }
    output += `failures: ${failures} out of 30\n`
  }
}

runTests()
fs.writeFileSync('tests/generation_results.txt', output)
console.log('Wrote tests/generation_results.txt')
