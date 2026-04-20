

CREATE DATABASE IF NOT EXISTS lcms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lcms;

CREATE TABLE brokers (
  id         INT           UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120)  NOT NULL,
  email      VARCHAR(120),
  phone      VARCHAR(25),
  mc_number  VARCHAR(20)   UNIQUE,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mc_number (mc_number)
) ENGINE=InnoDB;

CREATE TABLE carriers (
  id             INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(120),
  phone          VARCHAR(25),
  mc_number      VARCHAR(20)  UNIQUE,
  dot_number     VARCHAR(20)  UNIQUE,
  status         ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  equipment_type ENUM('Dry Van','Reefer','Flatbed','Step Deck','RGN') NOT NULL DEFAULT 'Dry Van',
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_equipment (equipment_type)
) ENGINE=InnoDB;

CREATE TABLE loads (
  id               INT           UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  load_number      VARCHAR(20)   NOT NULL UNIQUE,          -- e.g. CVL-10041
  broker_id        INT           UNSIGNED NOT NULL,
  carrier_id       INT           UNSIGNED NOT NULL,
  origin_city      VARCHAR(80)   NOT NULL,
  origin_state     CHAR(2)       NOT NULL,
  destination_city VARCHAR(80)   NOT NULL,
  destination_state CHAR(2)     NOT NULL,
  pickup_date      DATE          NOT NULL,
  delivery_date    DATE          NOT NULL,
  rate             DECIMAL(10,2) NOT NULL,                 -- broker pays dispatcher
  carrier_pay      DECIMAL(10,2) NOT NULL,                 -- dispatcher pays carrier
  status           ENUM('Pending','In Transit','Delivered','Cancelled') NOT NULL DEFAULT 'Pending',
  weight_lbs       INT           UNSIGNED,
  miles            INT           UNSIGNED,
  notes            TEXT,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_loads_broker  FOREIGN KEY (broker_id)  REFERENCES brokers(id)  ON DELETE RESTRICT,
  CONSTRAINT fk_loads_carrier FOREIGN KEY (carrier_id) REFERENCES carriers(id) ON DELETE RESTRICT,

  INDEX idx_load_status   (status),
  INDEX idx_load_broker   (broker_id),
  INDEX idx_load_carrier  (carrier_id),
  INDEX idx_pickup_date   (pickup_date),
  INDEX idx_delivery_date (delivery_date)
) ENGINE=InnoDB;

CREATE OR REPLACE VIEW v_load_profit AS
SELECT
  l.id,
  l.load_number,
  l.status,
  l.pickup_date,
  l.delivery_date,
  b.name                                      AS broker_name,
  c.name                                      AS carrier_name,
  c.equipment_type,
  CONCAT(l.origin_city,', ',l.origin_state)   AS origin,
  CONCAT(l.destination_city,', ',l.destination_state) AS destination,
  l.rate,
  l.carrier_pay,
  (l.rate - l.carrier_pay)                    AS profit,
  ROUND((l.rate - l.carrier_pay) / l.rate * 100, 2) AS margin_pct,
  l.weight_lbs,
  l.miles,
  CASE WHEN l.miles > 0
    THEN ROUND((l.rate - l.carrier_pay) / l.miles, 2)
    ELSE NULL
  END                                          AS profit_per_mile
FROM loads l
JOIN brokers  b ON b.id = l.broker_id
JOIN carriers c ON c.id = l.carrier_id;

CREATE OR REPLACE VIEW v_carrier_summary AS
SELECT
  c.id,
  c.name,
  c.status,
  c.equipment_type,
  COUNT(l.id)                                   AS total_loads,
  SUM(CASE WHEN l.status='Delivered' THEN 1 ELSE 0 END) AS delivered_loads,
  COALESCE(SUM(l.carrier_pay), 0)               AS total_paid,
  COALESCE(AVG(l.miles), 0)                     AS avg_miles
FROM carriers c
LEFT JOIN loads l ON l.carrier_id = c.id
GROUP BY c.id;

