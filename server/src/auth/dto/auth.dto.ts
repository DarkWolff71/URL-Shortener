import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDTO {
  @IsString()
  @IsNotEmpty()
  handle: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignupDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  handle: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  handle: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
