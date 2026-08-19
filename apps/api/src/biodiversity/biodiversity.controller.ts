import { Controller, Get, Param, Query } from '@nestjs/common';
import { BiodiversityService } from './biodiversity.service';
import { Public } from '../common/decorators/roles.decorator';

@Controller('biodiversity')
export class BiodiversityController {
  constructor(private readonly biodiversityService: BiodiversityService) {}

  @Public()
  @Get('species')
  listSpecies(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.biodiversityService.list(search, Number(page ?? 1), Number(pageSize ?? 20));
  }

  @Public()
  @Get('species/:id')
  getSpeciesById(@Param('id') id: string) {
    return this.biodiversityService.getSpeciesById(id);
  }

  @Public()
  @Get('occurrences')
  listOccurrences(
    @Query('speciesId') speciesId?: string,
    @Query('districtId') districtId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.biodiversityService.listOccurrences(
      speciesId,
      districtId,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }
}
