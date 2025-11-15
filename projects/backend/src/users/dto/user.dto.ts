import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({ example: 1, type: Number })
  userId!: number;

  @ApiProperty({ example: "john@example.com", type: String })
  email!: string;
}
