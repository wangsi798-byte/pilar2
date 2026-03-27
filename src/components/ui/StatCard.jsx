export default function StatCard({ icon: Icon, label, value, sub, accent = false }) {
  return (
    <div className={`card flex items-start gap-4 ${accent ? 'bg-gold-btn' : ''}`}>
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
        ${accent ? 'bg-white/20' : 'bg-gold-100'}`}>
        <Icon size={20} className={accent ? 'text-white' : 'text-gold-600'} />
      </div>
      <div className="min-w-0">
        <p className={`text-[11px] font-medium uppercase tracking-wider mb-0.5
          ${accent ? 'text-white/70' : 'text-brown-300'}`}>{label}</p>
        <p className={`font-display text-2xl font-semibold leading-tight
          ${accent ? 'text-white' : 'text-brown-700'}`}>{value}</p>
        {sub && <p className={`text-xs mt-0.5 ${accent ? 'text-white/60' : 'text-brown-100'}`}>{sub}</p>}
      </div>
    </div>
  )
}
