import { useState } from "react";
import type { Driver, Carrier } from "@/types";
import Button from "@/components/ui/Button";

interface DriverFormProps {
  initial: Partial<Driver>;
  carriers: Carrier[];
  onSubmit: (data: Omit<Driver, "id">) => void;
  onCancel: () => void;
}

const empty: Omit<Driver, "id"> = {
  name: "",
  phone: "",
  email: "",
  cdl: "",
  st: "",
  status: "Active",
  cid: 0,
  miles: 0,
};

export default function DriverForm({
  initial,
  carriers,
  onSubmit,
  onCancel,
}: DriverFormProps) {
  const [form, setForm] = useState<Omit<Driver, "id">>({
    ...empty,
    ...initial,
  });

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit() {
    if (!form.name.trim()) return alert("Driver name is required.");
    onSubmit(form);
  }

  return (
    <>
      <div className="modal__body">
        <div className="form-field">
          <label>Full Name *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="John Smith"
          />
        </div>

        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="driver@email.com"
            />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(555) 000-0000"
            />
          </div>
        </div>

        <div className="form-grid form-grid--city">
          <div className="form-field">
            <label>CDL Number</label>
            <input
              value={form.cdl}
              onChange={(e) => set("cdl", e.target.value)}
              placeholder="TX-CDL-123456"
            />
          </div>
          <div className="form-field">
            <label>State</label>
            <input
              value={form.st}
              onChange={(e) => set("st", e.target.value.toUpperCase())}
              placeholder="TX"
              maxLength={2}
            />
          </div>
        </div>

        <div className="form-grid form-grid--2">
          <div className="form-field">
            <label>Carrier</label>
            <select
              value={form.cid || ""}
              onChange={(e) => set("cid", Number(e.target.value))}
            >
              <option value={0}>Unassigned</option>
              {carriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                set("status", e.target.value as Driver["status"])
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="modal__footer">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initial.id ? "Save Changes" : "Add Driver"}
        </Button>
      </div>
    </>
  );
}
