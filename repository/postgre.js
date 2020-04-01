const databaseUrl = process.env.DATABASE_URL || 'postgres://taussjwjzozqga:764f36b6b3a9f0dd85ca7e2143ef24302bb0f283096e4ac2cd0c2bc80120296e@ec2-52-207-93-32.compute-1.amazonaws.com:5432/d9p6h72vsmi2k6';
const postgre = require('pg');
const databasePool = new postgre.Pool({
    connectionString: databaseUrl
});

const createUser = async (name) => {
    console.info('POSTGRE:User-Insert:' + name);

    const params = [];
    params.push(name);

    try {
        const response = await databasePool.query('insert into users (name) values ($1) returning *', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:User-Error');
        console.error(error);
    }
};

const deleteUser = (id) => {
    console.info('POSTGRE:User-Delete:' + id);
};

const findAllUsers = () => {
    console.info('POSTGRE:User-Find');
};

const findUserById = (id) => {
    console.info('POSTGRE:User-Find:' + name);
};

module.exports = {
    user: {
        create: createUser,
        delete: deleteUser,
        findAll: findAllUsers,
        findById: findUserById
    }
};