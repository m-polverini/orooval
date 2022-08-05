import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false, unique: true })
  email: string;
  @Column({ nullable: false })
  @Exclude()
  password: string;
  @Column({ name: 'is_active', nullable: false, default: false })
  isActive: boolean;
  @Column({ name: 'is_banned', nullable: false, default: false })
  isBanned: boolean;
  @Column({ nullable: true })
  name?: string;
  @Column({ nullable: true })
  surname?: string;
  @Column({ name: 'display_name', nullable: true })
  displayName?: string;
  @Column({ name: 'birth_data', nullable: true })
  birthData?: Date;
  @Column({ name: 'refresh_token', nullable: true })
  @Exclude()
  refreshToken?: string;
  @Column({ name: 'token_data', nullable: true })
  @Exclude()
  tokenData?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
