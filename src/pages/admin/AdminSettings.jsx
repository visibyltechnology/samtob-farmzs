import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Truck, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const [fees, setFees] = useState({
    ibadan: 2000,
    outsideIbadanDesc: 'Contact us on WhatsApp for delivery arrangement',
  });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'delivery_fees'));
        if (snap.exists()) setFees(f => ({ ...f, ...snap.data() }));
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'delivery_fees'), { ...fees, updatedAt: new Date() }, { merge: true });
      showToast('Delivery settings saved!');
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
        <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'var(--black)', padding: '12px 24px', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px var(--primary-glow)' }}>
          {saving ? <><Loader2 className="spinner" size={18} /> Saving...</> : <><Save size={18} /> Save Settings</>}
        </button>
      </div>

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
    </div>
  );
}