CREATE OR REPLACE VIEW v_broker_summary AS
SELECT
  b.id,
  b.name,
  b.mc_number,
  COUNT(l.id)                                   AS total_loads,
  COALESCE(SUM(l.rate), 0)                      AS total_revenue,
  COALESCE(SUM(l.rate - l.carrier_pay), 0)      AS total_profit
FROM brokers b
LEFT JOIN loads l ON l.broker_id = b.id
GROUP BY b.id;

INSERT INTO brokers (name, email, phone, mc_number) VALUES
  ('Echo Global Logistics',   'dispatch@echo.com',    '(312) 555-0101', 'MC-487210'),
  ('Coyote Logistics',        'loads@coyote.com',     '(773) 555-0182', 'MC-521334'),
  ('CH Robinson',             'ops@chrobinson.com',   '(952) 555-0144', 'MC-309860'),
  ('Total Quality Logistics', 'freight@tql.com',      '(513) 555-0199', 'MC-488192');

INSERT INTO carriers (name, email, phone, mc_number, dot_number, status, equipment_type) VALUES
  ('Swift Freight LLC',  'ops@swiftfreight.com',   '(602) 555-0131', 'MC-211774', 'DOT-1182344', 'Active',   'Dry Van'),
  ('Iron Road Trucking', 'dispatch@ironroad.com',  '(214) 555-0167', 'MC-399210', 'DOT-2341892', 'Active',   'Flatbed'),
  ('Arctic Reefer Co.',  'loads@arcticreefer.com', '(503) 555-0122', 'MC-512009', 'DOT-3122451', 'Active',   'Reefer'),
  ('Prairie Haul Inc.',  'info@prairiehaul.com',   '(701) 555-0188', 'MC-448771', 'DOT-1934411', 'Inactive', 'Dry Van'),
  ('Coastal Step Deck',  'ops@coastalstep.com',    '(904) 555-0155', 'MC-477622', 'DOT-2811200', 'Active',   'Step Deck');

INSERT INTO loads
  (load_number, broker_id, carrier_id, origin_city, origin_state, destination_city, destination_state, pickup_date, delivery_date, rate, carrier_pay, status, weight_lbs, miles)
VALUES
  ('CVL-10041', 1, 1, 'Dallas',      'TX', 'Atlanta',        'GA', '2025-04-14', '2025-04-16', 3200.00, 2600.00, 'Delivered',  42000, 781),
  ('CVL-10042', 2, 3, 'Chicago',     'IL', 'Miami',          'FL', '2025-04-15', '2025-04-17', 4800.00, 3900.00, 'In Transit', 38500, 1380),
  ('CVL-10043', 3, 2, 'Los Angeles', 'CA', 'Denver',         'CO', '2025-04-16', '2025-04-18', 3600.00, 2900.00, 'Pending',    44000, 1023),
  ('CVL-10044', 4, 5, 'Phoenix',     'AZ', 'Houston',        'TX', '2025-04-13', '2025-04-15', 2900.00, 2300.00, 'Delivered',  36000, 868),
  ('CVL-10045', 1, 1, 'New York',    'NY', 'Charlotte',      'NC', '2025-04-17', '2025-04-19', 3100.00, 2500.00, 'Pending',    40000, 632),
  ('CVL-10046', 2, 4, 'Seattle',     'WA', 'Salt Lake City', 'UT', '2025-04-12', '2025-04-14', 2700.00, 2200.00, 'Cancelled',  35000, 840),
  ('CVL-10047', 3, 3, 'Minneapolis', 'MN', 'Kansas City',    'MO', '2025-04-18', '2025-04-19', 2400.00, 1900.00, 'In Transit', 39000, 442),
  ('CVL-10048', 4, 2, 'Nashville',   'TN', 'Columbus',       'OH', '2025-04-19', '2025-04-20', 1900.00, 1500.00, 'Pending',    32000, 294);

