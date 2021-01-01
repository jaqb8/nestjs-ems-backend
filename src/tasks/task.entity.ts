import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  duration: string;

  @Column()
  status: TaskStatus;
}
