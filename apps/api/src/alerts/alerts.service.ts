import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertsService {
  list() {
    return [];
  }

  getById(id: string) {
    return { id, status: 'active' };
  }

  create(payload: unknown) {
    return { id: 'development-alert', payload };
  }

  update(id: string, payload: unknown) {
    return { id, payload };
  }
}

