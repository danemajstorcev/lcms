import { useState, useMemo } from "react";
import type { Carrier, Load } from "@/types";
import { nextId } from "@/utils/format";
import { usePagination } from "@/hooks/usePagination";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import SearchInput from "@/components/ui/SearchInput";
import TableShell from "@/components/ui/TableShell";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import EquipBadge from "@/components/ui/EquipBadge";
import Modal from "@/components/ui/Modal";
import CarrierForm from "@/components/forms/CarrierForm";

interface CarriersPageProps {
  carriers: Carrier[];
  setCarriers: React.Dispatch<React.SetStateAction<Carrier[]>>;
  loads: Load[];
}

type ModalState = { mode: "add" } | { mode: "edit"; carrier: Carrier } | null;

const HEADERS = [
  "Company",
  "Contact",
  "MC / DOT",
  "Equipment",
  "Loads",
  "Status",
  "",
];

export default function CarriersPage({
  carriers,
  setCarriers,
  loads,
}: CarriersPageProps) {
  const [modal, setModal] = useState<ModalState>(null);
  const [searchQuery, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("All");
  const [equipFilter, setEquip] = useState("All");

  const filtered = useMemo(() => {
    return carriers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(q) ||
        c.mc.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesEquip = equipFilter === "All" || c.equip === equipFilter;
      return matchesSearch && matchesStatus && matchesEquip;
    });
  }, [carriers, searchQuery, statusFilter, equipFilter]);

  const { slice, page, setPage, total } = usePagination(filtered, 8);

  function handleSave(data: Omit<Carrier, "id">) {
    if (modal?.mode === "add") {
      setCarriers((prev) => [...prev, { ...data, id: nextId(prev) }]);
    } else if (modal?.mode === "edit") {
      setCarriers((prev) =>
        prev.map((c) =>
          c.id === modal.carrier.id ? { ...data, id: modal.carrier.id } : c,
        ),
      );
    }
    setModal(null);
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this carrier?")) return;
    setCarriers((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="fade-in">
      <PageHeader title="Carriers">
        <SearchInput
          value={searchQuery}
          onChange={setSearch}
          placeholder="Search carriers…"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
          style={{ maxWidth: 130 }}
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <select
          value={equipFilter}
          onChange={(e) => setEquip(e.target.value)}
          style={{ maxWidth: 145 }}
        >
          <option value="All">All Equipment</option>
          {["Dry Van", "Reefer", "Flatbed", "Step Deck", "RGN"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <Button onClick={() => setModal({ mode: "add" })}>+ Add Carrier</Button>
      </PageHeader>

      <TableShell headers={HEADERS}>
        {slice.length === 0 && (
          <tr>
            <td colSpan={HEADERS.length} className="table__empty">
              NO CARRIERS FOUND
            </td>
          </tr>
        )}
        {slice.map((carrier) => {
          const carrierLoads = loads.filter((l) => l.cid === carrier.id).length;
          return (
            <tr key={carrier.id}>
              <td
                style={{ padding: "12px 14px", fontWeight: 600, fontSize: 14 }}
              >
                {carrier.name}
              </td>
              <td style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 13 }}>{carrier.email}</div>
                <div className="fz-12 tc-sub">{carrier.phone}</div>
              </td>
              <td style={{ padding: "12px 14px" }} className="ff-mono fz-11">
                <div className="tc-accent">{carrier.mc}</div>
                <div className="tc-sub">{carrier.dot}</div>
              </td>
              <td style={{ padding: "12px 14px" }}>
                <EquipBadge value={carrier.equip} />
              </td>
              <td style={{ padding: "12px 14px" }} className="ff-mono fz-13">
                {carrierLoads}
              </td>
              <td style={{ padding: "12px 14px" }}>
                <Badge value={carrier.status} />
              </td>
              <td style={{ padding: "6px 8px" }}>
                <div style={{ display: "flex", gap: 2 }}>
                  <IconButton
                    onClick={() => setModal({ mode: "edit", carrier })}
                    title="Edit"
                  >
                    ✎
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(carrier.id)}
                    title="Delete"
                    danger
                  >
                    ✕
                  </IconButton>
                </div>
              </td>
            </tr>
          );
        })}
      </TableShell>

      <Pagination page={page} total={total} setPage={setPage} />

      {modal && (
        <Modal
          title={modal.mode === "edit" ? "Edit Carrier" : "New Carrier"}
          onClose={() => setModal(null)}
        >
          <CarrierForm
            initial={modal.mode === "edit" ? modal.carrier : {}}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
