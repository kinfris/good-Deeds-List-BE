import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity('GoodDeed')
export class GoodDeed {
  @Column({
    type: 'integer',
    generated: 'increment',
    primary: true,
    unique: true,
  })
  id: number;

  @Column({ type: 'integer', nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
