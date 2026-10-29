USE day4_bank;

INSERT INTO accounts (account_name, email, balance)
VALUES
('Kamal', 'kamal@example.com', 1000.00),
('Aagyat', 'aagyat@example.com', 500.00),
('Anjana', 'anjana@example.com', 750.00);

-- CHECKING THE DATA
SELECT * FROM accounts;
DESCRIBE accounts;
DESCRIBE transactions;

