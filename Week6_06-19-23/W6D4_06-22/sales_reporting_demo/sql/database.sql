-- Create and select the database used by this reporting example.
CREATE DATABASE sales_reporting_demo;

USE sales_reporting_demo;

-- Confirm that the database is available on the server.
SHOW DATABASES;

-- Product categories are referenced by products.
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Products belong to one category and track current inventory.
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
);
-- Customers place orders using a unique email address.
CREATE TABLE customers(
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Each order belongs to one customer and records its current status.
CREATE TABLE orders(
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (customer_id) 
        REFERENCES customers(customer_id)
);

-- Order items connect orders to products and preserve the purchase-time price.
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id),

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
);

-- Seed the category lookup table.
INSERT INTO categories (category_name) VALUES
('Electronics'),
('Clothing'),
('Books'),
('Accessories');

-- Inspect the inserted categories.
SELECT * FROM categories;

-- Seed the product catalog with prices, categories, and stock quantities.
INSERT INTO products
(product_name, category_id, price, stock)
VALUES
('Mechanical Keyboard', 1, 2500.00, 15),
('Wireless Mouse', 1, 1200.00, 25),
('USB-C Hub', 1, 1800.00, 10),
('Laptop Stand', 4, 2200.00, 8),
('Programming Book', 3, 1500.00, 20),
('Database Design Book', 3, 1800.00, 12),
('T-Shirt', 2, 900.00, 30),
('Hoodie', 2, 2200.00, 10);

-- Inspect the inserted products.
SELECT * FROM products;

-- Seed customer records.
INSERT INTO customers
(customer_name, email)
VALUES
('Kamal', 'kamal@example.com'),
('Aagyat', 'aagyat@example.com'),
('Anjana', 'anjana@example.com'),
('Bikash', 'bikash@example.com'),
('Suman', 'suman@example.com');

-- Inspect the inserted customers.
SELECT * FROM customers;

-- Seed orders with different dates and statuses for reporting examples.
INSERT INTO orders
(customer_id, order_date, status)
VALUES
(1, '2026-09-01', 'Completed'),
(1, '2026-09-15', 'Completed'),
(2, '2026-09-05', 'Completed'),
(2, '2026-09-20', 'Pending'),
(3, '2026-09-10', 'Completed'),
(4, '2026-09-12', 'Cancelled'),
(5, '2026-09-18', 'Completed'),
(5, '2026-09-25', 'Completed');

-- Inspect the inserted orders.
SELECT * FROM orders;

-- Seed each order's products, quantities, and purchase-time prices.
INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(1, 1, 2, 2500.00),
(1, 2, 1, 1200.00),

(2, 3, 1, 1800.00),
(2, 5, 2, 1500.00),

(3, 2, 2, 1200.00),
(3, 4, 1, 2200.00),

(4, 1, 1, 2500.00),

(5, 5, 1, 1500.00),
(5, 7, 2, 900.00),

(6, 8, 1, 2200.00),

(7, 6, 2, 1800.00),
(7, 4, 1, 2200.00),

(8, 1, 1, 2500.00),
(8, 7, 3, 900.00);

-- Inspect the inserted order items.
SELECT * FROM order_items;
-- Filter products by a minimum price.
-- Give me products whose price is greater than 2000.
SELECT * FROM products WHERE price > 2000;

-- Sort the filtered products from most expensive to least expensive.
SELECT * FROM products WHERE price > 2000 ORDER BY price DESC;

-- Return only the three most expensive products above the threshold.
SELECT * FROM products WHERE price > 2000 ORDER BY price DESC LIMIT 3;

-- This repeats the previous LIMIT example for practice.
SELECT * FROM products WHERE price > 2000 ORDER BY price DESC LIMIT 3;

-- Demonstrate additional comparison and range conditions.
SELECT * FROM products where price > 2000 ORDER BY name DESC  ;
SELECT * FROM products where price > 2000 AND price < 2400 ;
SELECT * FROM products where price BETWEEN 2000 AND 2400 ;
SELECT * FROM products where price NOT BETWEEN 2000 AND 2400 ;

