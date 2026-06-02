#!/usr/bin/env python3
import csv
import sqlite3
import sys
from datetime import datetime

DB_PATH = sys.argv[1] if len(sys.argv) > 1 else "./db/data.sqlite"
OUTPUT = sys.argv[2] if len(sys.argv) > 2 else f"export_{datetime.now().strftime('%Y%m%d')}.csv"

conn = sqlite3.connect(DB_PATH)
rows = conn.execute("""
    SELECT t.date, t.type, t.amount, c.name as category, t.description
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    ORDER BY t.date DESC
""").fetchall()

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["Fecha", "Tipo", "Monto", "Categoría", "Descripción"])
    w.writerows(rows)

print(f"Exportadas {len(rows)} transacciones a {OUTPUT}")
conn.close()
