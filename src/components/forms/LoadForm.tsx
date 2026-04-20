import { useState } from 'react';
import type { Load, Broker, Carrier } from '@/types';
import { calcMargin } from '@/utils/format';
import Button from '@/components/ui/Button';

interface LoadFormProps {
  initial:   Partial<Load>;
  brokers:   Broker[];
  carriers:  Carrier[];
  onSubmit:  (data: Omit<Load, 'id'>) => void;
  onCancel:  () => void;
}

const empty: Omit<Load, 'id'> = {
  num: '', bid: 0, cid: 0,
  oCity: '', oSt: '', dCity: '', dSt: '',
  pDate: '', dDate: '',
  rate: 0, pay: 0,
  status: 'Pending',
  wt: 0, mi: 0,
};

export default function LoadForm({ initial, brokers, carriers, onSubmit, onCancel }: LoadFormProps) {
  const [form, setForm] = useState<Omit<Load, 'id'>>({ ...empty, ...initial });

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const margin = form.rate > 0 ? calcMargin(form.rate, form.pay) : null;

  function handleSubmit() {
    if (!form.num.trim())  return alert('Load number is required.');
    if (!form.bid)         return alert('Please select a broker.');
    if (!form.cid)         return alert('Please select a carrier.');
    onSubmit(form);
  }

  return (
    <>
      <div className="modal__body">
        {/* Row 1 */}
        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Load Number *</label>
            <input value={form.num} onChange={(e) => set('num', e.target.value)} placeholder="CVL-10049" />
          </div>
          <div className="form-field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value as Load['status'])}>
              <option>Pending</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Broker *</label>
            <select value={form.bid || ''} onChange={(e) => set('bid', Number(e.target.value))}>
              <option value="">Select broker…</option>
              {brokers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Carrier *</label>
            <select value={form.cid || ''} onChange={(e) => set('cid', Number(e.target.value))}>
              <option value="">Select carrier…</option>
              {carriers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Row 3 — origin */}
        <div className="form-grid form-grid--2">
          <div className="form-grid form-grid--city">
            <div className="form-field">
              <label>Origin City</label>
              <input value={form.oCity} onChange={(e) => set('oCity', e.target.value)} placeholder="Dallas" />
            </div>
            <div className="form-field">
              <label>ST</label>
              <input value={form.oSt} onChange={(e) => set('oSt', e.target.value.toUpperCase())} placeholder="TX" maxLength={2} />
            </div>
          </div>
          <div className="form-grid form-grid--city">
            <div className="form-field">
              <label>Dest. City</label>
              <input value={form.dCity} onChange={(e) => set('dCity', e.target.value)} placeholder="Atlanta" />
            </div>
            <div className="form-field">
              <label>ST</label>
              <input value={form.dSt} onChange={(e) => set('dSt', e.target.value.toUpperCase())} placeholder="GA" maxLength={2} />
            </div>
          </div>
        </div>

        {/* Row 4 — dates */}
        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Pickup Date</label>
            <input type="date" value={form.pDate} onChange={(e) => set('pDate', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Delivery Date</label>
            <input type="date" value={form.dDate} onChange={(e) => set('dDate', e.target.value)} />
          </div>
        </div>

        {/* Row 5 — financials */}
        <div className="form-grid form-grid--4">
          <div className="form-field">
            <label>Rate ($)</label>
            <input type="number" value={form.rate || ''} onChange={(e) => set('rate', Number(e.target.value))} placeholder="3200" />
          </div>
          <div className="form-field">
            <label>Carrier Pay ($)</label>
            <input type="number" value={form.pay || ''} onChange={(e) => set('pay', Number(e.target.value))} placeholder="2600" />
          </div>
          <div className="form-field">
            <label>Weight (lbs)</label>
            <input type="number" value={form.wt || ''} onChange={(e) => set('wt', Number(e.target.value))} placeholder="42000" />
          </div>
          <div className="form-field">
            <label>Miles</label>
            <input type="number" value={form.mi || ''} onChange={(e) => set('mi', Number(e.target.value))} placeholder="781" />
          </div>
        </div>

        {/* Live margin indicator */}
        {margin !== null && (
          <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>
            Margin preview:{' '}
            <span
              className="ff-mono fw-600"
              style={{ color: margin >= 15 ? 'var(--clr-success)' : margin >= 8 ? 'var(--clr-warn)' : 'var(--clr-danger)' }}
            >
              {margin}%
            </span>
          </div>
        )}
      </div>

      <div className="modal__footer">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>
          {initial.id ? 'Save Changes' : 'Add Load'}
        </Button>
      </div>
    </>
  );
}
