import { useState, useMemo } from "react";
import type { Broker, Load } from "@/types";
import { formatCurrency, calcProfit, nextId } from "@/utils/format";
import { usePagination } from "@/hooks/usePagination";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import SearchInput from "@/components/ui/SearchInput";
import TableShell from "@/components/ui/TableShell";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import BrokerForm from "@/components/forms/BrokerForm";

interface BrokersPageProps {
  brokers: Broker[];
  setBrokers: React.Dispatch<React.SetStateAction<Broker[]>>;
  loads: Load[];
}

type ModalState = { mode: "add" } | { mode: "edit"; broker: Broker } | null;

const HEADERS = [
  "Company",
  "Email",
  "Phone",
  "MC Number",
  "Loads",
  "Revenue",
  "Profit",
  "",
];

export default function BrokersPage({
  brokers,
  setBrokers,
  loads,
}: BrokersPageProps) {
  const [modal, setModal] = useState<ModalState>(null);
  const [searchQuery, setSearch] = useState("");

  const filtered = useMemo(() => {
    return brokers.filter(
      (b) =>
        !searchQuery ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [brokers, searchQuery]);

  const { slice, page, setPage, total } = usePagination(filtered, 8);

  function handleSave(data: Omit<Broker, "id">) {
    if (modal?.mode === "add") {
      setBrokers((prev) => [...prev, { ...data, id: nextId(prev) }]);
    } else if (modal?.mode === "edit") {
      setBrokers((prev) =>
        prev.map((b) =>
          b.id === modal.broker.id ? { ...data, id: modal.broker.id } : b,
        ),
      );
    }
    setModal(null);
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this broker?")) return;
    setBrokers((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="fade-in">
      <PageHeader title="Brokers">
        <SearchInput
          value={searchQuery}
          onChange={setSearch}
          placeholder="Search brokers…"
        />
        <Button onClick={() => setModal({ mode: "add" })}>+ Add Broker</Button>
      </PageHeader>

      <TableShell headers={HEADERS}>
        {slice.length === 0 && (
          <tr>
            <td colSpan={HEADERS.length} className="table__empty">
              NO BROKERS FOUND
            </td>
          </tr>
        )}
        {slice.map((broker) => {
          const brokerLoads = loads.filter((l) => l.bid === broker.id);
          const totalRevenue = brokerLoads.reduce((s, l) => s + l.rate, 0);
          const totalProfit = brokerLoads.reduce(
            (s, l) => s + calcProfit(l.rate, l.pay),
            0,
          );
          return (
            <tr key={broker.id}>
              <td
                style={{ padding: "12px 14px", fontWeight: 600, fontSize: 14 }}
              >
                {broker.name}
              </td>
              <td
                style={{ padding: "12px 14px", fontSize: 13 }}
                className="tc-sub"
              >
                {broker.email}
              </td>
              <td style={{ padding: "12px 14px", fontSize: 13 }}>
                {broker.phone}
              </td>
              <td
                style={{ padding: "12px 14px" }}
                className="ff-mono fz-12 tc-accent"
              >
                {broker.mc}
              </td>
              <td style={{ padding: "12px 14px" }} className="ff-mono fz-13">
                {brokerLoads.length}
              </td>
              <td style={{ padding: "12px 14px" }} className="ff-mono fz-13">
                {formatCurrency(totalRevenue)}
              </td>
              <td
                style={{ padding: "12px 14px" }}
                className="ff-mono fz-13 tc-success"
              >
                {formatCurrency(totalProfit)}
              </td>
              <td style={{ padding: "6px 8px" }}>
                <div style={{ display: "flex", gap: 2 }}>
                  <IconButton
                    onClick={() => setModal({ mode: "edit", broker })}
                    title="Edit"
                  >
                    ✎
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(broker.id)}
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
          title={modal.mode === "edit" ? "Edit Broker" : "New Broker"}
          onClose={() => setModal(null)}
        >
          <BrokerForm
            initial={modal.mode === "edit" ? modal.broker : {}}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
