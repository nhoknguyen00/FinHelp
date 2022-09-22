import { DataSource } from 'typeorm';
import { UserEntity } from './entities';
import { Helpers } from './utils';

export class MySQLDatabase {
    private static _dataSource: DataSource;

    /** Constructor */
    private constructor() {}

    /**
     * Create MySQL data source
     * @returns MySQL data source, `null` if error
     */
    public static async initDataSource() {
        try {
            const host = process.env.MYSQL_HOST;
            if (!Helpers.isNotBlank(host)) return null;

            const port = Number(process.env.MYSQL_PORT);
            if (!port) return null;

            const username = process.env.MYSQL_USERNAME;
            if (!Helpers.isNotBlank(username)) return null;

            const password = process.env.MYSQL_PASSWORD;

            const database = process.env.MYSQL_DATABASE;
            if (!Helpers.isNotBlank(database)) return null;

            this._dataSource = await new DataSource({
                type: 'mysql',
                host,
                port,
                username,
                password,
                database,
                entities: [UserEntity],
            }).initialize();
            return this._dataSource;
        } catch (e) {
            return null;
        }
    }

    /**
     * Get MySQL entity manager
     * @returns MySQL entity manager
     */
    public static getManager() {
        return this._dataSource.manager;
    }
}
