-- Seed 10 random books with 5 copies each (statusId=1 is "available")
-- Uses authorIds 1, 2, 3 which exist in the database

BEGIN;

-- Insert 10 books across 3 authors
INSERT INTO lib_books (title, "authorId", price, fee, "createdAt", "updatedAt")
VALUES
  ('The Great Gatsby',       1, 25.00, 5.00, NOW(), NOW()),
  ('To Kill a Mockingbird',  1, 30.00, 6.00, NOW(), NOW()),
  ('1984',                   2, 20.00, 4.00, NOW(), NOW()),
  ('Pride and Prejudice',    2, 22.00, 4.50, NOW(), NOW()),
  ('The Catcher in the Rye', 3, 18.00, 3.00, NOW(), NOW()),
  ('Brave New World',        1, 24.00, 5.00, NOW(), NOW()),
  ('The Hobbit',             2, 28.00, 6.00, NOW(), NOW()),
  ('Fahrenheit 451',         3, 19.00, 4.00, NOW(), NOW()),
  ('Moby Dick',              1, 26.00, 5.00, NOW(), NOW()),
  ('War and Peace',          3, 35.00, 7.00, NOW(), NOW());

-- Insert 5 copies per book (all available, statusId=1)
-- Uses a cross join: for each newly inserted book, generate 5 copy rows
INSERT INTO lib_copy ("bookId", "statusId", "createdAt", "updatedAt")
SELECT b.id, 1, NOW(), NOW()
FROM lib_books b
  CROSS JOIN generate_series(1, 5)
WHERE b.title IN (
  'The Great Gatsby',
  'To Kill a Mockingbird',
  '1984',
  'Pride and Prejudice',
  'The Catcher in the Rye',
  'Brave New World',
  'The Hobbit',
  'Fahrenheit 451',
  'Moby Dick',
  'War and Peace'
)
AND b."deletedAt" IS NULL;

COMMIT;
