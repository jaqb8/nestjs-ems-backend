import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { LeaveStatus } from './leave-status.enum';

@Entity()
export class Leave {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  status: LeaveStatus;
}
