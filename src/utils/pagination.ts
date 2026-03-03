export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getPaginationOptions = (query: any) => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.max(1, parseInt(query.limit as string) || 10);
  const skip = (page - 1) * limit;

  const sortBy = (query.sortBy as string) || 'createdAt';
  const sortOrder = (query.sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';

  return {
    page,
    limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  };
};
