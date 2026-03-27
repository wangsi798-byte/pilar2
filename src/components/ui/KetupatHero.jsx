export default function KetupatHero() {
  return (
    <div className="relative w-full h-full select-none">

      {/* Small ketupat TL */}
      <div className="absolute top-[2%] left-[8%] w-16 animate-float-a" style={{ animationDelay: '0s' }}>
        <Ketupat size={64} seed={1} />
      </div>

      {/* Small ketupat TR */}
      <div className="absolute top-[10%] right-[5%] w-12 animate-float-b" style={{ animationDelay: '-1.8s' }}>
        <Ketupat size={48} seed={2} />
      </div>

      {/* Tiny ketupat mid-right */}
      <div className="absolute top-[6%] right-[28%] w-8 animate-float-b opacity-70" style={{ animationDelay: '-0.8s' }}>
        <Ketupat size={32} seed={3} />
      </div>

      {/* Small ketupat BL */}
      <div className="absolute bottom-[18%] left-[4%] w-10 animate-float-c" style={{ animationDelay: '-3.5s' }}>
        <Ketupat size={40} seed={2} />
      </div>

      {/* Hero ketupat centre */}
      <div className="absolute top-[4%] left-1/2 w-28"
           style={{ transform: 'translateX(-50%)', animation: 'floatA 7.5s ease-in-out infinite' }}>
        <HeroKetupat />
      </div>

      {/* Masjid bottom */}
      <div className="absolute bottom-0 left-1/2 w-full max-w-[400px]"
           style={{ transform: 'translateX(-50%)' }}>
        <Masjid />
      </div>

      {/* Bedug bottom-right */}
      <div className="absolute bottom-2 right-[5%] w-20 opacity-90">
        <Bedug />
      </div>
    </div>
  )
}

/* ── Reusable small ketupat ──────────────────── */
function Ketupat({ size, seed }) {
  const palettes = [
    ['#FFF0B0','#E0A840','#8A6420'],
    ['#F5D27A','#C9973A','#B5651D'],
    ['#E8B84B','#D4A030','#A67C2B'],
  ]
  const [c0, c1, c2] = palettes[(seed - 1) % palettes.length]
  const id = `k${size}s${seed}`
  const h  = size, cx = h / 2

  return (
    <svg viewBox={`0 0 ${h} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}m`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={c0} />
          <stop offset="55%"  stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <filter id={`${id}f`}><feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="rgba(120,80,10,.22)"/></filter>
      </defs>
      <polygon points={`${cx},3 ${h-3},${cx} ${cx},${h-3} 3,${cx}`}
               fill={`url(#${id}m)`} filter={`url(#${id}f)`}/>
      <line x1="3" y1={cx} x2={h-3} y2={cx} stroke="rgba(255,255,255,.28)" strokeWidth="1"/>
      <line x1={cx} y1="3" x2={cx} y2={h-3} stroke="rgba(255,255,255,.28)" strokeWidth="1"/>
      <circle cx={cx} cy={cx} r={h * .07} fill="rgba(255,255,255,.45)"/>
    </svg>
  )
}

/* ── Hero ketupat (large, detailed) ─────────── */
function HeroKetupat() {
  return (
    <svg viewBox="0 0 115 115" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="khMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFF8C8"/>
          <stop offset="25%"  stopColor="#F5D050"/>
          <stop offset="65%"  stopColor="#C9973A"/>
          <stop offset="100%" stopColor="#7A5018"/>
        </linearGradient>
        <linearGradient id="khHL" x1="0%" y1="0%" x2="65%" y2="65%">
          <stop offset="0%"   stopColor="rgba(255,252,200,.62)"/>
          <stop offset="100%" stopColor="rgba(255,252,200,0)"/>
        </linearGradient>
        <radialGradient id="khGlow" cx="38%" cy="33%" r="52%">
          <stop offset="0%"   stopColor="rgba(255,248,180,.48)"/>
          <stop offset="100%" stopColor="rgba(255,248,180,0)"/>
        </radialGradient>
        <filter id="fkh"><feDropShadow dx="2" dy="5" stdDeviation="7" floodColor="rgba(100,60,5,.28)"/></filter>
      </defs>
      <polygon points="57,7 108,57 57,107 6,57" fill="rgba(100,60,5,.12)" transform="translate(4,7)"/>
      <polygon points="57,7 108,57 57,107 6,57" fill="url(#khMain)" filter="url(#fkh)"/>
      {/* grid */}
      {[57,40,74,24,90].map((x,i) => (
        <line key={`v${i}`} x1={x} y1={i>1?32:i>0?18:7} x2={x} y2={i>1?82:i>0?96:107}
              stroke="rgba(255,255,255,.26)" strokeWidth={i===0?1.4:i<3?1.1:.9}/>
      ))}
      {[57,40,74,24,90].map((y,i) => (
        <line key={`h${i}`} x1={i>1?32:i>0?18:6} y1={y} x2={i>1?82:i>0?96:108} y2={y}
              stroke="rgba(255,255,255,.26)" strokeWidth={i===0?1.4:i<3?1.1:.9}/>
      ))}
      <polygon points="57,7 108,57 57,107 6,57" fill="url(#khHL)"/>
      <polygon points="57,7 108,57 57,107 6,57" fill="url(#khGlow)"/>
      <polygon points="57,18 96,57 57,96 18,57" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.5"/>
      <circle cx="57" cy="57" r="10"  fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.38)" strokeWidth="1.4"/>
      <circle cx="57" cy="57" r="5.5" fill="rgba(255,255,255,.30)" stroke="rgba(255,255,255,.50)" strokeWidth="1"/>
      <circle cx="57" cy="57" r="2.5" fill="rgba(255,255,255,.60)"/>
      <line x1="57" y1="0"   x2="57" y2="7"   stroke="#B8860B" strokeWidth="3"   strokeLinecap="round"/>
      <line x1="57" y1="107" x2="57" y2="115"  stroke="#B8860B" strokeWidth="3"   strokeLinecap="round"/>
      <circle cx="57" cy="2"   r="3.5" fill="#A67C2B"/>
      <circle cx="57" cy="113" r="3.5" fill="#A67C2B"/>
    </svg>
  )
}

