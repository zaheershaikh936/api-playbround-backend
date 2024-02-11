import { Logger } from '@nestjs/common';

export const paginate = (limit: number, page: number) => {
  let skip = 0;
  Logger.debug(!page);
  if (!page || !limit) return { skip, get: 10, current: 1 };
  if (page !== 1) {
    skip = (page - 1) * limit;
    limit = page * limit;
  }
  return { skip, get: limit, current: page };
};
