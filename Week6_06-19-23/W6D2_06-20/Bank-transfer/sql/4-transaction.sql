USE day4_bank;

-- COMMITTING A TRANSACTION
START TRANSACTION;

UPDATE accounts
SET balance = balance -200
where id = 1;

UPDATE accounts
SET balance = balance + 200
where id = 2;

INSERT INTO transactions (from_account_id, to_account_id, amount, status)
VALUES (1, 2, 200, 'Completed');

COMMIT;

-- CHECKING THE DATA
SELECT * FROM accounts;
SELECT * FROM transactions;

-- Testing ROLLBACK
START TRANSACTION;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;
-- Before ROLLBACK, check the balances after the updates
SELECT id, account_name, balance
FROM accounts;

ROLLBACK;
-- After ROLLBACK, check the balances again to ensure they are unchanged
SELECT id, account_name, balance
FROM accounts;


-- SAVEPOINTS
START TRANSACTION;

UPDATE accounts
SET balance = balance - 50
WHERE id = 1;

SAVEPOINT after_kamal;

UPDATE accounts
SET balance = balance + 50
WHERE id = 2;

ROLLBACK TO after_kamal;

COMMIT;



