import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {
  @ObjectIdColumn()
  _id: String;

  @PrimaryColumn()
  id: String;

  @Column()
  title: String;

  @Column()
  description: String;

  @Column()
  duration: String;

  @Column()
  status: TaskStatus;
}
