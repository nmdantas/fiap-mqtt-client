const postgre = require('pg');
const databasePool = new postgre.Pool({
    connectionString: process.env.DATABASE_URL
});

const create = async (name) => {
    console.info('POSTGRE:User-Insert:' + name);

    const params = [];
    params.push(name);

    try {
        const response = await databasePool.query('insert into users (name) values ($1) returning *', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:User-Insert-Error');
        console.error(error);
    }
};

const exclude = async (id) => {
    console.info('POSTGRE:User-Delete:' + id);

    const params = [];
    params.push(id);

    try {
        const response = await databasePool.query('delete from users where id = $1 returning *', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:User-Delete-Error');
        console.error(error);
    }
};

const findAll = async () => {
    console.info('POSTGRE:User-Find');

    const params = [];

    try {
        const response = await databasePool.query('select * from users', params);

        return response.rows;
    } catch (error) {
        console.error('POSTGRE:User-Find-Error');
        console.error(error);

        return [];
    }
};

const findById = async (id) => {
    console.info('POSTGRE:User-Find:' + id);

    const params = [];
    params.push(id);

    try {
        const response = await databasePool.query('select * from users where id = $1', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:User-Find-Error');
        console.error(error);
    }
};

module.exports = {
    create: create,
    delete: exclude,
    findAll: findAll,
    findById: findById
};