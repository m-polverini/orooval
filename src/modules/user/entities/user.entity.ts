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
  @Column({ nullable: false, default: false })
  isActive: boolean;
  @Column({ nullable: false, default: false })
  isBanned: boolean;
  @Column({ nullable: true })
  name?: string;
  @Column({ nullable: true })
  surname?: string;
  @Column({ nullable: true })
  displayName?: string;
  @Column({ nullable: true })
  birthData?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
