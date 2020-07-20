import { Forbidden, NotFound } from 'lin-mizar'
import Sequelize from 'sequelize'
import { getRandomCode } from '../lib/util'
import { Category } from '../model/category'
import { Task } from '../model/task'

class TaskDao {
  async getTask(id) {
    const task = await Task.findOne({
      where: {
        id,
      },
    })
    return task
  }

  async getTaskByKeyword(q) {
    const task = await Task.findAndCountAll({
      where: {
        name: {
          [Sequelize.Op.like]: `%${q}%`,
        },
      },
    })
    return task
  }

  async getTasks() {
    const tasks = await Task.findAll({
      paranoid: true,
    })
    return tasks
  }

  async createTask(v, username) {
    let task = await Task.findOne({
      where: {
        name: v.get('body.name'),
      },
    })
    if (task) {
      throw new Forbidden({
        msg: '任务已存在',
      })
    }
    await this._getCategory(v.get('body.category_id'))
    const t = new Task()
    t.name = v.get('body.name')
    t.summary = v.get('body.summary')
    t.size = v.get('body.size')
    t.category_id = v.get('body.category_id')
    t.creator = username
    t.code = getRandomCode()
    await t.save()
    task = await Task.findOne({
      where: {
        name: v.get('body.name'),
      },
    })
    return task.dataValues
  }

  async restoreTask(id) {
    await Task.restore({
      where: {
        id,
      },
    })
  }

  async updateTask(v, id) {
    const task = await Task.findByPk(id)
    if (!task) {
      throw new NotFound({
        msg: '没有找到相关任务',
      })
    }
    await this._getCategory(v.get('body.category_id'))
    task.name = v.get('body.name')
    task.summary = v.get('body.summary')
    task.size = v.get('body.size')
    task.category_id = v.get('body.category_id')
    task.save()
  }

  async deleteTask(id) {
    const task = await Task.findOne({
      where: {
        id,
      },
    })
    if (!task) {
      throw new NotFound({
        msg: '没有找到相关任务',
      })
    }
    task.destroy()
  }

  async _getCategory(id) {
    const category = await Category.findOne({
      where: {
        id,
      },
    })
    if (!category) {
      throw new Forbidden({
        msg: '分类不存在',
      })
    }
  }
}

export { TaskDao }
