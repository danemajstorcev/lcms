import { useState, useMemo } from 'react';
import type { Invoice, Load, Broker } from '@/types';
import { formatCurrency, findById, nextId } from '@/utils/format';
import { usePagination } from '@/hooks/usePagination';
import KPICard from '@/components/ui/KPICard';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import SearchInput from '@/components/ui/SearchInput';
import TableShell from '@/components/ui/TableShell';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import InvoiceForm from '@/components/forms/InvoiceForm';

interface InvoicesPageProps {
  invoices:    Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  loads:       Load[];
  brokers:     Broker[];
}

type ModalState = { mode: 'add' } | { mode: 'edit'; invoice: Invoice } | null;

const HEADERS = ['Invoice #', 'Load', 'Broker', 'Amount', 'Issued', 'Due', 'Status', 'Action', ''];

export default function InvoicesPage({ invoices, setInvoices, loads, brokers }: InvoicesPageProps) {
  const [modal,        setModal]  = useState<ModalState>(null);
  const [searchQuery,  setSearch] = useState('');
  const [statusFilter, setStatus] = useState('All');

  const totalBilled = invoices.reduce((s, i) => s + i.amount, 0);
  const collected   = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices.filter((i) => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);
  const draftCount  = invoices.filter((i) => i.status === 'Draft').length;

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = !searchQuery || inv.num.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const { slice, page, setPage, total } = usePagination(filtered, 8);

  function handleSave(data: Omit<Invoice, 'id'>) {
    if (modal?.mode === 'add') {
      setInvoices((prev) => [...prev, { ...data, id: nextId(prev) }]);
    } else if (modal?.mode === 'edit') {
      setInvoices((prev) =>
        prev.map((i) => (i.id === modal.invoice.id ? { ...data, id: modal.invoice.id } : i))
      );
    }
    setModal(null);
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this invoice?')) return;
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  }

  function markAs(id: number, status: Invoice['status']) {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  return (
    <div className="fade-in">
      <div className="invoices-kpis">
        <KPICard label="Total Invoiced"  value={formatCurrency(totalBilled)}  sub={`${invoices.length} invoices`} accent />
        <KPICard label="Collected"       value={formatCurrency(collected)}    sub="paid invoices" />
        <KPICard label="Outstanding A/R" value={formatCurrency(outstanding)}  sub="pending collection" />
        <KPICard label="Drafts"          value={draftCount}                   sub="not yet sent" />
      </div>

      <PageHeader title="Invoices">
        <SearchInput value={searchQuery} onChange={setSearch} placeholder="Search invoices..." />
        <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} style={{ maxWidth: 140 }}>
          <option>All</option>
          <option>Draft</option>
          <option>Sent</option>
          <option>Paid</option>
        </select>
        <Button onClick={() => setModal({ mode: 'add' })}>+ New Invoice</Button>
      </PageHeader>

      <TableShell headers={HEADERS}>
        {slice.length === 0 && (
          <tr>
            <td colSpan={HEADERS.length} className="table__empty">NO INVOICES FOUND</td>
          </tr>
        )}
        {slice.map((inv) => {
          const load   = findById(loads, inv.lid);
          const broker = findById(brokers, inv.bid);
          return (
            <tr key={inv.id}>
              <td style={{ padding: '11px 14px' }} className="ff-mono fz-11 tc-accent fw-600">{inv.num}</td>
              <td style={{ padding: '11px 14px' }} className="ff-mono fz-12">{load?.num ?? '-'}</td>
              <td style={{ padding: '11px 14px', fontSize: 13 }}>{broker?.name ?? '-'}</td>
              <td style={{ padding: '11px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 600 }}>{formatCurrency(inv.amount)}</td>
              <td style={{ padding: '11px 14px' }} className="ff-mono fz-11 tc-sub">{inv.issued}</td>
              <td style={{ padding: '11px 14px' }} className="ff-mono fz-11 tc-sub">{inv.due}</td>
              <td style={{ padding: '11px 14px' }}><Badge value={inv.status} /></td>
              <td style={{ padding: '8px 10px' }}>
                {inv.status === 'Draft' && <Button sm variant="ghost" onClick={() => markAs(inv.id, 'Sent')}>Send</Button>}
                {inv.status === 'Sent'  && <Button sm variant="success" onClick={() => markAs(inv.id, 'Paid')}>Mark Paid</Button>}
              </td>
              <td style={{ padding: '6px 8px' }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  <IconButton onClick={() => setModal({ mode: 'edit', invoice: inv })} title="Edit">✎</IconButton>
                  <IconButton onClick={() => handleDelete(inv.id)} title="Delete" danger>✕</IconButton>
                </div>
              </td>
            </tr>
          );
        })}
      </TableShell>

      <Pagination page={page} total={total} setPage={setPage} />

      {modal && (
        <Modal title={modal.mode === 'edit' ? 'Edit Invoice' : 'New Invoice'} onClose={() => setModal(null)}>
          <InvoiceForm
            initial={modal.mode === 'edit' ? modal.invoice : {}}
            loads={loads}
            brokers={brokers}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