SELECT * FROM products where price > 2000 OR product_name = 'Hoodie' ;
SELECT * FROM products WHERE (category_id = 1 AND price > 2000) OR category_id = 3;

-- Compare explicit OR conditions with the shorter IN expression.
SELECT * FROM products WHERE category_id=1 OR  category_id = 2 OR category_id = 3;
SELECT * FROM products WHERE category_id IN (1,2,3);

-- Exclude categories and demonstrate an inclusive category range.
SELECT * FROM products WHERE category_id NOT IN (1,2);
SELECT * FROM products WHERE category_id BETWEEN 2 and 3; 
-- BETWEEN is inclusive (include the boundary as well)
-- LIKE patterns: %TEXT ends with TEXT, TEXT% starts with TEXT, %TEXT% contains TEXT.
SELECT * FROM products WHERE product_name LIKE '%Book';
SELECT * FROM products WHERE product_name LIKE '%Book%';
SELECT * FROM products WHERE product_name LIKE '%oo%';
SELECT * FROM products WHERE product_name LIKE '%k%';
SELECT * FROM products WHERE product_name LIKE 'Book%';
-- The underscore wildcard represents exactly one character.
SELECT * FROM products WHERE product_name LIKE '%Hu_';
SELECT * FROM products WHERE product_name LIKE '%H__';
SELECT * FROM products WHERE product_name LIKE 'USB-C ___';

-- Filter orders by an inclusive date range.
SELECT *
FROM orders
WHERE order_date BETWEEN '2026-09-01' AND '2026-09-15';

-- Select orders with one exact status.
SELECT *
FROM orders
WHERE status = 'Completed';

-- Select orders whose status is one of several allowed values.
SELECT *
FROM orders
WHERE status IN ('Completed', 'Pending');

-- The <> operator means "not equal to".
SELECT *
FROM orders
WHERE status <> 'Completed';

-- Calculate each order item's value and keep items above 3,000.
SELECT
    quantity,
    unit_price,
    quantity * unit_price AS item_total
FROM order_items
WHERE quantity * unit_price > 3000;


-- Combine a date condition with an order status condition.
-- SELECT * FROM orders WHERE order_date > '2026-09-10';
-- SELECT * FROM orders WHERE status = 'Completed';
SELECT * FROM orders WHERE order_date >= '2026-09-10' AND status = 'Completed';

-- Filter by both a price range and a set of categories.
SELECT * FROM products where price BETWEEN 1000 AND 2000 
AND category_id IN (1,3);

-- Sort products by category.
SELECT *
FROM products
WHERE price > 1000
ORDER BY category_id ASC;

-- Sort by price, then use category as a tie-breaker.
SELECT *
FROM products
WHERE price > 1000
ORDER BY price DESC, category_id ASC;

-- Limit the sorted result to the three highest-priced products.
SELECT *
FROM products
WHERE price > 1000
ORDER BY price DESC, category_id ASC
LIMIT 3;

-- Show the five most recent completed orders.
SELECT
    order_id,
    customer_id,
    order_date,
    status
FROM orders
WHERE status = 'Completed'
ORDER BY order_date DESC,
         order_id DESC
LIMIT 5;

-- ORDER BY can use a calculated column alias.
SELECT
    quantity * unit_price AS total
FROM order_items
ORDER BY total DESC;

-- Show all orders from newest to oldest.
SELECT *
FROM orders
ORDER BY order_date DESC;

-- Sort order items by their calculated line-item total.
SELECT
    order_id,
    product_id,
    quantity,
    unit_price,
    quantity * unit_price AS item_total
FROM order_items
ORDER BY item_total DESC;

-- Return two products after skipping the first four rows.
SELECT *
FROM products
ORDER BY product_id
LIMIT 4,2;

-- LIMIT 2 OFFSET 4 is equivalent to LIMIT 4,2.
-- For pagination, offset = (page - 1) * pageSize.

