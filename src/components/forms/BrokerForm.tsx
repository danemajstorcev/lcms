import { useState } from 'react';
import type { Broker } from '@/types';
import Button from '@/components/ui/Button';

interface BrokerFormProps {
  initial:  Partial<Broker>;
  onSubmit: (data: Omit<Broker, 'id'>) => void;
  onCancel: () => void;
}

const empty: Omit<Broker, 'id'> = {
  name: '', email: '', phone: '', mc: '',
};

export default function BrokerForm({ initial, onSubmit, onCancel }: BrokerFormProps) {
  const [form, setForm] = useState<Omit<Broker, 'id'>>({ ...empty, ...initial });

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
          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Echo Global Logistics" />
        </div>

        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="dispatch@broker.com" />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 000-0000" />
          </div>
        </div>

        <div className="form-field">
          <label>MC Number</label>
          <input value={form.mc} onChange={(e) => set('mc', e.target.value)} placeholder="MC-000000" />
        </div>
      </div>

      <div className="modal__footer">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>
          {initial.id ? 'Save Changes' : 'Add Broker'}
        </Button>
      </div>
    </>
  );
}
