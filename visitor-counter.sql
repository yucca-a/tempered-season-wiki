CREATE TABLE IF NOT EXISTS wiki_visitors (
    id TEXT PRIMARY KEY,
    last_day TEXT NOT NULL
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS wiki_visitor_counts (
    bucket TEXT PRIMARY KEY,
    count INTEGER NOT NULL
) WITHOUT ROWID;

CREATE TRIGGER IF NOT EXISTS wiki_visitor_first_visit
AFTER INSERT ON wiki_visitors
BEGIN
    INSERT INTO wiki_visitor_counts (bucket, count) VALUES ('total', 1), (NEW.last_day, 1)
    ON CONFLICT (bucket) DO UPDATE SET count = count + 1;
END;

CREATE TRIGGER IF NOT EXISTS wiki_visitor_new_day
AFTER UPDATE OF last_day ON wiki_visitors
WHEN NEW.last_day > OLD.last_day
BEGIN
    INSERT INTO wiki_visitor_counts (bucket, count) VALUES (NEW.last_day, 1)
    ON CONFLICT (bucket) DO UPDATE SET count = count + 1;
END;
