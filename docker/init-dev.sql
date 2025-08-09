-- Development database initialization
-- This script sets up the development database with sample data

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample shopping lists for development
INSERT INTO shopping_lists (name, description, "createdAt", "updatedAt") VALUES 
  ('Weekly Groceries', 'Regular grocery shopping list', NOW(), NOW()),
  ('Party Supplies', 'Items needed for the weekend party', NOW(), NOW()),
  ('Home Improvement', 'Tools and materials for house projects', NOW(), NOW());

-- Insert sample items for development
INSERT INTO shopping_list_items (name, quantity, unit, completed, notes, "shoppingListId", "createdAt", "updatedAt") VALUES
  -- Weekly Groceries items
  ('Milk', 2, 'liters', false, 'Whole milk preferred', 1, NOW(), NOW()),
  ('Bread', 1, 'loaf', true, 'Whole wheat', 1, NOW(), NOW()),
  ('Eggs', 12, 'pieces', false, 'Large eggs', 1, NOW(), NOW()),
  ('Bananas', 6, 'pieces', false, 'Ripe but not too soft', 1, NOW(), NOW()),
  ('Chicken breast', 1, 'kg', false, 'Organic if available', 1, NOW(), NOW()),
  
  -- Party Supplies items  
  ('Balloons', 20, 'pieces', false, 'Mixed colors', 2, NOW(), NOW()),
  ('Paper plates', 2, 'packs', true, 'Disposable', 2, NOW(), NOW()),
  ('Soda', 6, 'cans', false, 'Assorted flavors', 2, NOW(), NOW()),
  ('Pizza', 3, 'large', false, 'Various toppings', 2, NOW(), NOW()),
  
  -- Home Improvement items
  ('Paint brushes', 3, 'pieces', false, 'Different sizes', 3, NOW(), NOW()),
  ('Screws', 1, 'box', true, 'Wood screws, 2 inch', 3, NOW(), NOW()),
  ('Sandpaper', 5, 'sheets', false, '220 grit', 3, NOW(), NOW());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list_id ON shopping_list_items("shoppingListId");
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_completed ON shopping_list_items(completed);

-- Grant permissions (if needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
