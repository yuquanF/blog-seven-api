import { InfoCrudMixin } from 'lin-mizar'
import { merge } from 'lodash'
import { Model, Sequelize } from 'sequelize'
import sequelize from '../lib/db'

class Task extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      name: this.name,
      summary: this.summary,
      size: this.size,
      code: this.code,
      creator: this.creator,
      category_id: this.category_id,
      create_time: this.create_time,
      update_time: this.update_time,
      delete_time: this.delete_time,
    }
    return origin
  }
}

Task.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    summary: {
      type: Sequelize.STRING(1000),
      allowNull: true,
    },
    size: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    code: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    creator: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  merge(
    {
      tableName: 'task',
      modelName: 'task',
      sequelize,
    },
    InfoCrudMixin.options
  )
)

export { Task }
