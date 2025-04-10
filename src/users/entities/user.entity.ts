import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User as IUser } from '../user.interface';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  role: string;

  @Column({ type: 'int', nullable: false })
  efficiency: number;
}
