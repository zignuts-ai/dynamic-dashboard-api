const { sequelize } = require('../../config/sequelize');

const User = require('./User');
const Admin = require('./Admin');
const Dashboard = require('./Dashboard');
const DataStore = require('./DataStore');
const Organisation = require('./Organisation');
const UserDataStoreOrganisationMap = require('./UserDataStoreOrganisationMap');
const UserOragnisationMap = require('./UserOragnisationMap');
const Wiedge = require('./Wiedge');

module.exports = {
  User,
  Admin,
  Dashboard,
  DataStore,
  Organisation,
  UserDataStoreOrganisationMap,
  UserOragnisationMap,
  Wiedge,
  sequelize,
};
