export type LoadStatus = "Pending" | "In Transit" | "Delivered" | "Cancelled";
export type EntityStatus = "Active" | "Inactive";
export type InvoiceStatus = "Draft" | "Sent" | "Paid";
export type EquipmentType =
  | "Dry Van"
  | "Reefer"
  | "Flatbed"
  | "Step Deck"
  | "RGN";
export type Theme = "dark" | "light";
export type PageId =
  | "dashboard"
  | "dispatch"
  | "loads"
  | "carriers"
  | "drivers"
  | "brokers"
  | "invoices"
  | "reports";

export interface Broker {
  id: number;
  name: string;
  email: string;
  phone: string;
  mc: string;
}

export interface Carrier {
  id: number;
  name: string;
  email: string;
  phone: string;
  mc: string;
  dot: string;
  status: EntityStatus;
  equip: EquipmentType;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  email: string;
  cdl: string;
  st: string;
  status: EntityStatus;
  cid: number;
  miles: number;
}

export interface Load {
  id: number;
  num: string;
  bid: number;
  cid: number;
  oCity: string;
  oSt: string;
  dCity: string;
  dSt: string;
  pDate: string;
  dDate: string;
  rate: number;
  pay: number;
  status: LoadStatus;
  wt: number;
  mi: number;
}

export interface Invoice {
  id: number;
  num: string;
  lid: number;
  bid: number;
  amount: number;
  status: InvoiceStatus;
  due: string;
  issued: string;
}

export interface AppData {
  loads: Load[];
  setLoads: React.Dispatch<React.SetStateAction<Load[]>>;
  carriers: Carrier[];
  setCarriers: React.Dispatch<React.SetStateAction<Carrier[]>>;
  brokers: Broker[];
  setBrokers: React.Dispatch<React.SetStateAction<Broker[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

export interface NavItem {
  id: PageId;
  icon: string;
  label: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}
