import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Ana Pérez" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: "ana@backend-nestjs.local" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Secreta123!" })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ format: "uuid" })
  @IsUUID()
  tenantId!: string;
}
