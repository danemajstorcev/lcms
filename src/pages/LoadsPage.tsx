import { useState, useMemo } from 'react';
import type { Load, Carrier, Broker } from '@/types';
import { formatCurrency, calcProfit, calcMargin, marginColor, findById, nextId } from '@/utils/format';
import { usePagination } from '@/hooks/usePagination';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import SearchInput from '@/components/ui/SearchInput';
import TableShell from '@/components/ui/TableShell';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import LoadForm from '@/components/forms/LoadForm';

interface LoadsPageProps {
  loads:    Load[];
  setLoads: React.Dispatch<React.SetStateAction<Load[]>>;
  carriers: Carrier[];
  brokers:  Broker[];
}

type ModalState =
  | { mode: 'add' }
  | { mode: 'edit'; load: Load }
  | null;

const HEADERS = ['Load #', 'Broker', 'Carrier', 'Route', 'Pick / Del', 'Rate', 'Pay', 'Profit', 'Margin', 'Status', ''];

export default function LoadsPage({ loads, setLoads, carriers, brokers }: LoadsPageProps) {
  const [modal,        setModal]   = useState<ModalState>(null);
  const [searchQuery,  setSearch]  = useState('');
  const [statusFilter, setStatus]  = useState('All');

  const filtered = useMemo(() => {
    return loads.filter((load) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        load.num.toLowerCase().includes(q) ||
        load.oCity.toLowerCase().includes(q) ||
        load.dCity.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || load.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [loads, searchQuery, statusFilter]);

  const { slice, page, setPage, total } = usePagination(filtered, 8);

  function handleSave(data: Omit<Load, 'id'>) {
    if (modal?.mode === 'add') {
      setLoads((prev) => [...prev, { ...data, id: nextId(prev) }]);
    } else if (modal?.mode === 'edit') {
      setLoads((prev) => prev.map((l) => (l.id === modal.load.id ? { ...data, id: modal.load.id } : l)));
    }
    setModal(null);
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this load?')) return;
    setLoads((prev) => prev.filter((l) => l.id !== id));
  }

  const modalTitle    = modal?.mode === 'edit' ? 'Edit Load' : 'New Load';
  const modalInitial  = modal?.mode === 'edit' ? modal.load : {};

  return (
    <div className="fade-in">
      <PageHeader title="Loads">
        <SearchInput value={searchQuery} onChange={setSearch} placeholder="Search loads…" />
        <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} style={{ maxWidth: 150 }}>
          <option>All</option>
          <option>Pending</option>
          <option>In Transit</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        <Button onClick={() => setModal({ mode: 'add' })}>+ Add Load</Button>
      </PageHeader>

      <TableShell headers={HEADERS}>
        {slice.length === 0 && (
          <tr>
            <td colSpan={HEADERS.length} className="table__empty">NO LOADS FOUND</td>
          </tr>
        )}

        {slice.map((load) => {
          const profit  = calcProfit(load.rate, load.pay);
          const margin  = calcMargin(load.rate, load.pay);
          const broker  = findById(brokers, load.bid);
          const carrier = findById(carriers, load.cid);
          return (
            <tr key={load.id}>
              <td style={{ padding: '11px 14px' }} className="ff-mono fz-11 tc-accent fw-600">{load.num}</td>
              <td style={{ padding: '11px 14px', fontSize: 13 }}>{broker?.name ?? '—'}</td>
              <td style={{ padding: '11px 14px', fontSize: 13 }}>{carrier?.name ?? '—'}</td>
              <td style={{ padding: '11px 14px', fontSize: 12 }} className="tc-sub">
                {load.oCity}, {load.oSt} → {load.dCity}, {load.dSt}
              </td>
              <td style={{ padding: '11px 14px' }} className="ff-mono fz-11 tc-sub">
                {load.pDate}<br />{load.dDate}
              </td>
              <td style={{ padding: '11px 14px' }} className="ff-mono fz-13">{formatCurrency(load.rate)}</td>
              <td style={{ padding: '11px 14px' }} className="ff-mono fz-13 tc-sub">{formatCurrency(load.pay)}</td>
              <td style={{ padding: '11px 14px' }} className={`ff-mono fz-13 fw-600 ${profit >= 0 ? 'tc-success' : 'tc-danger'}`}>
                {formatCurrency(profit)}
              </td>
              <td style={{ padding: '11px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: marginColor(margin) }}>
                {margin}%
              </td>
              <td style={{ padding: '11px 14px' }}><Badge value={load.status} /></td>
              <td style={{ padding: '6px 8px' }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  <IconButton onClick={() => setModal({ mode: 'edit', load })} title="Edit">✎</IconButton>
                  <IconButton onClick={() => handleDelete(load.id)} title="Delete" danger>✕</IconButton>
                </div>
              </td>
            </tr>
          );
        })}
      </TableShell>

      <Pagination page={page} total={total} setPage={setPage} />

      {modal && (
        <Modal title={modalTitle} onClose={() => setModal(null)}>
          <LoadForm
            initial={modalInitial}
            brokers={brokers}
            carriers={carriers}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
