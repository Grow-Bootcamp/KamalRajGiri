# Learning Log

## Week 5, Day 5 — Advanced Queries and Aggregation in MySQL

**Date:** 2026-10-08  
**Database:** `sales_reporting_demo`

## 1. Session Objective

This session focused on using MySQL to answer reporting questions with:

- Row filtering
- Sorting and tie-breakers
- Pagination
- Aggregate functions
- Grouping
- Group-level filtering
- Joins combined with aggregation
- Calculated columns
- Logical SQL query processing order

The day's practical work is implemented in [`sales_reporting_demo/sql/database.sql`](./sales_reporting_demo/sql/database.sql). The session requirements and acceptance criteria are defined in [`task.md`](./task.md), while the supporting explanations are in [`README.md`](./README.md).

## 2. Practical Database Model

The demo uses a small sales system with related tables:

```text
categories
    └── products
            └── order_items
                    └── orders
                            └── customers
```

### Tables and responsibilities

| Table | Responsibility |
| --- | --- |
| `categories` | Stores product categories |
| `products` | Stores product names, prices, categories, and stock |
| `customers` | Stores customer names and unique email addresses |
| `orders` | Stores customers' order dates and statuses |
| `order_items` | Stores the products, quantities, and purchase-time prices in each order |

Foreign keys connect the tables and make it possible to build reports across the complete sales relationship.

## 3. Filtering Rows with `WHERE`

`WHERE` filters individual rows before grouping or aggregation. It answers:

> Which rows should participate in the query?

### Operators practiced

- Comparison: `=`, `<>`, `>`, `<`, `>=`, `<=`
- Logical: `AND`, `OR`, `NOT`
- Set membership: `IN`, `NOT IN`
- Ranges: `BETWEEN`, `NOT BETWEEN`
- Pattern matching: `LIKE`

Examples from the SQL file:

```sql
SELECT *
FROM products
WHERE price > 2000;

SELECT *
FROM products
WHERE category_id IN (1, 2, 3);

SELECT *
FROM products
WHERE price BETWEEN 1000 AND 2000
  AND category_id IN (1, 3);
```

### Important filtering details

- `BETWEEN` includes both boundary values.
- `IN` is shorter and clearer than repeating multiple `OR` conditions.
- Parentheses make mixed `AND` and `OR` conditions explicit.
- `%` in a `LIKE` pattern matches zero or more characters.
- `_` matches exactly one character.
- Normal comparisons should not be used for `NULL`; use `IS NULL` or `IS NOT NULL`.

## 4. Sorting with `ORDER BY`

`ORDER BY` controls the order of the returned rows or groups.

- `ASC` sorts from low to high and is the default.
- `DESC` sorts from high to low.
- Multiple columns can be used to create a deterministic tie-breaker.

```sql
SELECT
    order_id,
    customer_id,
    order_date,
    status
FROM orders
WHERE status = 'Completed'
ORDER BY order_date DESC, order_id DESC
LIMIT 5;
```

The query first places the newest orders first. If two orders have the same date, `order_id` provides a stable secondary order.

Deterministic sorting is especially important when using pagination. Without it, the same row can appear on different pages between executions.

## 5. Pagination with `LIMIT` and `OFFSET`

Pagination divides a large result set into smaller pages:

- `LIMIT` controls how many rows are returned.
- `OFFSET` controls how many rows are skipped.

```sql
SELECT
    product_id,
    product_name,
    price
FROM products
WHERE category_id = 1
ORDER BY price DESC, product_id ASC
LIMIT 3 OFFSET 0;
```

For one-based page numbers:

```text
OFFSET = (page - 1) * pageSize
```

For a page size of 10:

| Page | Offset |
| ---: | ---: |
| 1 | 0 |
| 2 | 10 |
| 3 | 20 |

The total number of pages can be calculated as:

```text
totalPages = CEILING(totalRows / pageSize)
```

Large offsets can become inefficient because the database may need to scan and skip many rows. Large applications may use keyset or cursor pagination instead.

## 6. Aggregate Functions

Aggregate functions summarize multiple rows:

| Function | Purpose |
| --- | --- |
| `COUNT(*)` | Counts rows |
| `COUNT(column)` | Counts non-`NULL` values in a column |
| `COUNT(DISTINCT column)` | Counts unique non-`NULL` values |
| `SUM()` | Adds numeric values |
| `AVG()` | Calculates an average |
| `MIN()` | Finds the smallest value |
| `MAX()` | Finds the largest value |

Examples:

```sql
SELECT COUNT(DISTINCT customer_id) AS unique_customers
FROM orders;

SELECT SUM(quantity * unit_price) AS total_revenue
FROM order_items;

SELECT
    COUNT(*) AS product_count,
    AVG(price) AS average_price,
    MIN(price) AS lowest_price,
    MAX(price) AS highest_price
FROM products;
```

`AVG()` ignores `NULL` values; a `NULL` value is not treated as zero.

An aggregate query without `GROUP BY` treats all matching rows as one overall group and returns one summary row.

## 7. Calculated Columns

SQL can calculate values during a query without storing duplicate data.

For an order item:

```text
item total = quantity * unit_price
```

The expression can be returned directly:

```sql
SELECT
    quantity,
    unit_price,
    quantity * unit_price AS item_total
FROM order_items;
```

It can also be aggregated:

```sql
SELECT SUM(quantity * unit_price) AS total_revenue
FROM order_items;
```

This pattern is useful for revenue, invoice totals, inventory value, and other derived metrics.

## 8. Grouping with `GROUP BY`

`GROUP BY` divides rows into groups before aggregate functions are calculated. It answers:

