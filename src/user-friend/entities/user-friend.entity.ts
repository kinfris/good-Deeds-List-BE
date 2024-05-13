import { Entity, PrimaryColumn, Unique } from 'typeorm';

@Unique(['userId', 'friendId'])
@Entity('UserFriend')
export class UserFriend {
  @PrimaryColumn({ type: 'integer', nullable: false })
  userId: number;

  @PrimaryColumn({ type: 'integer', nullable: false })
  friendId: number;
}
