import type { SQL } from "bun";
import type { User } from "@/core/entities/User";
import type { IUserRepositoryPort } from "@/core/ports/outgoing";

export class UserRepository implements IUserRepositoryPort {
  private db: SQL;
  
  constructor(db: SQL) {
    this.db = db;
  }

  async findById(id: number): Promise<User | null> {
      const result = await this.db`SELECT * FROM users WHERE id = ${id}`;
      return result.length > 0 ? result[0] as User : null;
  }

  async create(user: User): Promise<User> {
      const [id] = await this.db`INSERT INTO users (name, email) VALUES (${user.name}, ${user.email}) RETURNING id`;
      user.id = id;
      return user;
  }
  
  async update(user: User): Promise<User> {
      await this.db`UPDATE users SET name = ${user.name}, email = ${user.email} WHERE id = ${user.id}`;
      return user
  }
  
  async getAll(): Promise<User[]> {
      return await this.db`SELECT * FROM users` as User[];
  }
}
