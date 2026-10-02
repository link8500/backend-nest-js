import { ApiProperty } from "@nestjs/swagger";

export class UserEntity {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "Ana Pérez" })
  name!: string;

  @ApiProperty({ example: "ana@backend-nestjs.local" })
  email!: string;

  @ApiProperty({ format: "uuid" })
  tenantId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