-- Return the first page of the three most expensive products in category 1.
SELECT
    product_id,
    product_name,
    price
FROM products
WHERE category_id = 1
ORDER BY price DESC, product_id ASC
LIMIT 3 OFFSET 0;
-- ORDER BY must appear before LIMIT and OFFSET.

-- Count products in category 1 for pagination calculations.
SELECT COUNT(*) AS total
FROM products
WHERE category_id = 1;
-- totalPages = CEILING(total / 3).

-- COUNT(column) counts non-NULL values in that column.
SELECT COUNT(product_name)
FROM products;

-- COUNT(*) counts rows, while COUNT(column) counts non-NULL values.

-- Count distinct customers who have placed orders.
SELECT COUNT(DISTINCT customer_id) AS unique_customers
FROM orders;

-- Add quantities across all order items.
SELECT SUM(quantity) AS total_items_sold
FROM order_items;

-- Calculate total revenue using quantity multiplied by unit price.
SELECT
    SUM(quantity * unit_price) AS total_revenue
FROM order_items;

-- Calculate the average catalog price.
SELECT AVG(price) AS average_product_price
FROM products;

-- AVG ignores NULL values; NULL is not treated as zero.

-- Find the minimum and maximum catalog prices.
SELECT MIN(price) AS lowest_price
FROM products;

SELECT MAX(price) AS highest_price
FROM products;

-- Summarize completed order-item quantities and prices.
SELECT
    COUNT(*) AS total_order_items,
    SUM(quantity) AS total_quantity,
    AVG(unit_price) AS average_unit_price,
    MIN(unit_price) AS minimum_unit_price,
    MAX(unit_price) AS maximum_unit_price
FROM order_items oi
JOIN orders o
    ON oi.order_id = o.order_id
WHERE o.status = 'Completed';

-- Summarize the overall product catalog.
SELECT
    COUNT(*) AS product_count,
    AVG(price) AS average_price,
    MIN(price) AS lowest_price,
    MAX(price) AS highest_price
FROM products;

-- Calculate the average price without an alias.
SELECT AVG(price)
FROM products;

-- Group product prices by category.
SELECT
    category_id,
    AVG(price)
FROM products
GROUP BY category_id;

-- Count products in each category.
SELECT
    category_id,
    COUNT(*) AS product_count
FROM products
GROUP BY category_id;

-- Produce several price statistics for every category.
SELECT
    category_id,
    COUNT(*) AS product_count,
    SUM(price) AS total_price,
    AVG(price) AS average_price,
    MIN(price) AS lowest_price,
    MAX(price) AS highest_price
FROM products
GROUP BY category_id;

-- Count orders for every status and customer combination.
SELECT
    status,
    customer_id,
    COUNT(*) AS order_count
FROM orders
GROUP BY status, customer_id;

-- Summarize all order items without filtering by order status.
SELECT
    COUNT(*) AS total_order_items,
    SUM(quantity * unit_price) AS total_revenue,
    AVG(unit_price) AS average_unit_price,
    MIN(unit_price) AS lowest_unit_price,
    MAX(unit_price) AS highest_unit_price
FROM order_items;

-- Join order items to products and categories for category-level sales totals.
SELECT
    c.category_name,
    COUNT(*) AS order_item_count,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * oi.unit_price) AS total_revenue,
    AVG(oi.unit_price) AS average_unit_price
FROM order_items oi
JOIN products p
    ON oi.product_id = p.product_id
JOIN categories c
    ON p.category_id = c.category_id
GROUP BY c.category_id, c.category_name;

-- Restrict the category-level report to completed orders.
SELECT
    c.category_name,
    COUNT(*) AS order_item_count,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN orders o
    ON oi.order_id = o.order_id
JOIN products p
    ON oi.product_id = p.product_id
JOIN categories c
    ON p.category_id = c.category_id
WHERE o.status = 'Completed'
GROUP BY c.category_id, c.category_name;

-- Count products in each category before applying a HAVING filter.
SELECT
    category_id,
    COUNT(*) AS product_count
