import sqlite3
try:
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    print("Existing tables:")
    for table in sorted(tables):
        print(f" - {table}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
