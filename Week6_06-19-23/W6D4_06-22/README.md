# Week 5 Day 5 — Advanced Queries & Aggregation in MySQL

## 1. Overview

This session focused on advanced SQL querying and reporting techniques in MySQL.

The main concepts covered were:

* Filtering
* Sorting
* Pagination
* Aggregate functions
* `GROUP BY`
* `HAVING`
* Difference between `WHERE` and `HAVING`
* Combining filtering, grouping, aggregation, sorting, and pagination
* Using joins with aggregation
* Understanding SQL query processing order
* Designing practical reporting queries

The practical work was implemented using a sales reporting database containing customers, orders, order items, products, and categories.

---

# 2. Filtering

Filtering is used to select only the rows that satisfy specific conditions.

The main keyword used for filtering is:

`WHERE`

Filtering is performed before grouping and aggregation.

### Common filtering operators

* `=` — equal to
* `<>` / `!=` — not equal to
* `>` — greater than
* `<` — less than
* `>=` — greater than or equal to
* `<=` — less than or equal to

### Logical operators

* `AND` — all conditions must be true
* `OR` — at least one condition must be true
* `NOT` — reverses a condition

Parentheses can be used to control the logical order when combining `AND` and `OR`.

### `IN`

`IN` is used when a column can match any value from a given set.

Conceptually:

> Match this column against one of these values.

`NOT IN` does the opposite.

### `BETWEEN`

`BETWEEN` checks whether a value falls within a range.

It is inclusive, meaning both boundary values are included.

### `LIKE`

`LIKE` is used for pattern matching.

Common wildcards:

* `%` — matches zero or more characters
* `_` — matches exactly one character

### NULL filtering

`NULL` does not represent a normal value.

Therefore, it should not normally be compared using `=` or `!=`.

Use:

* `IS NULL`
* `IS NOT NULL`

### Mental model

`WHERE` answers:

> **Which rows should participate in the query?**

---

# 3. Sorting

Sorting controls the order in which query results are returned.

The keyword used is:

`ORDER BY`

### Sorting directions

* `ASC` — ascending order
* `DESC` — descending order

Ascending is the default if no direction is specified.

Sorting can be applied to:

* numbers
* strings
* dates
* calculated values
* aggregate results

### Multiple-column sorting

More than one column can be specified.

The database first sorts according to the first column. If two rows have the same value, the next sorting column is used.

For example, conceptually:

> Sort by revenue from highest to lowest, and if two categories have the same revenue, sort by category ID.

This is called using a **tie-breaker**.

### Why tie-breakers matter

A deterministic order is especially important when pagination is used.

If multiple records have identical sorting values, adding another unique or sufficiently distinguishing column helps maintain a predictable order between pages.

### Mental model

`ORDER BY` answers:

> **In what order should the resulting rows or groups appear?**

---

# 4. Pagination

Pagination means returning a large dataset in smaller portions called pages.

The main keywords are:

* `LIMIT`
* `OFFSET`

### LIMIT

`LIMIT` controls how many rows are returned.

### OFFSET

`OFFSET` controls how many rows are skipped before returning results.

### Page calculation

For a one-based page number:

`OFFSET = (page - 1) × pageSize`

For example, with a page size of 10:

* Page 1 → offset 0
* Page 2 → offset 10
* Page 3 → offset 20

### Pagination with sorting

Pagination should normally be combined with a deterministic `ORDER BY`.

Without predictable sorting, the records appearing on a page may not remain consistent between queries.

### Pagination in applications

A backend API commonly receives:

* page
* page size
* sorting information
* filtering information

The backend converts these values into SQL query conditions.

A typical response may contain:

* current page data
* total number of records
* current page
* page size
* total pages

### Large offsets

Large `OFFSET` values can become inefficient because the database may need to scan or skip many rows before returning the requested page.

For very large datasets, applications may use **cursor/keyset pagination** instead.

That is beyond the main scope of this session.

### Mental model

`LIMIT` answers:

> **How many results should I return?**

`OFFSET` answers:

> **How many results should I skip first?**

---

# 5. Aggregate Functions

