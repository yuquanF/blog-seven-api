import { Forbidden, NotFound } from 'lin-mizar'
import { Category } from '../model/category'

class CategoryDao {
  async getCategorys() {
    const categorys = await Category.findAll()
    return categorys
  }

  async createCategory(v) {
    const category = await Category.findOne({
      where: {
        name: v.get('body.name'),
      },
    })
    if (category) {
      throw new Forbidden({
        msg: '分类已存在',
      })
    }
    const ca = new Category()
    ca.name = v.get('body.name')
    ca.summary = v.get('body.summary')
    ca.save()
  }

  async updateCategory(v, id) {
    const category = await Category.findByPk(id)
    if (!category) {
      throw new NotFound({
        msg: '没有找到相关分类',
      })
    }
    category.name = v.get('body.name')
    category.summary = v.get('body.summary')
    category.save()
  }

  async deleteCategory(id) {
    const category = await Category.findOne({
      where: {
        id,
      },
    })
    if (!category) {
      throw new NotFound({
        msg: '没有找到相关分类',
      })
    }
    category.destroy()
  }
}

export { CategoryDao }
