export const apiPrefix = '/api/v1';

export const routes = {
  health: `${apiPrefix}/health`,
  auth: {
    register: `${apiPrefix}/auth/register`,
    login: `${apiPrefix}/auth/login`,
    refresh: `${apiPrefix}/auth/refresh`,
    logout: `${apiPrefix}/auth/logout`,
    profile: `${apiPrefix}/auth/profile`,
  },
  locations: {
    divisions: `${apiPrefix}/locations/divisions`,
    districts: `${apiPrefix}/locations/districts`,
    district: (id: string) => `${apiPrefix}/locations/districts/${id}`,
    upazilas: `${apiPrefix}/locations/upazilas`,
    unions: `${apiPrefix}/locations/unions`,
  },
  datasets: {
    list: `${apiPrefix}/datasets`,
    detail: (id: string) => `${apiPrefix}/datasets/${id}`,
    currentWeather: `${apiPrefix}/datasets/weather/current`,
    currentAirQuality: `${apiPrefix}/datasets/air-quality/current`,
  },
  reports: {
    list: `${apiPrefix}/reports`,
    detail: (id: string) => `${apiPrefix}/reports/${id}`,
    status: (id: string) => `${apiPrefix}/reports/${id}/status`,
  },
  alerts: {
    list: `${apiPrefix}/alerts`,
    detail: (id: string) => `${apiPrefix}/alerts/${id}`,
  },
} as const;

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
