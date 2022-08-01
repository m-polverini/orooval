import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Locale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  locale: string;

  @Column({ default: true })
  isActive: boolean;
}