FROM products
GROUP BY category_id;

-- Keep only categories containing at least two products.
SELECT
    category_id,
    COUNT(*) AS product_count
FROM products
GROUP BY category_id
HAVING COUNT(*) >= 2;

-- WHERE filters rows before grouping; HAVING filters grouped results.
SELECT
    category_id,
    COUNT(*) AS product_count,
    AVG(price) AS average_price
FROM products
WHERE price > 1000
GROUP BY category_id
HAVING COUNT(*) >= 2;

-- Keep completed-order categories whose revenue exceeds 3,000.
SELECT
    c.category_name,
    COUNT(*) AS order_item_count,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN orders o
    ON oi.order_id = o.order_id
JOIN products p
    ON oi.product_id = p.product_id
JOIN categories c
    ON p.category_id = c.category_id
WHERE o.status = 'Completed'
GROUP BY c.category_id, c.category_name
HAVING SUM(oi.quantity * oi.unit_price) > 3000;

-- Apply multiple conditions to grouped category results.
SELECT
    c.category_name,
    COUNT(*) AS order_item_count,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * oi.unit_price) AS total_revenue,
    AVG(oi.unit_price) AS average_unit_price
FROM order_items oi
JOIN orders o
    ON oi.order_id = o.order_id
JOIN products p
    ON oi.product_id = p.product_id
JOIN categories c
    ON p.category_id = c.category_id
WHERE o.status = 'Completed'
GROUP BY c.category_id, c.category_name
HAVING
    COUNT(*) >= 2
    AND SUM(oi.quantity * oi.unit_price) > 3000;

-- Use a SELECT alias in HAVING to filter category revenue.
SELECT
    c.category_name,
    COUNT(*) AS order_item_count,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN products p
    ON oi.product_id = p.product_id
JOIN categories c
    ON p.category_id = c.category_id
GROUP BY c.category_id, c.category_name
HAVING total_revenue > 3000;

-- Return the completed-order summary only when total revenue exceeds 10,000.
SELECT
    COUNT(*) AS total_orders,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN orders o
    ON oi.order_id = o.order_id
WHERE o.status = 'Completed'
HAVING total_revenue > 10000;

-- Include categories with no products by using a LEFT JOIN.
SELECT
    c.category_name,
    COUNT(p.product_id) AS product_count,
    AVG(p.price) AS average_price,
    MAX(p.price) AS highest_price
FROM categories c
LEFT JOIN products p
    ON c.category_id = p.category_id
GROUP BY c.category_id, c.category_name
HAVING product_count >= 2
ORDER BY average_price DESC
LIMIT 5;

-- Sort qualifying completed-order categories by revenue.
SELECT
    c.category_name,
    COUNT(*) AS order_item_count,
    SUM(oi.quantity) AS total_quantity,
    AVG(oi.unit_price) AS average_unit_price,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN orders o
    ON oi.order_id = o.order_id
JOIN products p
    ON oi.product_id = p.product_id
JOIN categories c
    ON p.category_id = c.category_id
WHERE o.status = 'Completed'
GROUP BY c.category_id, c.category_name
HAVING
    COUNT(*) >= 2
    AND SUM(oi.quantity * oi.unit_price) > 3000
ORDER BY total_revenue DESC;

-- Return the top two qualifying categories after sorting by revenue.
SELECT
    c.category_name,
    COUNT(*) AS order_item_count,
    SUM(oi.quantity) AS total_quantity,
    AVG(oi.unit_price) AS average_unit_price,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN orders o
    ON oi.order_id = o.order_id
JOIN products p
    ON oi.product_id = p.product_id
JOIN categories c
    ON p.category_id = c.category_id
WHERE o.status = 'Completed'
GROUP BY c.category_id, c.category_name
HAVING
    COUNT(*) >= 2
    AND SUM(oi.quantity * oi.unit_price) > 3000
ORDER BY total_revenue DESC, c.category_id ASC
LIMIT 2 OFFSET 0;