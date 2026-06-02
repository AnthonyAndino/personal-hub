import { db } from "../../db"
import { todos, projects, tags, todosTags } from "../../db/schema/todos"
import { eq, and, desc, asc } from "drizzle-orm"

export function listTodos(opts?: { status?: string; projectId?: number }) {
    const conditions = []
    if (opts?.status) conditions.push(eq(todos.status, opts.status))
    if (opts?.projectId) conditions.push(eq(todos.projectId, opts.projectId))
    return db.select().from(todos).where(conditions.length ? and(...conditions) : undefined).orderBy(asc(todos.position), desc(todos.createdAt)).all()
}

export function createTodo(data: { title: string; projectId?: number; description?: string; priority?: string; dueDate?: string; tagIds?: number[] }) {
    const todo = db.insert(todos).values({ title: data.title, projectId: data.projectId, description: data.description, priority: data.priority as any, dueDate: data.dueDate }).returning().get()
    if (data.tagIds?.length) {
        db.insert(todosTags).values(data.tagIds.map(tagId => ({ todoId: todo.id, tagId }))).run()
    }
    return todo
}

export function updateTodo(id: number, data: Partial<{ title: string; projectId: number | null; description: string; priority: string; status: string; dueDate: string | null; position: number; tagIds: number[] }>) {
    const { tagIds, ...todoData } = data
    if (tagIds) {
        db.delete(todosTags).where(eq(todosTags.todoId, id)).run()
        if (tagIds.length) db.insert(todosTags).values(tagIds.map(tagId => ({ todoId: id, tagId }))).run()
    }
    return db.update(todos).set(todoData as any).where(eq(todos.id, id)).returning().get()
}

export function deleteTodo(id: number) {
    db.delete(todosTags).where(eq(todosTags.todoId, id)).run()
    return db.delete(todos).where(eq(todos.id, id)).run()
}

export function reorderTodos(ordered: { id: number; position: number; status: string }[]) {
    for (const item of ordered) {
        db.update(todos).set({ position: item.position, status: item.status as any }).where(eq(todos.id, item.id)).run()
    }
    return true
}

export function listProjects() {
    return db.select().from(projects).all()
}

export function createProject(data: { name: string; color?: string }) {
    return db.insert(projects).values(data).returning().get()
}

export function listTags() {
    return db.select().from(tags).all()
}

export function createTag(data: { name: string; color?: string }) {
    return db.insert(tags).values(data).returning().get()
}

