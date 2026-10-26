USE day4_bank;

CREATE INDEX idx_transactions_status
ON transactions(status);

CREATE INDEX idx_transactions_from_account
ON transactions(from_account_id);

CREATE INDEX idx_status_created
ON transactions(status, created_at);