// Database url for local tests
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgres://taussjwjzozqga:764f36b6b3a9f0dd85ca7e2143ef24302bb0f283096e4ac2cd0c2bc80120296e@ec2-52-207-93-32.compute-1.amazonaws.com:5432/d9p6h72vsmi2k6';
}

const userRepository = require('./user');
const assetRepository = require('./asset');
const establishmentRepository = require('./establishment');

module.exports = {
    user: userRepository,
    asset: assetRepository,
    establishment: establishmentRepository
};