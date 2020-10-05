const postgre = require('pg');
const databasePool = new postgre.Pool({
    connectionString: process.env.DATABASE_URL
});

const create = async (asset) => {
    console.info('POSTGRE:Asset-Insert:' + JSON.stringify(asset));

    const params = [];
    params.push(asset.asset_serial_number);
    params.push(asset.gps_serial_number);
    params.push(asset.description);
    params.push(asset.type);
    params.push(asset.establishment_id);

    try {
        const response = await databasePool.query('insert into assets (asset_serial_number, gps_serial_number, description, type, establishment_id) values ($1, $2, $3, $4, $5) returning *', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:Asset-Insert-Error');
        console.error(error);
    }
};

const exclude = async (id) => {
    console.info('POSTGRE:Asset-Delete:' + id);

    const params = [];
    params.push(id);

    try {
        const response = await databasePool.query('update assets set active = false where id = $1 returning *', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:Asset-Delete-Error');
        console.error(error);
    }
};

const associate = async (establishmentId, assetId) => {
    console.info('POSTGRE:Asset-Associate:' + establishmentId + ',' + assetId);

    const params = [];
    params.push(establishmentId);
    params.push(assetId);

    try {
        const response = await databasePool.query('update assets set establishment_id = $1 where id = $2 returning *', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:Asset-Associate-Error');
        console.error(error);
    }
};

const updateLocation = async (id, location) => {
    console.info('POSTGRE:Asset-Update-Location:' + id);

    const params = [];
    params.push(id);
    params.push(`(${location.latitude},${location.longitude})`);
    params.push(location.timestamp);
    params.push(JSON.stringify(location.metadata));

    try {
        const response = await databasePool.query('update assets set last_location = $2, last_update = $3, metadata = $4 where id = $1 returning *', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:Asset-Update-Location-Error');
        console.error(error);
    }
};

const findAll = async (active) => {
    console.info('POSTGRE:Asset-Find');

    const params = [];

    try {
        if (active === undefined) {
            const response = await databasePool.query('select a.*, current_timestamp - a.last_update as update_interval from assets a', params);

            return response.rows;
        } else {
            params.push(active);
            const response = await databasePool.query('select a.*, current_timestamp - a.last_update as update_interval from assets a where a.active = $1', params);

            return response.rows;
        }
    } catch (error) {
        console.error('POSTGRE:Asset-Find-Error');
        console.error(error);

        return [];
    }
};

const findById = async (id) => {
    console.info('POSTGRE:Asset-Find:' + id);

    const params = [];
    params.push(id);

    try {
        const response = await databasePool.query('select a.*, current_timestamp - a.last_update as update_interval from assets a where a.id = $1', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:Asset-Find-Error');
        console.error(error);
    }
};

const findByEstablishmentId = async (establishmentId) => {
    console.info('POSTGRE:Asset-Find-By-Establishment:' + establishmentId);

    const params = [];
    params.push(establishmentId);

    try {
        const response = await databasePool.query('select a.*, current_timestamp - a.last_update as update_interval from assets a where a.establishment_id = $1', params);

        return response.rows;
    } catch (error) {
        console.error('POSTGRE:Asset-Find-By-Establishment-Error');
        console.error(error);
    }
};

const findBySerialNumber = async (serialNumber) => {
    console.info('POSTGRE:Asset-Find-By-Serial-Number:' + serialNumber);

    const params = [];
    params.push(serialNumber);

    try {
        const response = await databasePool.query('select a.*, current_timestamp - a.last_update as update_interval from assets a where a.gps_serial_number = $1', params);

        return response.rows[0];
    } catch (error) {
        console.error('POSTGRE:Asset-Find-By-Serial-Number-Error');
        console.error(error);

        return null;
    }
};

const findLogsById = async (id) => {
    console.info('POSTGRE:Asset-Find-Logs:' + id);

    const params = [];
    params.push(id);

    try {
        const response = await databasePool.query(`
        select * 
        from (
            select a.establishment_id, a.location, a.timestamp, a.metadata 
            from assets_logs a
            where a.asset_id = $1
            union all
            select b.establishment_id, b.last_location as location, b.last_update as timestamp, b.metadata
            from assets b
            where b.id = $1
        ) as aux
        where timestamp is not null
        order by timestamp desc`, params);

        return response.rows;
    } catch (error) {
        console.error('POSTGRE:Asset-Find-Logs-Error');
        console.error(error);

        return [];
    }
};

module.exports = {
    create: create,
    delete: exclude,
    associate: associate,
    findAll: findAll,
    findById: findById,
    findByEstablishmentId: findByEstablishmentId,
    findBySerialNumber: findBySerialNumber,
    location: {
        update: updateLocation,
        history: findLogsById
    }
};