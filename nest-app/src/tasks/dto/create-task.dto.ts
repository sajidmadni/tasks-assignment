import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  assignedTo?: number; // User ID
}
