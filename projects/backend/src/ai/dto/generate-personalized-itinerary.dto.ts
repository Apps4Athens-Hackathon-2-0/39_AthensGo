import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class GeneratePersonalizedItineraryDto {
  @ApiProperty({
    description: 'The start and end dates of the trip.',
    example: '2024-08-15 to 2024-08-20',
  })
  @IsString()
  tripDates: string;

  @ApiProperty({
    description: 'The number of days for the trip.',
    example: 5,
  })
  @IsNumber()
  numberOfDays: number;

  @ApiProperty({
    description: 'The budget for the trip.',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  @IsEnum(['low', 'medium', 'high'])
  budget: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'The interests of the traveler.',
    example: 'history, food, beaches',
  })
  @IsString()
  interests: string;

  @ApiProperty({
    description: 'The travel style of the traveler.',
    enum: ['relaxed', 'packed'],
    example: 'relaxed',
  })
  @IsEnum(['relaxed', 'packed'])
  travelStyle: 'relaxed' | 'packed';

  @ApiProperty({
    description: 'The type of companions for the trip.',
    enum: ['solo', 'couple', 'family', 'friends'],
    example: 'couple',
  })
  @IsEnum(['solo', 'couple', 'family', 'friends'])
  companionType: 'solo' | 'couple' | 'family' | 'friends';
}
