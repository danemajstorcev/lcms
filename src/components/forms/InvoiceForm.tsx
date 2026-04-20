import { useState } from 'react';
import type { Invoice, Load, Broker } from '@/types';
import Button from '@/components/ui/Button';

interface InvoiceFormProps {
  initial:  Partial<Invoice>;
  loads:    Load[];
  brokers:  Broker[];
  onSubmit: (data: Omit<Invoice, 'id'>) => void;
  onCancel: () => void;
}

const today = new Date().toISOString().slice(0, 10);

const empty: Omit<Invoice, 'id'> = {
  num: '', lid: 0, bid: 0,
  amount: 0, status: 'Draft',
  due: '', issued: today,
};

export default function InvoiceForm({ initial, loads, brokers, onSubmit, onCancel }: InvoiceFormProps) {
  const [form, setForm] = useState<Omit<Invoice, 'id'>>({ ...empty, ...initial });

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  // Auto-fill amount from selected load rate
  function handleLoadChange(lid: number) {
    const load = loads.find((l) => l.id === lid);
    setForm((prev) => ({
      ...prev,
      lid,
      amount: load ? load.rate : prev.amount,
      bid:    load ? load.bid  : prev.bid,
    }));
  }

  function handleSubmit() {
    if (!form.num.trim()) return alert('Invoice number is required.');
    if (!form.lid)        return alert('Please select a load.');
    if (!form.bid)        return alert('Please select a broker.');
    if (!form.amount)     return alert('Amount is required.');
    onSubmit(form);
  }

  return (
    <>
      <div className="modal__body">
        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Invoice Number *</label>
            <input value={form.num} onChange={(e) => set('num', e.target.value)} placeholder="INV-2025-008" />
          </div>
          <div className="form-field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value as Invoice['status'])}>
              <option>Draft</option>
              <option>Sent</option>
              <option>Paid</option>
            </select>
          </div>
        </div>

        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Load *</label>
            <select value={form.lid || ''} onChange={(e) => handleLoadChange(Number(e.target.value))}>
              <option value="">Select load…</option>
              {loads.map((l) => <option key={l.id} value={l.id}>{l.num}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Broker *</label>
            <select value={form.bid || ''} onChange={(e) => set('bid', Number(e.target.value))}>
              <option value="">Select broker…</option>
              {brokers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-grid form-grid--3">
          <div className="form-field">
            <label>Amount ($) *</label>
            <input type="number" value={form.amount || ''} onChange={(e) => set('amount', Number(e.target.value))} placeholder="3200" />
          </div>
          <div className="form-field">
            <label>Issue Date</label>
            <input type="date" value={form.issued} onChange={(e) => set('issued', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Due Date</label>
            <input type="date" value={form.due} onChange={(e) => set('due', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="modal__footer">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>
          {initial.id ? 'Save Changes' : 'Create Invoice'}
        </Button>
      </div>
    </>
  );
}
