CREATE DATABASE day4_transactions;

USE day4_transactions;

CREATE TABLE accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    account_name VARCHAR(100) NOT NULL,
    balance DECIMAL(10,2) NOT NULL
);

INSERT INTO accounts (account_name, balance)
VALUES
('Kamal', 1000.00),
('Aagyat', 500.00);

SELECT * FROM accounts;

START TRANSACTION;

UPDATE accounts
SET balance = balance - 100
WHERE account_id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE account_id = 2;

COMMIT;

-- 

START TRANSACTION;

UPDATE accounts
SET balance = balance - 50
WHERE account_id = 1;
SAVEPOINT after_kamal;

UPDATE accounts
SET balance = balance + 50
WHERE account_id = 2;

SELECT * FROM accounts;
ROLLBACK TO after_kamal;
SELECT * FROM accounts;

UPDATE accounts
SET balance = balance + 25
WHERE account_id = 2;

COMMIT;
SELECT * FROM accounts;
