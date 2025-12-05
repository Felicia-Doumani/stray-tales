CREATE TABLE Animal (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  shortSlug TEXT UNIQUE NOT NULL,
  description TEXT,
  location TEXT,
  status TEXT,
  date DATE,
  imageUrls TEXT[],
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE BlogPost (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  coverImage TEXT,
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE AdminUser (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);