/* ── Masjid ─────────────────────────────────── */
function Masjid() {
  return (
    <svg viewBox="0 0 400 165" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mqB" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F8D878"/><stop offset="100%" stopColor="#C08020"/>
        </linearGradient>
        <linearGradient id="mqS" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#E8B840"/><stop offset="100%" stopColor="#9A7010"/>
        </linearGradient>
        <linearGradient id="mqD" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#FFF5C0"/><stop offset="35%" stopColor="#EABC48"/>
          <stop offset="100%" stopColor="#7A5010"/>
        </linearGradient>
        <linearGradient id="mqM" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#F0C050"/><stop offset="100%" stopColor="#9A7010"/>
        </linearGradient>
        <filter id="fmq"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(80,50,5,.18)"/></filter>
      </defs>
      <g filter="url(#fmq)">
        {/* wings */}
        <rect x="44" y="98" width="62" height="67" rx="2" fill="url(#mqS)"/>
        <path d="M44 98Q75 70 106 98" fill="url(#mqS)"/>
        <path d="M57 136Q75 120 93 136L93 165L57 165Z" fill="rgba(255,255,255,.13)"/>
        <rect x="294" y="98" width="62" height="67" rx="2" fill="url(#mqS)"/>
        <path d="M294 98Q325 70 356 98" fill="url(#mqS)"/>
        <path d="M307 136Q325 120 343 136L343 165L307 165Z" fill="rgba(255,255,255,.13)"/>
        {/* main body */}
        <rect x="90" y="93" width="220" height="72" rx="2" fill="url(#mqB)"/>
        <path d="M90 93Q200 52 310 93" fill="url(#mqB)"/>
        <path d="M108 133Q126 115 144 133L144 165L108 165Z" fill="rgba(255,255,255,.13)"/>
        <path d="M182 133Q200 114 218 133L218 165L182 165Z" fill="rgba(255,255,255,.17)"/>
        <path d="M256 133Q274 115 292 133L292 165L256 165Z" fill="rgba(255,255,255,.13)"/>
        {/* dome */}
        <ellipse cx="200" cy="70" rx="52" ry="14" fill="url(#mqD)"/>
        <path d="M148 70Q148 18 200 16Q252 18 252 70" fill="url(#mqD)"/>
        <path d="M160 58Q170 28 200 22Q178 24 164 54Z" fill="rgba(255,252,200,.28)"/>
        <rect x="194" y="10" width="12" height="7" rx="2" fill="url(#mqM)"/>
        <g transform="translate(200,5)">
          <circle cx="0" cy="0" r="5.5" fill="none" stroke="#C08020" strokeWidth="2.2"/>
          <circle cx="3.5" cy="-1.5" r="5" fill="#FFF8E7"/>
          <g transform="translate(7,-5) scale(.6)">
            <polygon points="0,-5 1.2,-1.5 4.8,-1.5 2,1 3,4.5 0,2.5 -3,4.5 -2,1 -4.8,-1.5 -1.2,-1.5" fill="#C08020"/>
          </g>
        </g>
        {/* minarets */}
        {[96,282].map((x, i) => {
          const cx = x + 11
          return (
            <g key={i}>
              <rect x={x} y="46" width="22" height="52" rx="2" fill="url(#mqM)"/>
              <ellipse cx={cx} cy="46" rx="11" ry="4.5" fill="#F0C050"/>
              <path d={`M${x} 46Q${cx} 27 ${x+22} 46`} fill="#F0C050"/>
              <rect x={x-5} y="74" width="32" height="5" rx="2.5" fill="#D4A030"/>
              <rect x={cx-5} y="20" width="10" height="8" rx="1.5" fill="#D4A030"/>
              <g transform={`translate(${cx},17)`}>
                <circle cx="0" cy="0" r="3.5" fill="none" stroke="#C08020" strokeWidth="1.8"/>
                <circle cx="2.2" cy="-1" r="3.2" fill="#FFF8E7"/>
              </g>
              <path d={`M${cx-6} 58Q${cx} 52 ${cx+6} 58L${cx+6} 68L${cx-6} 68Z`} fill="rgba(255,255,255,.17)"/>
            </g>
          )
        })}
        <line x1="30" y1="165" x2="370" y2="165" stroke="rgba(201,151,58,.35)" strokeWidth="1.5"/>
      </g>
    </svg>
  )
}

