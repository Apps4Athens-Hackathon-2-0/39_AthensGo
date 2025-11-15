import { Injectable } from "@nestjs/common";
import { User } from "./entities";

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      email: "john@example.com",
      password: "changeme",
    },
    {
      userId: 2,
      email: "maria@example.com",
      password: "guess",
    },
  ];

  // eslint-disable-next-line @typescript-eslint/require-await
  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