Aggregate functions calculate a summary value from multiple rows.

The main aggregate functions studied were:

* `COUNT()`
* `SUM()`
* `AVG()`
* `MIN()`
* `MAX()`

---

## 5.1 COUNT()

`COUNT()` counts rows or non-NULL values depending on how it is used.

### COUNT(*)

Counts rows.

Conceptually:

> How many rows are there?

### COUNT(column)

Counts non-NULL values in that column.

Therefore:

`COUNT(*)` and `COUNT(column)` can produce different results when NULL values exist.

### COUNT(DISTINCT column)

Counts unique non-NULL values.

Conceptually:

> How many different values exist?

This is useful for questions such as:

> How many unique customers placed orders?

---

# 6. SUM()

`SUM()` adds numeric values.

It is commonly used for:

* total quantity
* total salary
* total stock
* total revenue
* total transaction amount

A calculated expression can also be aggregated.

For example, conceptually:

`quantity × unit price`

produces the value of one order-item row, and `SUM()` can then calculate the overall revenue.

---

# 7. AVG()

`AVG()` calculates the average of numeric values.

It is useful for:

* average product price
* average salary
* average order value
* average unit price

Like other aggregates, NULL values are handled differently from normal numeric values.

---

# 8. MIN() and MAX()

`MIN()` returns the smallest value.

`MAX()` returns the largest value.

They are commonly used for:

* lowest product price
* highest product price
* minimum salary
* maximum salary
* earliest/latest values depending on the data type

---

# 9. Aggregates Without GROUP BY

Aggregate functions do not always require `GROUP BY`.

When an aggregate query has no `GROUP BY`, the matching rows are treated as one overall group.

For example, conceptually:

> Calculate the total revenue of all completed orders.

The result is one summary row.

### Mental model

Without `GROUP BY`:

> **Give me one overall summary.**

---

# 10. GROUP BY

`GROUP BY` divides rows into groups based on one or more columns.

It is used when we want a separate summary for each category.

Examples of grouping questions:

* How many products are in each category?
* How many orders did each customer place?
* What is the total revenue for each category?
* What is the average salary for each department?

### Mental model

`GROUP BY` answers:

> **How should the rows be divided into groups before calculating aggregates?**

---

# 11. GROUP BY with Multiple Columns

More than one column can be used for grouping.

For example, grouping by:

* department
* employee type

means that each unique combination of department and employee type becomes a separate group.

Conceptually:

`GROUP BY A, B`

means:

> Create a group for every unique combination of A and B.

---

# 12. Multiple Aggregate Functions

A single grouped query can calculate multiple summaries.

For example, a category report can contain:

* product count
* total quantity
* average price
* minimum price
* maximum price
* total revenue

This is useful for dashboards and reports because multiple business metrics can be calculated in one query.

---

# 13. WHERE vs GROUP BY vs HAVING

This is one of the most important concepts from Day 5.

### WHERE

Filters individual rows.

> Which rows should participate?

### GROUP BY

Creates groups.

> How should the remaining rows be divided?

### HAVING

Filters groups.

> Which groups should remain after aggregation?

The conceptual flow is:

`WHERE → GROUP BY → Aggregate → HAVING`

---

# 14. HAVING

`HAVING` is used to filter the results of grouped queries.

It is especially useful when the condition depends on an aggregate value.

Examples of group-level conditions:

* categories with more than 5 products
* customers with at least 3 orders
* departments with average salary above a certain value
* categories with revenue above a certain amount

### Why not use WHERE?

Because `WHERE` operates before grouping and aggregation.

An aggregate such as `COUNT()`, `SUM()`, or `AVG()` has not yet been calculated when `WHERE` is evaluated.

Therefore, conditions involving aggregate results normally belong in `HAVING`.

---

# 15. WHERE and HAVING Together

A query can use both.

Example conceptually:

> Consider only completed orders, group them by category, and keep only categories whose total revenue exceeds 3000.

The process is:

1. `WHERE` removes non-completed order rows.
2. `GROUP BY` creates category groups.
3. Aggregate functions calculate metrics for each category.
4. `HAVING` removes categories that do not satisfy the revenue condition.

