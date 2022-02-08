-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS reviews;


-- how to update table ? 

-- https://www.postgresqltutorial.com/postgresql-alter-table/

CREATE TABLE IF NOT EXISTS 
    products(
        product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        avatar VARCHAR(255) DEFAULT 'https://i.pravatar.cc/300',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    

CREATE TABLE IF NOT EXISTS
    reviews(
        review_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );