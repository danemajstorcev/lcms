import { useState } from 'react';
import type { Carrier } from '@/types';
import Button from '@/components/ui/Button';

interface CarrierFormProps {
  initial:  Partial<Carrier>;
  onSubmit: (data: Omit<Carrier, 'id'>) => void;
  onCancel: () => void;
}

const empty: Omit<Carrier, 'id'> = {
  name: '', email: '', phone: '', mc: '', dot: '',
  status: 'Active', equip: 'Dry Van',
};

const EQUIPMENT_TYPES: Carrier['equip'][] = ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'RGN'];

export default function CarrierForm({ initial, onSubmit, onCancel }: CarrierFormProps) {
  const [form, setForm] = useState<Omit<Carrier, 'id'>>({ ...empty, ...initial });

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit() {
    if (!form.name.trim()) return alert('Company name is required.');
    onSubmit(form);
  }

  return (
    <>
      <div className="modal__body">
        <div className="form-field">
          <label>Company Name *</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Swift Freight LLC" />
        </div>

        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="ops@carrier.com" />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 000-0000" />
          </div>
        </div>

        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>MC Number</label>
            <input value={form.mc} onChange={(e) => set('mc', e.target.value)} placeholder="MC-000000" />
          </div>
          <div className="form-field">
            <label>DOT Number</label>
            <input value={form.dot} onChange={(e) => set('dot', e.target.value)} placeholder="DOT-0000000" />
          </div>
        </div>

        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Equipment Type</label>
            <select value={form.equip} onChange={(e) => set('equip', e.target.value as Carrier['equip'])}>
              {EQUIPMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value as Carrier['status'])}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="modal__footer">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>
          {initial.id ? 'Save Changes' : 'Add Carrier'}
        </Button>
      </div>
    </>
  );
}
