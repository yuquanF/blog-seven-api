import { InfoCrudMixin } from 'lin-mizar'
import { merge } from 'lodash'
import { Model, Sequelize } from 'sequelize'
import sequelize from '../lib/db'

class Category extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      name: this.name,
      summary: this.summary,
    }
    return origin
  }
}

Category.init(
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
  },
  merge(
    {
      tableName: 'category',
      modelName: 'category',
      sequelize,
    },
    InfoCrudMixin.options
  )
)

export { Category }
