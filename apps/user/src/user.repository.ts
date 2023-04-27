import { EntityRepository, Repository } from 'typeorm';
import { User } from './entity/user.entity';

@EntityRepository(User)
export class userRepository extends Repository<User>{}