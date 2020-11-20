const userRepository = require('./user');
const assetRepository = require('./asset');
const establishmentRepository = require('./establishment');

module.exports = {
    user: userRepository,
    asset: assetRepository,
    establishment: establishmentRepository
};
