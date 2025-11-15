import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({ example: "john@example.com", type: String })
  email!: string;

  @ApiProperty({ example: "changeme", type: String })
  password!: string;
}
