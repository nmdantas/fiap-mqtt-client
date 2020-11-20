const postgre = require('pg');
const databasePool = new postgre.Pool({
    connectionString: process.env.DATABASE_URL
});

const create = async (establishment) => {
    console.info('POSTGRE:Establishment-Insert:' + JSON.stringify(establishment));

    const params = [];
    params.push(establishment.document_number);
    params.push(establishment.name);
    params.push(`(${establishment.latitude},${establishment.longitude})`);
    params.push(establishment.head_office_id);
    params.push(new Date());

    try {
        const response = await databasePool.query('insert into establishments (document_number, name, location, head_office_id, insert_date) values ($1, $2, $3, $4, $5) returning *', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:Establishment-Insert-Error');
        console.error(error);
    }
};

const exclude = async (id) => {
    console.info('POSTGRE:Establishment-Delete:' + id);

    const params = [];
    params.push(id);

    try {
        const response = await databasePool.query('update establishments set active = false where id = $1 returning *', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:Establishment-Delete-Error');
        console.error(error);
    }
};

const findAll = async (active) => {
    console.info('POSTGRE:Establishment-Find');

    const params = [];

    try {
        if (active === undefined) {
            const response = await databasePool.query('select e.id,e.document_number,e.name,e.location,e.head_office_id,e.active,e.insert_date,count(a.id) assets_count,coalesce(sum(a.replenishment), 0) replenishment_value from establishments e left join assets a on e.id = a.establishment_id group by e.id,e.document_number,e.name,e.head_office_id,e.active,e.insert_date', params);

            return response.rows;
        } else {
            params.push(active);
            const response = await databasePool.query('select e.id,e.document_number,e.name,e.location,e.head_office_id,e.active,e.insert_date,count(a.id) assets_count,coalesce(sum(a.replenishment), 0) replenishment_value from establishments e left join assets a on e.id = a.establishment_id  where active = $1 group by e.id,e.document_number,e.name,e.head_office_id,e.active,e.insert_date', params);

            return response.rows;
        }
    } catch (error) {
        console.error('POSTGRE:Establishment-Find-Error');
        console.error(error);

        return [];
    }
};

const findById = async (id) => {
    console.info('POSTGRE:Establishment-Find:' + id);

    const params = [];
    params.push(id);

    try {
        const response = await databasePool.query('select * from establishments where id = $1', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:Establishment-Find-Error');
        console.error(error);
    }
};

module.exports = {
    create: create,
    delete: exclude,
    findAll: findAll,
    findById: findById
};