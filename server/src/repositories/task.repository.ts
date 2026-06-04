import { query } from '../db/index';
import { Task, CreateTaskDto, UpdateTaskDto, TaskFilters, PaginatedResponse } from '../types/task.types';

export const findAll = async (filters: TaskFilters): Promise<PaginatedResponse<Task>> => {
  const { status, search, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }

  if (search) {
    conditions.push(`title ILIKE $${paramIndex++}`);
    params.push(`%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query(
    `SELECT COUNT(*) FROM tasks ${where}`,
    params
  );
  const total = parseInt(countResult.rows[0].count);

  const dataResult = await query(
    `SELECT * FROM tasks ${where} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    [...params, limit, offset]
  );

  return {
    data: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const findById = async (id: string): Promise<Task | null> => {
  const result = await query(`SELECT * FROM tasks WHERE id = $1`, [id]);
  return result.rows[0] || null;
};


export const create = async (dto: CreateTaskDto): Promise<Task> => {
  const { title, description = null, status = 'todo' } = dto;
  const result = await query(
    `INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *`,
    [title, description, status]
  );
  return result.rows[0];
};

export const update = async (id: string, dto: UpdateTaskDto): Promise<Task | null> => {
  const fields: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (dto.title !== undefined) {
    fields.push(`title = $${paramIndex++}`);
    params.push(dto.title);
  }
  if (dto.description !== undefined) {
    fields.push(`description = $${paramIndex++}`);
    params.push(dto.description);
  }
  if (dto.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    params.push(dto.status);
  }

  if (!fields.length) return findById(id);

  params.push(id);
  const result = await query(
    `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    params
  );
  return result.rows[0] || null;
};

export const remove = async (id: string): Promise<boolean> => {
  const result = await query(`DELETE FROM tasks WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
};