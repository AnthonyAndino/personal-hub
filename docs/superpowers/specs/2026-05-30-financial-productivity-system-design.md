# Sistema de Gestión Financiera y Productividad Personal

## Stack
- **Frontend:** Astro + Preact (islas de interactividad)
- **ORM:** Drizzle ORM
- **BD:** SQLite (`better-sqlite3`) → PostgreSQL (`pg`)
- **Package manager:** pnpm
- **Estilos:** Tailwind CSS
- **Testing:** Vitest + Playwright
- **Lenguajes:** TypeScript (principal) + Python (scripts exportación/análisis)

## Arquitectura

```
task-personals/
├── astro.config.ts
├── package.json
├── drizzle.config.ts
├── tailwind.config.ts
├── .env
├── db/
│   ├── schema/
│   │   ├── index.ts
│   │   ├── finances.ts
│   │   ├── todos.ts
│   │   └── wishlist.ts
│   ├── migrations/
│   ├── seed.ts
│   └── index.ts
├── src/
│   ├── components/
│   │   ├── ui/
│   │   └── widgets/
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── finances/
│   │   ├── todos/
│   │   ├── wishlist/
│   │   └── api/
│   ├── lib/
│   │   ├── db.ts
│   │   └── formats.ts
│   └── services/
│       ├── finances.ts
│       ├── todos.ts
│       └── wishlist.ts
├── python/
│   ├── requirements.txt
│   └── export_csv.py
└── public/
```

## Schema de Base de Datos

### categories
| Columna | Tipo | Notas |
|---|---|---|
| id | integer PK | autoincrement |
| name | text | |
| type | text | "income" o "expense" |
| icon | text | nullable |
| color | text | nullable |

### transactions
| Columna | Tipo | Notas |
|---|---|---|
| id | integer PK | |
| category_id | integer FK → categories | |
| type | text | "income" o "expense" |
| amount | real | positivo siempre |
| description | text | nullable |
| date | text | ISO 8601 |
| created_at | text | |

### budgets
| Columna | Tipo | Notas |
|---|---|---|
| id | integer PK | |
| category_id | integer FK → categories | UNIQUE |
| monthly_limit | real | |
| alert_threshold | real | default 0.8 |

### projects
| Columna | Tipo |
|---|---|
| id | integer PK |
| name | text |
| color | text |

### todos
| Columna | Tipo | Notas |
|---|---|---|
| id | integer PK | |
| project_id | integer FK → projects | nullable |
| title | text | |
| description | text | nullable |
| priority | text | low, medium, high, critical |
| status | text | pending, in_progress, done, cancelled |
| due_date | text | nullable |
| position | integer | |
| created_at | text | |

### tags
| Columna | Tipo |
|---|---|
| id | integer PK |
| name | text |
| color | text |

### todos_tags (N:M)
| Columna | Tipo |
|---|---|
| todo_id | integer FK → todos |
| tag_id | integer FK → tags |

### wishlist_items
| Columna | Tipo | Notas |
|---|---|---|
| id | integer PK | |
| name | text | |
| estimated_price | real | |
| saved_amount | real | default 0 |
| priority | text | low, medium, high |
| target_date | text | nullable |
| url | text | nullable |
| notes | text | nullable |
| purchased | integer | default 0 |
| created_at | text | |

## Islas de Interactividad

Cada isla Preact recibe datos serializados desde el frontmatter de Astro (SSR) y hace fetch a endpoints API solo para mutaciones.

| Isla | Módulo | Función |
|---|---|---|
| TransactionForm | Finanzas | CRUD transacciones |
| TransactionList | Finanzas | Lista con filtros |
| BudgetChart | Finanzas | Gráfica donut de gastos |
| BalanceWidget | Dashboard | KPI de balance |
| TodoList | To-Do | Kanban drag & drop |
| TodoForm | To-Do | Crear/editar tareas |
| WishlistGrid | Deseos | Tarjetas con progreso |
| WishlistForm | Deseos | CRUD deseos |
| CsvImport | Finanzas | Subir CSV y mapear |
| DashboardGrid | Dashboard | Disposición de widgets |

## API Endpoints

- `POST/GET /api/transactions`, `PUT/DELETE /api/transactions/[id]`
- `POST/GET /api/budgets`, `PUT /api/budgets/[id]`
- `POST/GET /api/todos`, `PUT/DELETE /api/todos/[id]`
- `POST /api/todos/reorder`
- `POST/GET /api/projects`, `PUT/DELETE /api/projects/[id]`
- `POST/GET /api/tags`
- `POST/GET /api/wishlist`, `PUT/DELETE /api/wishlist/[id]`
- `POST /api/import/csv`
- Respueta estándar: `{ ok: true, data }` | `{ ok: false, error }`

## Layout

Dashboard: 3 KPIs arriba (gastos mes, compras próximas, tareas pendientes), gráfica donut al medio, lista de alertas abajo. Nav lateral con Finanzas → Tareas → Deseos → Dashboard.

## Seguridad

- pnpm strict, auditoría regular
- Drizzle ORM parametrizado
- Zod para validación de inputs en endpoints
- .env en .gitignore
- Sin librerías UI externas (solo Tailwind + Preact)

## Testing

- Vitest: lógica de servicios (cálculos financieros, formatos)
- Playwright: flujos críticos E2E (crear transacción, mover tarea kanban)