/* ── Bedug ───────────────────────────────────── */
function Bedug() {
  return (
    <svg viewBox="0 0 90 145" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bdBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#6A3E18"/><stop offset="22%"  stopColor="#C07838"/>
          <stop offset="50%"  stopColor="#E09848"/><stop offset="78%"  stopColor="#C07838"/>
          <stop offset="100%" stopColor="#6A3E18"/>
        </linearGradient>
        <linearGradient id="bdMem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFAC8"/><stop offset="100%" stopColor="#E0C068"/>
        </linearGradient>
        <linearGradient id="bdRing" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9A6820"/><stop offset="50%" stopColor="#F5D068"/>
          <stop offset="100%" stopColor="#9A6820"/>
        </linearGradient>
        <filter id="fbd"><feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="rgba(80,40,5,.24)"/></filter>
      </defs>
      <rect x="7" y="28" width="76" height="84" rx="7" fill="url(#bdBody)" filter="url(#fbd)"/>
      {[22,36,50,64].map(x => (
        <line key={x} x1={x} y1="28" x2={x} y2="112" stroke="rgba(60,30,5,.20)" strokeWidth="1"/>
      ))}
      {[38,57,76,97].map(y => (
        <rect key={y} x="4" y={y} width="82" height="7" rx="3.5" fill="url(#bdRing)"/>
      ))}
      <ellipse cx="45" cy="28" rx="38" ry="12" fill="url(#bdMem)" stroke="#C8900A" strokeWidth="1.5"/>
      <circle cx="45" cy="28" r="22" fill="none" stroke="rgba(160,110,20,.32)" strokeWidth="1.2"/>
      <circle cx="45" cy="28" r="11" fill="none" stroke="rgba(160,110,20,.26)" strokeWidth="1"/>
      <ellipse cx="38" cy="24" rx="10" ry="5" fill="rgba(255,252,200,.24)" transform="rotate(-20,38,24)"/>
      <ellipse cx="45" cy="112" rx="38" ry="12" fill="#D8B850" stroke="#C8900A" strokeWidth="1.5"/>
      <line x1="20" y1="112" x2="14" y2="142" stroke="#7A5020" strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="70" y1="112" x2="76" y2="142" stroke="#7A5020" strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="14" y1="130" x2="76" y2="130" stroke="#A07028" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="84" y1="4"  x2="64" y2="26" stroke="#7A5020" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="88" cy="2" r="7.5" fill="#C07838" stroke="#9A5818" strokeWidth="1.5"/>
      <circle cx="85" cy="0" r="3"   fill="rgba(255,230,150,.34)"/>
    </svg>
  )
}
