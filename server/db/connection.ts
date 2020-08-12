import monk from 'monk';

const db = monk('localhost/auth');
export default db;
