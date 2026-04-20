import { useState, useMemo } from "react";
import type { Driver, Carrier } from "@/types";
import { findById, nextId } from "@/utils/format";
import { usePagination } from "@/hooks/usePagination";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import SearchInput from "@/components/ui/SearchInput";
import TableShell from "@/components/ui/TableShell";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import DriverForm from "@/components/forms/DriverForm";

interface DriversPageProps {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  carriers: Carrier[];
}

type ModalState = { mode: "add" } | { mode: "edit"; driver: Driver } | null;

const HEADERS = [
  "Driver",
  "Contact",
  "CDL / State",
  "Carrier",
  "Miles",
  "Status",
  "",
];

export default function DriversPage({
  drivers,
  setDrivers,
  carriers,
}: DriversPageProps) {
  const [modal, setModal] = useState<ModalState>(null);
  const [searchQuery, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const matchesSearch =
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchQuery, statusFilter]);

  const { slice, page, setPage, total } = usePagination(filtered, 8);

  function handleSave(data: Omit<Driver, "id">) {
    if (modal?.mode === "add") {
      setDrivers((prev) => [...prev, { ...data, id: nextId(prev) }]);
    } else if (modal?.mode === "edit") {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === modal.driver.id ? { ...data, id: modal.driver.id } : d,
        ),
      );
    }
    setModal(null);
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this driver?")) return;
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="fade-in">
      <PageHeader title="Drivers">
        <SearchInput
          value={searchQuery}
          onChange={setSearch}
          placeholder="Search drivers…"
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
        <Button onClick={() => setModal({ mode: "add" })}>+ Add Driver</Button>
      </PageHeader>

      <TableShell headers={HEADERS}>
        {slice.length === 0 && (
          <tr>
            <td colSpan={HEADERS.length} className="table__empty">
              NO DRIVERS FOUND
            </td>
          </tr>
        )}
        {slice.map((driver) => {
          const carrier = findById(carriers, driver.cid);
          return (
            <tr key={driver.id}>
              <td
                style={{ padding: "12px 14px", fontWeight: 600, fontSize: 14 }}
              >
                {driver.name}
              </td>
              <td style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 13 }}>{driver.email}</div>
                <div className="fz-12 tc-sub">{driver.phone}</div>
              </td>
              <td style={{ padding: "12px 14px" }} className="ff-mono fz-11">
                <div style={{ color: "var(--clr-info)" }}>{driver.cdl}</div>
                <div className="tc-sub">{driver.st}</div>
              </td>
              <td style={{ padding: "12px 14px", fontSize: 13 }}>
                {carrier ? (
                  carrier.name
                ) : (
                  <span className="tc-muted">Unassigned</span>
                )}
              </td>
              <td style={{ padding: "12px 14px" }} className="ff-mono fz-13">
                {driver.miles.toLocaleString()}
              </td>
              <td style={{ padding: "12px 14px" }}>
                <Badge value={driver.status} />
              </td>
              <td style={{ padding: "6px 8px" }}>
                <div style={{ display: "flex", gap: 2 }}>
                  <IconButton
                    onClick={() => setModal({ mode: "edit", driver })}
                    title="Edit"
                  >
                    ✎
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(driver.id)}
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
          title={modal.mode === "edit" ? "Edit Driver" : "New Driver"}
          onClose={() => setModal(null)}
        >
          <DriverForm
            initial={modal.mode === "edit" ? modal.driver : {}}
            carriers={carriers}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
