import { disableLoading, LinRouter } from 'lin-mizar'
import { CategoryDao } from '../../dao/category'
import { getSafeParamId } from '../../lib/util'
import { groupRequired, loginRequired } from '../../middleware/jwt'
import { CreateOrUpdateCategoryValidator } from '../../validator/category'
import { PositiveIdValidator } from '../../validator/common'

const categoryApi = new LinRouter({
  prefix: '/api/v1/category',
})

// category 的dao 数据库访问层实例
const categoryDto = new CategoryDao()

categoryApi.get('/', loginRequired, async (ctx) => {
  const categorys = await categoryDto.getCategorys()
  ctx.json(categorys)
})

categoryApi.linPost(
  'createCategory',
  '/',
  {
    permission: '新建分类',
    module: '分类',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    const v = await new CreateOrUpdateCategoryValidator().validate(ctx)
    await categoryDto.createCategory(v)
    ctx.success({
      msg: '新建分类成功',
    })
  }
)

categoryApi.linPut(
  'updateCategory',
  '/:id',
  {
    permission: '更新分类',
    module: '分类',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    const v = await new CreateOrUpdateCategoryValidator().validate(ctx)
    await categoryDto.updateCategory(v, getSafeParamId(ctx))
    ctx.success({
      msg: '更新分类成功',
    })
  }
)

categoryApi.linDelete(
  'deleteCategory',
  '/:id',
  {
    permission: '删除分类',
    module: '分类',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    const v = await new PositiveIdValidator().validate(ctx)
    await categoryDto.deleteCategory(getSafeParamId(ctx))
    ctx.success({
      msg: '删除分类成功',
    })
  }
)

module.exports = { categoryApi, [disableLoading]: false }
