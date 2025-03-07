-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS (Row Level Security) policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Only admins can create, update, and delete users
CREATE POLICY "Admins can do everything with users" ON public.users 
  FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create cards table
CREATE TABLE public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    set_name TEXT,
    set_code TEXT,
    card_code TEXT,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    show_buy_price BOOLEAN DEFAULT false,
    show_sell_price BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on card name for faster searches
CREATE INDEX idx_cards_name ON public.cards USING gin (name gin_trgm_ops);
CREATE INDEX idx_cards_set_name ON public.cards USING gin (set_name gin_trgm_ops);
CREATE INDEX idx_cards_category ON public.cards (category);

-- Create card_prices table for storing prices of different conditions
CREATE TABLE public.card_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
    condition TEXT NOT NULL,
    cost_price DECIMAL(10, 2) DEFAULT 0,
    market_price DECIMAL(10, 2) DEFAULT 0,
    sale_price DECIMAL(10, 2) DEFAULT 0,
    buy_price DECIMAL(10, 2) DEFAULT 0,
    profit_margin DECIMAL(10, 2) DEFAULT 0,
    quantity INTEGER DEFAULT 0,
    show_buy_price BOOLEAN DEFAULT false,
    show_sell_price BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (card_id, condition)
);

-- Create index on card_id for faster joins
CREATE INDEX idx_card_prices_card_id ON public.card_prices (card_id);

-- Set up RLS for cards and card_prices
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_prices ENABLE ROW LEVEL SECURITY;

-- Anyone can read cards and prices
CREATE POLICY "Anyone can read cards" ON public.cards
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read card prices" ON public.card_prices
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can modify cards and prices
CREATE POLICY "Admins can modify cards" ON public.cards
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can modify card prices" ON public.card_prices
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables to update the updated_at column
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cards_updated_at
BEFORE UPDATE ON public.cards
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_card_prices_updated_at
BEFORE UPDATE ON public.card_prices
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create initial admin user (you'll need to update the password hash)
-- Default password: admin123 (you should change this in production)
INSERT INTO public.users (username, email, password, role)
VALUES (
  'admin',
  'admin@example.com',
  '$2a$10$pZuXCl6zMIBuQNGmyWBLN.cZ4qnqdHq29jVYb3qW0lOCl/0tPCAbu', -- bcrypt hash for 'admin123'
  'admin'
);

-- Add extension for trigram-based search if not already available
CREATE EXTENSION IF NOT EXISTS pg_trgm;