This distinction is fundamental:

`WHERE` → row filtering

`HAVING` → group filtering

---

# 16. SQL Logical Processing Order

A useful mental model for understanding complex queries is:

`FROM`

↓

`JOIN`

↓

`WHERE`

↓

`GROUP BY`

↓

`HAVING`

↓

`SELECT`

↓

`ORDER BY`

↓

`LIMIT / OFFSET`

This is a **logical processing model**, not necessarily the exact physical execution plan used internally by the database optimizer.

Understanding this order explains many SQL rules.

For example:

* Why `WHERE` can filter normal rows
* Why aggregate conditions normally use `HAVING`
* Why grouping happens before group filtering
* Why pagination is applied after sorting

---

# 17. JOIN + Aggregation

Aggregation becomes especially useful when data is distributed across related tables.

For example, a sales report may require:

* `orders`
* `order_items`
* `products`
* `categories`

The joins bring related information together.

Then the query can group the combined data and calculate:

* order count
* item quantity
* average unit price
* total revenue

### Important consideration

Joining tables can increase the number of rows in the intermediate result.

This is especially important when one record has many related records.

For example:

One order:

* Keyboard
* Mouse
* USB Hub

After joining with `order_items`, that order contributes three rows.

Therefore, when counting entities after joins, it may be necessary to use:

`COUNT(DISTINCT ...)`

instead of simply `COUNT(*)`.

---

# 18. Calculated Columns

A calculated expression can be produced during a query without being stored in the table.

For sales data:

`quantity × unit_price`

can represent the value of an individual order item.

This is useful because:

* the value can be calculated when needed
* unnecessary duplicate data does not need to be stored
* aggregate functions can operate on the calculated expression

Example concept:

`SUM(quantity × unit_price)`

means:

> Calculate each item's value and then add those values together.

---

# 19. Filtering Before Aggregation

Filtering can change the result of an aggregate.

For example:

> Calculate total revenue only for completed orders.

The conceptual process is:

`All order rows`

↓

`Filter to Completed`

↓

`Calculate revenue`

Therefore, the aggregate is calculated only from the rows that passed the filter.

This is why the placement of `WHERE` is important.

---

# 20. Aggregation and Pagination

Pagination can also be applied to grouped results.

For example:

> Show the top 5 categories by revenue.

The logical process is:

1. Filter relevant rows.
2. Group rows by category.
3. Calculate revenue for every category.
4. Sort categories by revenue.
5. Return only the required number of categories.

This means `LIMIT` can be used to paginate or restrict **grouped report results**, not only raw table rows.

---

# 21. Reporting Query Pattern

A common reporting query follows this structure:

`FROM / JOIN`

↓

`WHERE`

↓

`GROUP BY`

↓

`Aggregate Functions`

↓

`HAVING`

↓

`ORDER BY`

↓

`LIMIT / OFFSET`

Each part has a separate responsibility.

This pattern can be reused for many domains:

* sales systems
* employee management
* student systems
* finance systems
* inventory systems
* analytics dashboards

Only the tables, grouping columns, and business conditions change.

---

# 22. Practical Reporting Questions

The concepts learned can answer questions such as:

### Product reports

* Which products cost more than a certain amount?
* Which products have low stock?
* What are the most expensive products?
* What are the top-selling products?

### Customer reports

* How many orders has each customer placed?
* Which customers placed at least two orders?
* Which customers generated more than a certain amount of revenue?

### Category reports

* How many products belong to each category?
* What is the average price of each category?
* Which categories generated the highest revenue?
* Which categories have revenue above a specified threshold?

### Order reports

* How many orders exist for each status?
* How many completed orders exist?
* What is the total revenue from completed orders?

---

# 23. Common Mistakes

## Mistake 1 — Using aggregate functions in WHERE

Conceptually incorrect:

`WHERE COUNT(*) > 2`

Use:

`HAVING COUNT(*) > 2`

because `COUNT()` is a group-level calculation.

---

## Mistake 2 — Confusing COUNT(*) with COUNT(DISTINCT ...)