> How should the rows be divided before calculating summaries?

### Grouping by one column

```sql
SELECT
    category_id,
    COUNT(*) AS product_count,
    AVG(price) AS average_price
FROM products
GROUP BY category_id;
```

### Grouping by multiple columns

```sql
SELECT
    status,
    customer_id,
    COUNT(*) AS order_count
FROM orders
GROUP BY status, customer_id;
```

`GROUP BY status, customer_id` creates one group for every unique combination of status and customer.

A grouped report can calculate several metrics in one query, such as count, total quantity, average price, minimum price, maximum price, and revenue.

## 9. `WHERE` Versus `HAVING`

The distinction between these clauses is central to reporting queries:

| Clause | Filters | Example |
| --- | --- | --- |
| `WHERE` | Individual rows before grouping | `WHERE status = 'Completed'` |
| `GROUP BY` | Creates groups | `GROUP BY category_id` |
| `HAVING` | Groups after aggregation | `HAVING SUM(...) > 3000` |

Example:

```sql
SELECT
    c.category_name,
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
```

The query:

1. Keeps only completed-order rows with `WHERE`.
2. Groups the remaining rows by category.
3. Calculates revenue for each category.
4. Keeps only categories above the revenue threshold with `HAVING`.

An aggregate condition normally cannot be placed in `WHERE` because the aggregate value does not exist until after grouping.

## 10. Joins with Aggregation

Reporting data is often distributed across several related tables. Joins bring the data together before it is grouped and summarized.

The sales report joins:

```text
order_items → orders
order_items → products → categories
```

This makes it possible to report completed revenue by category:

```sql
SELECT
    c.category_name,
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
ORDER BY total_revenue DESC;
```

### Join and counting consideration

Joins can produce multiple rows for one original entity. For example, one order with three products produces three `order_items` rows. Therefore:

- `COUNT(*)` counts rows in the joined result.
- `COUNT(DISTINCT order_id)` counts unique orders.
- `COUNT(DISTINCT customer_id)` counts unique customers.

The correct count depends on the business question.

The SQL file also demonstrates a `LEFT JOIN` from categories to products so that categories without matching products can still be included in the report.

## 11. Logical SQL Processing Order

A useful logical model for complex queries is:

```text
FROM / JOIN
    ↓
WHERE
    ↓
GROUP BY
    ↓
Aggregate functions
    ↓
HAVING
    ↓
SELECT
    ↓
ORDER BY
    ↓
LIMIT / OFFSET
```

This explains why:

- `WHERE` filters rows before aggregation.
- `HAVING` filters groups after aggregation.
- `ORDER BY` sorts the final rows or groups.
- `LIMIT` and `OFFSET` are applied after sorting.

This is a logical reasoning model, not necessarily the exact physical execution plan chosen by the MySQL optimizer.

## 12. Reusable Reporting Query Pattern

A common report can be designed by translating the requirement into steps:

```text
Identify related tables
    ↓
JOIN the required data
    ↓
Filter individual rows
    ↓
GROUP BY the reporting dimension
    ↓
Calculate metrics
    ↓
Filter aggregate results
    ↓
Sort the report
    ↓
Paginate or limit the output
```

For example:

> Show the top two categories by completed-order revenue, where each category has at least two order items and revenue above 3,000.

The SQL design is:

```sql
WHERE o.status = 'Completed'
GROUP BY c.category_id, c.category_name
HAVING COUNT(*) >= 2
   AND SUM(oi.quantity * oi.unit_price) > 3000
ORDER BY total_revenue DESC, c.category_id ASC
LIMIT 2 OFFSET 0;
```

## 13. Common Mistakes and Corrections

### Using an aggregate in `WHERE`

Incorrect:

```sql
WHERE COUNT(*) > 2
```

Correct:

```sql
HAVING COUNT(*) > 2
```

### Confusing row counts with entity counts

After a join, `COUNT(*)` counts joined rows. Use `COUNT(DISTINCT id)` when the requirement is to count unique entities.

### Forgetting `GROUP BY`

If the requirement asks for revenue **for each category**, the query must group by category. Without grouping, the aggregate returns one overall result.

### Filtering at the wrong stage

Use `WHERE` when rows should be removed before aggregation. Use `HAVING` when the condition depends on a calculated group result.

### Paginating without stable sorting

`LIMIT` and `OFFSET` should normally be paired with a meaningful, deterministic `ORDER BY`.

## 14. Key Takeaways

- `WHERE` filters rows.
- `IN`, `BETWEEN`, and `LIKE` make common filters concise.
- `ORDER BY` controls result order and can use tie-breaker columns.
- `LIMIT` and `OFFSET` implement page-based results.
- `COUNT`, `SUM`, `AVG`, `MIN`, and `MAX` summarize data.
- `GROUP BY` creates separate summaries for categories, customers, statuses, or other dimensions.
- `HAVING` filters groups after aggregation.
- Joins allow reports to combine normalized data from multiple tables.
- Calculated expressions such as `quantity * unit_price` can be selected and aggregated directly.
- `COUNT(DISTINCT ...)` prevents misleading entity counts after one-to-many joins.
- Understanding SQL's logical processing order makes complex queries easier to design and debug.

## 15. Acceptance Criteria Status

| Requirement | Evidence or status |
| --- | --- |
| Write a query that filters, paginates, and sorts results | Demonstrated in `database.sql` with `WHERE`, `ORDER BY`, `LIMIT`, and `OFFSET` |
| Write a query using `GROUP BY`, `HAVING`, and at least three aggregate functions | Demonstrated in category and completed-order reporting queries |