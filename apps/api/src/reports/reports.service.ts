import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  create(payload: unknown) {
    return {
      id: 'development-report',
      status: 'submitted',
      payload,
    };
  }

  list() {
    return [];
  }

  getById(id: string) {
    return {
      id,
      status: 'submitted',
    };
  }

  updateStatus(id: string, payload: unknown) {
    return {
      id,
      payload,
    };
  }
}

