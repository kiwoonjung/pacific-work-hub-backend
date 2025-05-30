-- Add status column to pfp_produce_items if not exists
ALTER TABLE pfp_produce_items 
ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'active' 
CHECK (status IN ('active', 'inactive'));

-- Add supplier_id and status to pfp_lots if not exists
ALTER TABLE pfp_lots
ADD COLUMN IF NOT EXISTS supplier_id uuid,
ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'pending'
CHECK (status IN ('pending', 'partial', 'complete'));

-- Create pfp_suppliers table if not exists
CREATE TABLE IF NOT EXISTS pfp_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for supplier_id in pfp_lots
ALTER TABLE pfp_lots
ADD CONSTRAINT fk_supplier
FOREIGN KEY (supplier_id)
REFERENCES pfp_suppliers(id)
ON DELETE SET NULL;

-- Create pfp_purchase_orders table if not exists
CREATE TABLE IF NOT EXISTS pfp_purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number varchar(50) NOT NULL UNIQUE,
  date_created date NOT NULL,
  eta_date date,
  supplier_id uuid REFERENCES pfp_suppliers(id) ON DELETE SET NULL,
  status varchar(20) DEFAULT 'draft'
  CHECK (status IN ('draft', 'submitted', 'confirmed', 'open', 'partial', 'complete')),
  note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pfp_purchase_order_items table if not exists
CREATE TABLE IF NOT EXISTS pfp_purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid REFERENCES pfp_purchase_orders(id) ON DELETE CASCADE,
  produce_item_id uuid REFERENCES pfp_produce_items(id) ON DELETE SET NULL,
  quantity_ordered integer,
  quantity_received integer DEFAULT 0,
  status varchar(20) DEFAULT 'pending'
  CHECK (status IN ('pending', 'partial', 'complete')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 