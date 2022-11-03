import { Repository } from 'typeorm';
import { MySQLDatabase } from '../../database';
import { UserEntity } from '../../entities';

export default class UserRepository {
    private static _instance: Repository<UserEntity>;

    /** Constructor */
    private constructor() {}

    /**
     * Get instance
     */
    public static getInstance() {
        if (!this._instance) {
            this._instance = MySQLDatabase.getManager().getRepository(UserEntity).extend({});
        }
        return this._instance;
    }
}
