import { Injectable } from '@nestjs/common';

const districts = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    division: 'Dhaka',
    country: 'Bangladesh',
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    division: 'Sylhet',
    country: 'Bangladesh',
  },
];

@Injectable()
export class LocationsService {
  getDivisions() {
    return [
      { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh' },
      { id: 'sylhet', name: 'Sylhet', country: 'Bangladesh' },
    ];
  }

  getDistricts() {
    return districts;
  }

  getDistrict(id: string) {
    return districts.find((district) => district.id === id) ?? null;
  }

  getUpazilas() {
    return [];
  }

  getUnions() {
    return [];
  }
}

