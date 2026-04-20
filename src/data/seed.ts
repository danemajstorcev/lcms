import type { Broker, Carrier, Driver, Load, Invoice } from '@/types';

export const initialBrokers: Broker[] = [
  { id: 1, name: 'Echo Global Logistics',    email: 'dispatch@echo.com',   phone: '(312) 555-0101', mc: 'MC-487210' },
  { id: 2, name: 'Coyote Logistics',         email: 'loads@coyote.com',    phone: '(773) 555-0182', mc: 'MC-521334' },
  { id: 3, name: 'CH Robinson',              email: 'ops@chrobinson.com',  phone: '(952) 555-0144', mc: 'MC-309860' },
  { id: 4, name: 'Total Quality Logistics',  email: 'freight@tql.com',     phone: '(513) 555-0199', mc: 'MC-488192' },
];

export const initialCarriers: Carrier[] = [
  { id: 1, name: 'Swift Freight LLC',  email: 'ops@swiftfreight.com',   phone: '(602) 555-0131', mc: 'MC-211774', dot: 'DOT-1182344', status: 'Active',   equip: 'Dry Van'   },
  { id: 2, name: 'Iron Road Trucking', email: 'dispatch@ironroad.com',  phone: '(214) 555-0167', mc: 'MC-399210', dot: 'DOT-2341892', status: 'Active',   equip: 'Flatbed'   },
  { id: 3, name: 'Arctic Reefer Co.',  email: 'loads@arcticreefer.com', phone: '(503) 555-0122', mc: 'MC-512009', dot: 'DOT-3122451', status: 'Active',   equip: 'Reefer'    },
  { id: 4, name: 'Prairie Haul Inc.',  email: 'info@prairiehaul.com',   phone: '(701) 555-0188', mc: 'MC-448771', dot: 'DOT-1934411', status: 'Inactive', equip: 'Dry Van'   },
  { id: 5, name: 'Coastal Step Deck',  email: 'ops@coastalstep.com',    phone: '(904) 555-0155', mc: 'MC-477622', dot: 'DOT-2811200', status: 'Active',   equip: 'Step Deck' },
];

export const initialDrivers: Driver[] = [
  { id: 1, name: 'Marcus Webb',   phone: '(602) 555-0211', email: 'm.webb@email.com',   cdl: 'AZ-CDL-112233', st: 'AZ', status: 'Active',   cid: 1, miles: 48200 },
  { id: 2, name: 'Tony Reyes',    phone: '(214) 555-0244', email: 't.reyes@email.com',  cdl: 'TX-CDL-224411', st: 'TX', status: 'Active',   cid: 2, miles: 61400 },
  { id: 3, name: 'Dana Frost',    phone: '(503) 555-0278', email: 'd.frost@email.com',  cdl: 'OR-CDL-338821', st: 'OR', status: 'Active',   cid: 3, miles: 39800 },
  { id: 4, name: 'Al Petrov',     phone: '(701) 555-0299', email: 'a.petrov@email.com', cdl: 'ND-CDL-441122', st: 'ND', status: 'Inactive', cid: 4, miles: 22100 },
  { id: 5, name: 'Jesse Tran',    phone: '(904) 555-0265', email: 'j.tran@email.com',   cdl: 'FL-CDL-552299', st: 'FL', status: 'Active',   cid: 5, miles: 55600 },
  { id: 6, name: 'Rita Okonkwo',  phone: '(602) 555-0388', email: 'r.okonkwo@email.com',cdl: 'AZ-CDL-663344', st: 'AZ', status: 'Active',   cid: 1, miles: 43300 },
];

