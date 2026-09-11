import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Truck, Loader2, AlertTriangle, X } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const [fees, setFees] = useState({
    ibadan: 2000,
    outsideIbadanDesc: 'Contact us on WhatsApp for delivery arrangement',
  });
  const [heroSettings, setHeroSettings] = useState({
    badge: 'Limited Season Offer — Book Now!',
    titlePrefix: 'Join the',
    words: 'December Rush',
    titleSuffix: 'Installment Plan',
    subtitle: 'Book your Christmas chickens early and pay in small weekly installments. Hormone-free birds raised on our farm — delivered to your door in Ibadan. Farm pickup always free.',
    priceRibbon: '₦1,500/wk',
    enabled: true
  });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  useEffect(() => {
    (async () => {
      try {
        const [snapDelivery, snapHero] = await Promise.all([
          getDoc(doc(db, 'settings', 'delivery_fees')),
          getDoc(doc(db, 'settings', 'hero_banner'))
        ]);
        if (snapDelivery.exists()) setFees(f => ({ ...f, ...snapDelivery.data() }));
        if (snapHero.exists()) setHeroSettings(h => ({ ...h, ...snapHero.data() }));
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    })();
  }, []);

  const save = async () => {
    setShowConfirm(false);
    setSaving(true);
    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'delivery_fees'), { ...fees, updatedAt: new Date() }, { merge: true }),
        setDoc(doc(db, 'settings', 'hero_banner'), { ...heroSettings, updatedAt: new Date() }, { merge: true })
      ]);
      showToast('Settings saved successfully!');
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const inp = { width: '100%', background: 'var(--dark)', border: '1.5px solid var(--dark-border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '14px', color: 'var(--white)', outline: 'none', boxSizing: 'border-box' };
  const lbl = { display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--gray-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' };
  const card = { background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '24px' };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}><Loader2 className="spinner" size={48} color="var(--primary)" /></div>;

  return (
    <div>
      {toast.show && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: toast.type === 'error' ? 'rgba(255,61,0,0.15)' : 'rgba(0,230,118,0.15)', border: '1px solid ' + (toast.type === 'error' ? 'var(--danger)' : 'var(--success)'), color: toast.type === 'error' ? '#ff8066' : 'var(--success)', padding: '12px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '14px', backdropFilter: 'blur(8px)' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Truck size={24} color="var(--primary)" /> Delivery Settings
          </h1>
          <p style={{ color: 'var(--gray-1)', fontSize: '13px', marginTop: '4px' }}>Manage delivery zones, fees and descriptions shown to customers at checkout.</p>
        </div>
        <button onClick={() => setShowConfirm(true)} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'var(--black)', padding: '12px 24px', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px var(--primary-glow)' }}>
          {saving ? <><Loader2 className="spinner" size={18} /> Saving...</> : <><Save size={18} /> Save Settings</>}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '32px', maxWidth: '440px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowConfirm(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--gray-1)', cursor: 'pointer' }}><X size={20} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(249,168,37,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={24} color="#F9A825" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px' }}>Confirm Settings Update</div>
                <div style={{ fontSize: '13px', color: 'var(--gray-1)', marginTop: '2px' }}>These changes will be visible to all customers immediately.</div>
              </div>
            </div>
            <div style={{ background: 'var(--black)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '24px', display: 'grid', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray-1)' }}>Ibadan Delivery Fee</span>
                <strong style={{ color: 'var(--primary)' }}>₦{Number(fees.ibadan).toLocaleString('en-NG')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray-1)' }}>Outside Ibadan Message</span>
                <span style={{ color: 'var(--white)', maxWidth: '200px', textAlign: 'right', fontSize: '12px' }}>{fees.outsideIbadanDesc}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '12px', background: 'var(--dark)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-sm)', color: 'var(--white)', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={save} style={{ flex: 2, padding: '12px', background: 'var(--primary)', color: 'var(--black)', borderRadius: 'var(--radius-sm)', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Save size={16} /> Confirm & Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Farm Pickup */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(0,230,118,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏠</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>Farm Pickup</div>
            <div style={{ fontSize: '12px', color: 'var(--gray-1)' }}>Always FREE — customers collect from the farm</div>
          </div>
          <div style={{ marginLeft: 'auto', background: 'rgba(0,230,118,0.1)', color: 'var(--success)', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '13px' }}>₦0 — FREE</div>
        </div>
      </div>

      {/* Within Ibadan */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(0,176,255,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚚</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>Within Ibadan Delivery</div>
            <div style={{ fontSize: '12px', color: 'var(--gray-1)' }}>We deliver to the customer's doorstep within Ibadan</div>
          </div>
        </div>
        <label style={lbl}>Delivery Fee (₦)</label>
        <input
          type="number"
          min="0"
          value={fees.ibadan}
          onChange={e => setFees(f => ({ ...f, ibadan: Number(e.target.value) }))}
          style={inp}
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--gray-2)' }}>
          Customers will see: <strong style={{ color: 'var(--white)' }}>₦{Number(fees.ibadan).toLocaleString('en-NG')}</strong> at checkout.
        </div>
      </div>

      {/* Outside Ibadan */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,152,0,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>Outside Ibadan</div>
            <div style={{ fontSize: '12px', color: 'var(--gray-1)' }}>Custom arrangement — edit the message shown to customers</div>
          </div>
        </div>
        <label style={lbl}>Description shown at Checkout</label>
        <input
          type="text"
          value={fees.outsideIbadanDesc}
          onChange={e => setFees(f => ({ ...f, outsideIbadanDesc: e.target.value }))}
          style={inp}
          placeholder="e.g. Contact us on WhatsApp for delivery arrangement"
        />
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, margin: '40px 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🖼️ Homepage Hero Banner Settings
      </h2>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>Enable Hero Banner</div>
            <div style={{ fontSize: '12px', color: 'var(--gray-1)' }}>Turn the banner on or off</div>
          </div>
          <input 
            type="checkbox" 
            checked={heroSettings.enabled}
            onChange={e => setHeroSettings(h => ({ ...h, enabled: e.target.checked }))}
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
          />
        </div>

        <label style={lbl}>Banner Badge (Small text at the top)</label>
        <input type="text" value={heroSettings.badge} onChange={e => setHeroSettings(h => ({ ...h, badge: e.target.value }))} style={{ ...inp, marginBottom: '16px' }} />

        <label style={lbl}>Title Prefix</label>
        <input type="text" value={heroSettings.titlePrefix} onChange={e => setHeroSettings(h => ({ ...h, titlePrefix: e.target.value }))} style={{ ...inp, marginBottom: '16px' }} />

        <label style={lbl}>Animated Words (Separated by space)</label>
        <input type="text" value={heroSettings.words} onChange={e => setHeroSettings(h => ({ ...h, words: e.target.value }))} style={{ ...inp, marginBottom: '16px' }} />

        <label style={lbl}>Title Suffix</label>
        <input type="text" value={heroSettings.titleSuffix} onChange={e => setHeroSettings(h => ({ ...h, titleSuffix: e.target.value }))} style={{ ...inp, marginBottom: '16px' }} />

        <label style={lbl}>Subtitle / Description</label>
        <textarea rows="3" value={heroSettings.subtitle} onChange={e => setHeroSettings(h => ({ ...h, subtitle: e.target.value }))} style={{ ...inp, marginBottom: '16px', resize: 'vertical' }} />

        <label style={lbl}>Starting Price Ribbon Text</label>
        <input type="text" value={heroSettings.priceRibbon} onChange={e => setHeroSettings(h => ({ ...h, priceRibbon: e.target.value }))} style={{ ...inp, marginBottom: '16px' }} />
      </div>
    </div>
  );
}
