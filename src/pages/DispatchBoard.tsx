import { useState } from "react";
import type { Load, Carrier, Broker, LoadStatus } from "@/types";
import { formatCurrency, calcProfit, findById } from "@/utils/format";
import Modal from "@/components/ui/Modal";
import LoadForm from "@/components/forms/LoadForm";
import IconButton from "@/components/ui/IconButton";
import PageHeader from "@/components/ui/PageHeader";

interface DispatchBoardProps {
  loads: Load[];
  setLoads: React.Dispatch<React.SetStateAction<Load[]>>;
  carriers: Carrier[];
  brokers: Broker[];
}

interface KanbanColumn {
  status: LoadStatus;
  label: string;
  color: string;
}

const COLUMNS: KanbanColumn[] = [
  { status: "Pending", label: "Booked", color: "#fb923c" },
  { status: "In Transit", label: "Rolling", color: "#38bdf8" },
  { status: "Delivered", label: "Delivered", color: "#22c55e" },
  { status: "Cancelled", label: "Cancelled", color: "#ef4444" },
];

interface EditState {
  load: Load;
}

export default function DispatchBoard({
  loads,
  setLoads,
  carriers,
  brokers,
}: DispatchBoardProps) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overStatus, setOverStatus] = useState<LoadStatus | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);

  function handleDrop(status: LoadStatus) {
    if (draggingId == null) return;
    setLoads((prev) =>
      prev.map((l) => (l.id === draggingId ? { ...l, status } : l)),
    );
    setDraggingId(null);
    setOverStatus(null);
  }

  function handleSave(data: Omit<Load, "id">) {
    if (!editing) return;
    setLoads((prev) =>
      prev.map((l) => (l.id === editing.load.id ? { ...l, ...data } : l)),
    );
    setEditing(null);
  }

  return (
    <div className="fade-in">
      <PageHeader title="Dispatch Board">
        <span style={{ fontSize: 12, color: "var(--text-sub)" }}>
          Drag cards between columns to update status
        </span>
      </PageHeader>

      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const colLoads = loads.filter((l) => l.status === col.status);
          const isOver = overStatus === col.status;

          return (
            <div
              key={col.status}
              className={`kanban-col${isOver ? " kanban-col--over" : ""}`}
              style={{
                borderTop: `3px solid ${col.color}`,
                borderColor: isOver ? col.color : undefined,
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setOverStatus(col.status);
              }}
              onDragLeave={() => setOverStatus(null)}
              onDrop={() => handleDrop(col.status)}
            >
              <div className="kanban-col__header">
                <span className="kanban-col__name">{col.label}</span>
                <span
                  className="kanban-col__count"
                  style={{
                    background: `${col.color}22`,
                    color: col.color,
                    borderColor: `${col.color}44`,
                  }}
                >
                  {colLoads.length}
                </span>
              </div>

              {colLoads.length === 0 && (
                <div className="kanban-col__empty">DROP HERE</div>
              )}

              {colLoads.map((load) => {
                const carrier = findById(carriers, load.cid);
                const profit = calcProfit(load.rate, load.pay);
                return (
                  <div
                    key={load.id}
                    className="kanban-card"
                    draggable
                    onDragStart={() => setDraggingId(load.id)}
                    onDragEnd={() => setDraggingId(null)}
                  >
                    <div className="kanban-card__top">
                      <span className="kanban-card__num">{load.num}</span>
                      <IconButton
                        onClick={() => setEditing({ load })}
                        title="Edit load"
                      >
                        ✎
                      </IconButton>
                    </div>

                    <div className="kanban-card__route">
                      {load.oCity}, {load.oSt}{" "}
                      <span className="tc-muted">→</span> {load.dCity},{" "}
                      {load.dSt}
                    </div>

                    <div className="kanban-card__meta">
                      {carrier?.name ?? "Unassigned"} ·{" "}
                      {load.mi.toLocaleString()} mi
                    </div>

                    <div className="kanban-card__bottom">
                      <span className="kanban-card__rate">
                        {formatCurrency(load.rate)}
                      </span>
                      <span
                        className="kanban-card__profit"
                        style={{
                          color:
                            profit >= 0
                              ? "var(--clr-success)"
                              : "var(--clr-danger)",
                        }}
                      >
                        +{formatCurrency(profit)}
                      </span>
                    </div>

                    <div className="kanban-card__dates">
                      {load.pDate} → {load.dDate}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {editing && (
        <Modal title="Edit Load" onClose={() => setEditing(null)}>
          <LoadForm
            initial={editing.load}
            brokers={brokers}
            carriers={carriers}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
