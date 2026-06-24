CREATE TABLE category (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP
);

CREATE TABLE transaction (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES category(id),
  amount INT NOT NULL,
  date date NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP
);