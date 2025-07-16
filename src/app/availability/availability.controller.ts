import { Controller, Get } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

    @Get('/rooms')
    findRooms() {
    return this.availabilityService.findRooms();
    }

    @Get('/professors')
    findProfessors() {
    return this.availabilityService.findProfessors();
    }
}