After joins, multiple rows may represent the same original entity.

`COUNT(*)`

counts rows in the current result.

`COUNT(DISTINCT id)`

counts unique entities.

---

## Mistake 3 — Forgetting GROUP BY

If a report requires:

> Revenue for each category

then the query needs to group by category.

Without grouping, the aggregate produces one overall result.

---

## Mistake 4 — Filtering after grouping when row filtering was intended

If the requirement is:

> Only completed orders should participate in the calculation.

That is a row-level condition and normally belongs in `WHERE`.

---

## Mistake 5 — Pagination without deterministic sorting

Using `LIMIT/OFFSET` without an appropriate `ORDER BY` can make page contents unpredictable.

For reliable pagination, use a meaningful and deterministic sort.

---

# 24. Day 5 Core Mental Model

The entire session can be remembered with these questions:

```text
WHERE
↓
Which rows?

GROUP BY
↓
Which groups?

COUNT / SUM / AVG / MIN / MAX
↓
What should I calculate?

HAVING
↓
Which groups should remain?

ORDER BY
↓
What order?

LIMIT / OFFSET
↓
Which portion of the result?
```

And the complete flow:

```text
DATA
 ↓
JOIN related data
 ↓
FILTER ROWS
 ↓
GROUP ROWS
 ↓
CALCULATE AGGREGATES
 ↓
FILTER GROUPS
 ↓
SORT RESULTS
 ↓
PAGINATE RESULTS
```

---

# 25. Day 5 Learning Outcome

After completing this session, the key understanding is:

* `WHERE` is used for row-level filtering.
* `ORDER BY` controls result ordering.
* `LIMIT` and `OFFSET` implement pagination.
* Aggregate functions summarize data.
* `GROUP BY` creates groups for separate summaries.
* `HAVING` filters groups after aggregation.
* `WHERE` and `HAVING` solve different problems.
* `COUNT(DISTINCT ...)` is important when joins can duplicate entities.
* Joins allow reports to combine related tables.
* Calculated expressions can be aggregated without storing additional columns.
* Complex reporting queries are built by combining these concepts.
* Understanding the logical query-processing order makes complex SQL easier to reason about.

---

# 26. Day 5 Concept Summary

| Concept           | Purpose                       |
| ----------------- | ----------------------------- |
| `WHERE`           | Filter rows                   |
| `IN`              | Match against multiple values |
| `LIKE`            | Pattern matching              |
| `BETWEEN`         | Range filtering               |
| `ORDER BY`        | Sort results                  |
| `LIMIT`           | Restrict number of results    |
| `OFFSET`          | Skip results                  |
| `COUNT()`         | Count rows/values             |
| `COUNT(DISTINCT)` | Count unique values           |
| `SUM()`           | Calculate total               |
| `AVG()`           | Calculate average             |
| `MIN()`           | Find minimum                  |
| `MAX()`           | Find maximum                  |
| `GROUP BY`        | Create groups                 |
| `HAVING`          | Filter groups                 |
| `JOIN`            | Combine related tables        |

---

# 27. Project Structure Used for Learning

The practical database was designed around a simple sales reporting system:

```text
categories
    │
    └── products
            │
            └── order_items
                    │
                    └── orders
                            │
                            └── customers
```

This structure provided enough realistic relationships to practice:

* filtering
* sorting
* pagination
* joins
* aggregation
* grouping
* `HAVING`
* reporting queries

The SQL implementation and queries are maintained separately in the SQL code file.

---

# 28. Final Understanding

The most important lesson from Day 5 is not memorizing individual queries.

It is learning to translate a requirement into SQL operations.

For example:

> "Show the top 5 customers by completed-order revenue, but only customers whose revenue exceeds 5000."

Think:

```text
completed orders
        ↓
WHERE

group by customer
        ↓
GROUP BY

calculate revenue
        ↓
SUM()

keep revenue > 5000
        ↓
HAVING

highest revenue first
        ↓
ORDER BY

only top 5
        ↓
LIMIT
```

Once this reasoning becomes natural, complex SQL queries become much easier to construct.
