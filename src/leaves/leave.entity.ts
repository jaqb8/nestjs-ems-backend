import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { LeaveStatus } from './leave-status.enum';

@Entity()
export class Leave {
  @ObjectIdColumn()
  _id: String;

  @PrimaryColumn()
  id: String;

  @Column()
  startDate: String;

  @Column()
  endDate: String;

  @Column()
  status: LeaveStatus;
}
