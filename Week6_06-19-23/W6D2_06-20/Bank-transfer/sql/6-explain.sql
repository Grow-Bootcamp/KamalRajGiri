USE day4_bank;

EXPLAIN
SELECT *
FROM transactions
WHERE status = 'COMPLETED';