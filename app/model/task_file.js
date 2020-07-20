import { InfoCrudMixin } from 'lin-mizar'
import { merge } from 'lodash'
import { Model, Sequelize } from 'sequelize'
import sequelize from '../lib/db'

class TaskFile extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      task_id: this.task_id,
      file_id: this.file_id,
      file_name: this.file_name,
      file_url: this.file_url,
    }
    return origin
  }
}

TaskFile.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    task_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    file_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    file_name: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    file_url: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
  },
  merge(
    {
      tableName: 'task_file',
      modelName: 'task_file',
      sequelize,
    },
    InfoCrudMixin.options
  )
)

export { TaskFile }
