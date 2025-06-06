-- like a "catalog" of all items that can exist in a factory/inventory.
CREATE TABLE IF NOT EXISTS items (
    item_id SERIAL PRIMARY KEY,
    -- we probably won't have same exact item name for two items, so unique.
    item_name VARCHAR(50) NOT NULL UNIQUE,
    -- maybe we should make this text? or increase to VARCHAR(255)?
    description VARCHAR(50),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- table for the general category of a unit an attribute can have.
-- for example, distance, weight, time etc.
CREATE TABLE IF NOT EXISTS unit_types (
    type_id SERIAL PRIMARY KEY,
    -- unique because it wouldn't make sense to have two unit types
    -- be the same name but different ID.
    type_name VARCHAR(30) NOT NULL UNIQUE
    -- no empty strings
    CHECK (char_length(type_name) > 0)
);

-- this table containts the specific units like meters, inches, kilograms, etc.
CREATE TABLE IF NOT EXISTS unit_definitions (
    unit_id SERIAL PRIMARY KEY,
    unit_name VARCHAR(20) NOT NULL UNIQUE,
    type_id INT,
    -- the foreign key references the `unit_types` table because
    -- the tuples in this table need to fall under a unit category.
    -- for example, kilograms is a `unit_definition` of type 'weight'.
    FOREIGN KEY (type_id) REFERENCES unit_types (type_id)
    -- so if a unit like 'weight' is deleted, then also delete
    -- unites like 'kg' for example.
    -- this is because it wouldn't make sense to have a unit
    -- like 'kilograms' if 'weight' doesn't exist.
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- this is the actual table the stores the different attributes that
-- can be assigned to different items. for example, the manager
-- could create an attribute of name 'width', which is a 'numeric'
-- value, and of type 'distance'. which is why it's foreign key
-- references the `unit_types` table.
CREATE TABLE IF NOT EXISTS attribute_definitions (
    definition_id SERIAL PRIMARY KEY,
    attribute_name VARCHAR(50) NOT NULL UNIQUE,
    --TODO: use ENUM for the data_type, like 'numeric', 'text', 'boolean' etc.
    -- maybe even add a seperate data_types table?
    data_type VARCHAR(50) NULL,
    unit_type INT,
    allowed_values VARCHAR(50) NULL,
    FOREIGN KEY (unit_type) REFERENCES unit_types (type_id)
    -- similar logic like the `unit_types` table here as well.
    -- it wouldn't make sense for 'width' to exist if 'distance'
    -- is deleted.
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- this table defines the different attributes an item has.
-- so using the `attribute_definitions` table, an item can
-- be assigned different attributes like 'width', or 'fat'.
CREATE TABLE IF NOT EXISTS item_attributes (
    attribute_id SERIAL PRIMARY KEY,
    item_id INT,
    definition_id INT,
    attribute_value VARCHAR(20) NULL,
    unit_id INT,
    FOREIGN KEY (item_id) REFERENCES items (item_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (definition_id)
    REFERENCES attribute_definitions (definition_id)
    -- we probably don't want to erase all uses of 'width' if
    -- it were to be accidently deleted. so we can restrict for now.
    ON DELETE RESTRICT ON UPDATE RESTRICT,
    FOREIGN KEY (unit_id) REFERENCES unit_definitions (unit_id)
    -- if we delete something like 'inches', we can just mark the
    -- attributes using it as gone, or as 'NULL'.
    ON DELETE SET NULL ON UPDATE CASCADE
);

-- everything past here is identical for every idea

-- this table is like an index for all the locations
-- that currently exist in the factory/inventory.
CREATE TABLE IF NOT EXISTS locations (
    location_id SERIAL PRIMARY KEY,
    location_name VARCHAR(50) NOT NULL UNIQUE,
    location_description VARCHAR(50)
    CHECK (char_length(location_name) > 0)
    -- we can maybe add a 'default' location later.
);

-- this table is like an index for all the known suppliers.
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(50) NOT NULL UNIQUE
    CHECK (char_length(supplier_name) > 0)
);

-- the records table for storing the transactions of when,
-- and from where the items were bought or removed from the
-- main factory/inventory itself.
CREATE TABLE IF NOT EXISTS inventory_transactions (
    transaction_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    location_id INT,
    quantity FLOAT NOT NULL,
    transaction_description VARCHAR(50),
    transaction_date TIMESTAMP DEFAULT now() NOT NULL,
    supplier_id INT, -- temporarily comment out quantity check negative
    -- CHECK (quantity >= 0),
    -- restrict item deletion because we wanna preserve records (for now).
    FOREIGN KEY (item_id) REFERENCES items (item_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (location_id) REFERENCES
    locations (location_id) --probably nullable
    -- set locations to NULL if location is deleted for now.
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES
    -- same for supplier
    suppliers (supplier_id) -- CAN be null, not all transactions do this
    ON DELETE SET NULL ON UPDATE CASCADE
);

-- only exists because we may want to have counts per item per location
-- this is the live estimate of current inventory counts based on transactions 
-- since last record
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    location_id INT,
    quantity FLOAT NOT NULL DEFAULT 0

    CHECK (quantity >= 0),

    FOREIGN KEY (item_id) REFERENCES items (item_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
    -- restrict to avoid accidental deletion.
    FOREIGN KEY (location_id) REFERENCES locations (location_id)
    ON DELETE SET NULL ON UPDATE CASCADE
    -- on delete set null for locations to allow
    -- location deletion while keeping records.
    -- we can handle unassigned items in-app.
);


-- the 'transactions' record table for when items were taken
-- and put into different inventory loactions.
--TODO: add comments to foreign keys
CREATE TABLE IF NOT EXISTS inventory_records (
    record_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    location_id INT NOT NULL,
    quantity FLOAT NOT NULL,
    date_of_count TIMESTAMP DEFAULT now()
    CHECK (quantity >= 0),
    FOREIGN KEY (item_id) REFERENCES items (item_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations (location_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
-- New table to enforce unit_type → data_type
--Create a new table to isolate the dependency unit_type → data_type
CREATE TABLE unit_data_types (
    unit_type INT PRIMARY KEY REFERENCES unit_types(type_id),
    data_type VARCHAR(50) NOT NULL
);

-- Updated attribute_definitions (removed data_type column)
CREATE TABLE attribute_definitions (
    definition_id SERIAL PRIMARY KEY,
    attribute_name VARCHAR(50) NOT NULL UNIQUE,
    unit_type INT REFERENCES unit_data_types(unit_type),
    allowed_values VARCHAR(50)
);
-- Add default_unit_id to attribute_definitions
ALTER TABLE attribute_definitions
ADD COLUMN default_unit_id INT REFERENCES unit_definitions(unit_id);

-- Updated item_attributes (unit_id is now optional)
CREATE TABLE item_attributes (
    attribute_id SERIAL PRIMARY KEY,
    item_id INT REFERENCES items(item_id),
    definition_id INT REFERENCES attribute_definitions(definition_id),
    attribute_value VARCHAR(20),
    override_unit_id INT REFERENCES unit_definitions(unit_id)  -- Optional override
);
--(item_id, location_id) becomes a candidate key (superkey), eliminating redundancy.
ALTER TABLE inventory
ADD UNIQUE (item_id, location_id);