export const initialLoads: Load[] = [
  { id: 1, num: 'CVL-10041', bid: 1, cid: 1, oCity: 'Dallas',       oSt: 'TX', dCity: 'Atlanta',        dSt: 'GA', pDate: '2025-04-14', dDate: '2025-04-16', rate: 3200, pay: 2600, status: 'Delivered',  wt: 42000, mi: 781  },
  { id: 2, num: 'CVL-10042', bid: 2, cid: 3, oCity: 'Chicago',      oSt: 'IL', dCity: 'Miami',          dSt: 'FL', pDate: '2025-04-15', dDate: '2025-04-17', rate: 4800, pay: 3900, status: 'In Transit', wt: 38500, mi: 1380 },
  { id: 3, num: 'CVL-10043', bid: 3, cid: 2, oCity: 'Los Angeles',  oSt: 'CA', dCity: 'Denver',         dSt: 'CO', pDate: '2025-04-16', dDate: '2025-04-18', rate: 3600, pay: 2900, status: 'Pending',    wt: 44000, mi: 1023 },
  { id: 4, num: 'CVL-10044', bid: 4, cid: 5, oCity: 'Phoenix',      oSt: 'AZ', dCity: 'Houston',        dSt: 'TX', pDate: '2025-04-13', dDate: '2025-04-15', rate: 2900, pay: 2300, status: 'Delivered',  wt: 36000, mi: 868  },
  { id: 5, num: 'CVL-10045', bid: 1, cid: 1, oCity: 'New York',     oSt: 'NY', dCity: 'Charlotte',      dSt: 'NC', pDate: '2025-04-17', dDate: '2025-04-19', rate: 3100, pay: 2500, status: 'Pending',    wt: 40000, mi: 632  },
  { id: 6, num: 'CVL-10046', bid: 2, cid: 4, oCity: 'Seattle',      oSt: 'WA', dCity: 'Salt Lake City', dSt: 'UT', pDate: '2025-04-12', dDate: '2025-04-14', rate: 2700, pay: 2200, status: 'Cancelled',  wt: 35000, mi: 840  },
  { id: 7, num: 'CVL-10047', bid: 3, cid: 3, oCity: 'Minneapolis',  oSt: 'MN', dCity: 'Kansas City',    dSt: 'MO', pDate: '2025-04-18', dDate: '2025-04-19', rate: 2400, pay: 1900, status: 'In Transit', wt: 39000, mi: 442  },
  { id: 8, num: 'CVL-10048', bid: 4, cid: 2, oCity: 'Nashville',    oSt: 'TN', dCity: 'Columbus',       dSt: 'OH', pDate: '2025-04-19', dDate: '2025-04-20', rate: 1900, pay: 1500, status: 'Pending',    wt: 32000, mi: 294  },
];

export const initialInvoices: Invoice[] = [
  { id: 1, num: 'INV-2025-001', lid: 1, bid: 1, amount: 3200, status: 'Paid',  due: '2025-04-28', issued: '2025-04-16' },
  { id: 2, num: 'INV-2025-002', lid: 2, bid: 2, amount: 4800, status: 'Sent',  due: '2025-05-01', issued: '2025-04-17' },
  { id: 3, num: 'INV-2025-003', lid: 3, bid: 3, amount: 3600, status: 'Draft', due: '2025-05-05', issued: '2025-04-18' },
  { id: 4, num: 'INV-2025-004', lid: 4, bid: 4, amount: 2900, status: 'Paid',  due: '2025-04-29', issued: '2025-04-15' },
  { id: 5, num: 'INV-2025-005', lid: 5, bid: 1, amount: 3100, status: 'Draft', due: '2025-05-06', issued: '2025-04-19' },
  { id: 6, num: 'INV-2025-006', lid: 7, bid: 3, amount: 2400, status: 'Sent',  due: '2025-05-03', issued: '2025-04-19' },
  { id: 7, num: 'INV-2025-007', lid: 8, bid: 4, amount: 1900, status: 'Draft', due: '2025-05-07', issued: '2025-04-19' },
];

export const monthlyChartData = [
  { month: 'Nov', revenue: 18400, profit: 3820, loads: 5 },
  { month: 'Dec', revenue: 22100, profit: 4950, loads: 6 },
  { month: 'Jan', revenue: 19800, profit: 4200, loads: 5 },
  { month: 'Feb', revenue: 26500, profit: 5800, loads: 7 },
  { month: 'Mar', revenue: 31200, profit: 7100, loads: 8 },
  { month: 'Apr', revenue: 24600, profit: 5400, loads: 8 },
];

export const activityFeed = [
  { id: 1, msg: 'CVL-10048 booked — Nashville → Columbus',        time: '2h ago',  dot: '#F59E0B' },
  { id: 2, msg: 'INV-2025-004 marked Paid by TQL',                time: '3h ago',  dot: '#22C55E' },
  { id: 3, msg: 'Carrier Arctic Reefer Co. profile updated',      time: '5h ago',  dot: '#38BDF8' },
  { id: 4, msg: 'CVL-10042 status changed → In Transit',          time: '7h ago',  dot: '#FB923C' },
  { id: 5, msg: 'Driver Rita Okonkwo added to roster',            time: '1d ago',  dot: '#A78BFA' },
  { id: 6, msg: 'INV-2025-002 sent to Coyote Logistics',          time: '1d ago',  dot: '#22C55E' },
  { id: 7, msg: 'CVL-10041 delivered — Dallas → Atlanta',         time: '2d ago',  dot: '#22C55E' },
];
