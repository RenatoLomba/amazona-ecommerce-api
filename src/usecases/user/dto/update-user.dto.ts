import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Field "name" is required' })
  @IsString({ message: 'Field "name" is of type string' })
  @IsOptional()
  name?: string;

  @IsNotEmpty({ message: 'Field "email" is required' })
  @IsString({ message: 'Field "email" is of type string' })
  @IsEmail(
    { allow_ip_domain: false },
    { message: 'Field "email" must be a valid E-mail' },
  )
  @IsOptional()
  email?: string;

  @IsNotEmpty({ message: 'Field "password" is required' })
  @IsString({ message: 'Field "password" is of type string' })
  @MinLength(8, { message: 'Field "password" must have 8-16 characters' })
  @MaxLength(16, { message: 'Field "password" must have 8-16 characters' })
  @IsOptional()
  password?: string;
}
