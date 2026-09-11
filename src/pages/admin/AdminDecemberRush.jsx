import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Plus, Trash2, CalendarClock, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

const DEFAULT = {
  enabled: true,
  bookingOpen: '2026-09-15',
  bookingClose: '2026-09-30',
  firstPaymentPercent: 30,
  availableDurations: [4, 8, 12],
  pricingTiers: [
    { id: 'small',  label: '3.8kg-4.1kg', total: 18000 },
    { id: 'medium', label: '4.2kg-4.5kg', total: 24000 },
    { id: 'large',  label: '4.6kg-5.0kg', total: 30000 },
    { id: 'xlarge', label: '5.1kg-5.5kg', total: 36000 },
  ],
};

const fmt = (n) => '\u20a6' + Number(n || 0).toLocaleString('en-NG');

export default function AdminDecemberRush() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(DEFAULT);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'december_rush'));
        if (snap.exists()) setSettings({ ...DEFAULT, ...snap.data() });
      } catch { showToast('Failed to load', 'error'); }
      finally { setLoading(false); }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'december_rush'), { ...settings, updatedAt: new Date() }, { merge: true });
      showToast('Saved successfully!');
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const setf = (key, val) => setSettings(s => ({ ...s, [key]: val }));
  const updateTier = (idx, field, val) => {
    const t = [...settings.pricingTiers];
    t[idx] = { ...t[idx], [field]: field === 'total' ? Number(val) : val };
    setf('pricingTiers', t);
  };
  const toggleDur = (w) => {
    const cur = settings.availableDurations || [];
    setf('availableDurations', cur.includes(w) ? cur.filter(d => d !== w) : [...cur, w].sort((a,b)=>a-b));
  };

  const fp = (settings.firstPaymentPercent || 30) / 100;
  const inp = { width: '100%', background: 'var(--dark)', border: '1.5px solid var(--dark-border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '13px', color: 'var(--white)', outline: 'none', boxSizing: 'border-box' };
  const lbl = { display: 'block', fontSize: '10px', fontWeight: 800, color: 'var(--gray-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' };
  const card = { background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '24px' };

  if (loading) return <div style={{textAlign:'center',padding:'80px'}}><Loader2 className="spinner" size={48} color="var(--primary)" /></div>;

  return (
    <div>
      {toast.show && <div style={{position:'fixed',top:'24px',right:'24px',zIndex:9999,background:toast.type==='error'?'rgba(255,61,0,0.15)':'rgba(0,230,118,0.15)',border:'1px solid '+(toast.type==='error'?'var(--danger)':'var(--success)'),color:toast.type==='error'?'#ff8066':'var(--success)',padding:'12px 20px',borderRadius:'var(--radius-sm)',fontWeight:700,fontSize:'14px',backdropFilter:'blur(8px)'}}>{toast.msg}</div>}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'16px',marginBottom:'32px'}}>
        <div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'26px',fontWeight:900,margin:0,display:'flex',alignItems:'center',gap:'10px'}}>
            <CalendarClock size={24} color="var(--primary)" /> December Rush Settings
          </h1>
          <p style={{color:'var(--gray-1)',fontSize:'13px',marginTop:'4px'}}>Configure the installment plan shown to customers on the product page.</p>
        </div>
        <button onClick={save} disabled={saving} style={{display:'flex',alignItems:'center',gap:'8px',background:'var(--primary)',color:'var(--black)',padding:'12px 24px',borderRadius:'var(--radius-sm)',fontWeight:800,fontSize:'14px',border:'none',cursor:saving?'not-allowed':'pointer',boxShadow:'0 4px 16px var(--primary-glow)'}}>
          {saving ? <><Loader2 className="spinner" size={18}/> Saving...</> : <><Save size={18}/> Save Settings</>}
        </button>
      </div>

      {/* Enable toggle */}
      <div style={card}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:'15px',fontWeight:800,color:'var(--white)',marginBottom:'4px'}}>🎄 Enable December Rush Offer</div>
            <p style={{fontSize:'13px',color:'var(--gray-1)',margin:0}}>When OFF, the installment plan is hidden from all product pages.</p>
          </div>
          <button onClick={() => setf('enabled', !settings.enabled)} style={{background:'none',border:'none',cursor:'pointer',color:settings.enabled?'var(--success)':'var(--gray-2)'}}>
            {settings.enabled ? <ToggleRight size={52} strokeWidth={1.5}/> : <ToggleLeft size={52} strokeWidth={1.5}/>}
          </button>
        </div>
      </div>

      {/* Booking window */}
      <div style={card}>
        <div style={{fontSize:'15px',fontWeight:800,color:'var(--white)',marginBottom:'4px'}}>📅 Booking Window</div>
        <p style={{fontSize:'13px',color:'var(--gray-1)',marginBottom:'20px'}}>Customers can only enrol within this date range.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          <div><label style={lbl}>Open Date</label><input type="date" value={settings.bookingOpen} onChange={e=>setf('bookingOpen',e.target.value)} style={inp}/></div>
          <div><label style={lbl}>Close Date</label><input type="date" value={settings.bookingClose} onChange={e=>setf('bookingClose',e.target.value)} style={inp}/></div>
        </div>
      </div>

      {/* Payment structure */}
      <div style={card}>
        <div style={{fontSize:'15px',fontWeight:800,color:'var(--white)',marginBottom:'4px'}}>💳 Payment Structure</div>
        <p style={{fontSize:'13px',color:'var(--gray-1)',marginBottom:'20px'}}>First payment is a % upfront. Remaining amount splits weekly across the remaining weeks.</p>
        <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:'16px',alignItems:'center',marginBottom:'24px'}}>
          <div>
            <label style={lbl}>First Payment %</label>
            <input type="number" min="1" max="100" value={settings.firstPaymentPercent} onChange={e=>setf('firstPaymentPercent',Number(e.target.value))} style={inp}/>
          </div>
          <div style={{background:'rgba(0,230,118,0.06)',border:'1px solid rgba(0,230,118,0.2)',borderRadius:'var(--radius-sm)',padding:'14px 18px',fontSize:'13px',color:'var(--success)',lineHeight:1.8}}>
            <strong>Example — {fmt(18000)} chicken, 12 weeks:</strong><br/>
            First payment: <strong>{fmt(Math.round(18000*fp))} ({settings.firstPaymentPercent}%)</strong><br/>
            Then: <strong>{fmt(Math.round((18000*(1-fp))/11))}/wk</strong> x 11 weeks
          </div>
        </div>
        <label style={lbl}>Available Durations (check to enable)</label>
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'8px'}}>
          {[4,8,12].map(w => {
            const active=(settings.availableDurations||[]).includes(w);
            return <button key={w} onClick={()=>toggleDur(w)} style={{padding:'10px 24px',borderRadius:'var(--radius-sm)',border:'2px solid '+(active?'var(--success)':'var(--dark-border)'),background:active?'rgba(0,230,118,0.08)':'var(--dark)',color:active?'var(--success)':'var(--gray-1)',fontWeight:800,cursor:'pointer',transition:'all 0.2s',fontSize:'14px'}}>{active?'✓ ':''}{w} Weeks</button>;
          })}
        </div>
      </div>

      {/* Pricing tiers */}
      <div style={card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <div>
            <div style={{fontSize:'15px',fontWeight:800,color:'var(--white)',marginBottom:'4px'}}>🐔 Pricing Tiers</div>
            <p style={{fontSize:'13px',color:'var(--gray-1)',margin:0}}>Weight ranges and total prices. First payment and weekly amounts auto-calculate.</p>
          </div>
          <button onClick={()=>setf('pricingTiers',[...settings.pricingTiers,{id:'t_'+Date.now(),label:'',total:0}])} style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.05)',border:'1px dashed var(--gray-2)',color:'var(--white)',padding:'8px 16px',borderRadius:'var(--radius-sm)',cursor:'pointer',fontSize:'12px',fontWeight:700}}>
            <Plus size={14}/> Add Tier
          </button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1.2fr 1.2fr 1.2fr 40px',gap:'10px',padding:'10px 14px',background:'rgba(255,255,255,0.03)',borderRadius:'var(--radius-sm)',marginBottom:'10px',fontSize:'10px',fontWeight:800,color:'var(--gray-2)',textTransform:'uppercase',letterSpacing:'0.08em'}}>
          <span>Weight Label</span><span>Total</span><span>1st Payment</span><span>Weekly Amt</span><span></span>
        </div>
        {settings.pricingTiers.map((tier, idx) => {
          const firstAmt=Math.round(tier.total*fp);
          const minW=Math.min(...(settings.availableDurations?.length?settings.availableDurations:[12]));
          const wAmt=tier.total>0?Math.round((tier.total-firstAmt)/(minW-1)):0;
          return (
            <div key={tier.id||idx} style={{display:'grid',gridTemplateColumns:'2fr 1.2fr 1.2fr 1.2fr 40px',gap:'10px',marginBottom:'10px',alignItems:'center'}}>
              <input value={tier.label} onChange={e=>updateTier(idx,'label',e.target.value)} placeholder="e.g. 3.8kg-4.1kg" style={inp}/>
              <input type="number" value={tier.total} onChange={e=>updateTier(idx,'total',e.target.value)} placeholder="18000" style={inp}/>
              <div style={{padding:'10px 14px',background:'rgba(249,168,37,0.08)',border:'1px solid rgba(249,168,37,0.3)',borderRadius:'var(--radius-sm)',fontSize:'13px',color:'#F9A825',fontWeight:700}}>{fmt(firstAmt)}</div>
              <div style={{padding:'10px 14px',background:'rgba(0,230,118,0.06)',border:'1px solid rgba(0,230,118,0.2)',borderRadius:'var(--radius-sm)',fontSize:'13px',color:'var(--success)',fontWeight:700}}>{fmt(wAmt)}/wk</div>
              <button onClick={()=>setf('pricingTiers',settings.pricingTiers.filter((_,i)=>i!==idx))} style={{background:'rgba(255,61,0,0.1)',color:'var(--danger)',border:'none',width:'36px',height:'36px',borderRadius:'var(--radius-sm)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Trash2 size={14}/></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
