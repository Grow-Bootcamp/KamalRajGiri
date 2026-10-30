CREATE DATABASE rbac_demo;
SHOW DATABASES LIKE 'rbac_demo';

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'moderator', 'admin')
    NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id)
);

USE rbac_demo;

-- First test: moderator permissions
UPDATE users
SET role = 'moderator'
WHERE email = 'demo@example.com';

SELECT id, email, role
FROM users
WHERE email = 'demo@example.com';