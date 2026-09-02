import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompanyType } from '@prisma/client';
import { Public, Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Public()
  @Get()
  list(
    @Query('companyType') companyType?: string,
    @Query('districtId') districtId?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedIsActive =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.companiesService.list(
      companyType as CompanyType | undefined,
      districtId,
      parsedIsActive,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.companiesService.getById(id);
  }

  @Roles('GOVERNMENT', 'ADMIN')
  @Post()
  create(@Body() dto: CreateCompanyDto, @CurrentUser() actor: JwtPayload) {
    return this.companiesService.create(dto, actor);
  }

  @Roles('GOVERNMENT', 'ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.companiesService.update(id, dto, actor);
  }
}
