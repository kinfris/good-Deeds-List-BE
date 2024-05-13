import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('User')
export class User {
  @Column({
    type: 'integer',
    generated: 'increment',
    primary: true,
    unique: true,
  })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 45, unique: true, nullable: false })
  displayName: string;

  @Column({ type: 'varchar', nullable: false })
  passwordHash: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'UserFriend',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friendId',
      referencedColumnName: 'id',
    },
  })
  friends: User[];
}
