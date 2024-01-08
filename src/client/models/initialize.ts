import { Sequelize } from 'sequelize';

let sequelizeSingleton: Sequelize | undefined = undefined;

export function initModels() {
  if (sequelizeSingleton) {
    console.log('Already initialized.');
    return;
  }

  sequelizeSingleton = new Sequelize('postgres://user:password@localhost:5432/dev');
}

export function getSequelizeSingleton() {
  if (!sequelizeSingleton) {
    throw new Error('Sequelize singleton is not initialized, use initModels() first.');
  }

  return sequelizeSingleton;
}
