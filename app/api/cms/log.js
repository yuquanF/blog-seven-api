import { LinRouter } from 'lin-mizar'
import { LogDao } from '../../dao/log'
import { groupRequired } from '../../middleware/jwt'
import { PaginateValidator } from '../../validator/common'
import { LogFindValidator } from '../../validator/log'

const log = new LinRouter({
  prefix: '/api/cms/log',
})

const logDao = new LogDao()

log.linGet(
  'getLogs',
  '/',
  {
    permission: '查询所有日志',
    module: '日志',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    const v = await new LogFindValidator().validate(ctx)
    const { rows, total } = await logDao.getLogs(v)
    if (!rows || rows.length < 1) {
      ctx.json({
        total: 0,
        items: [],
        page: v.get('query.page'),
        count: v.get('query.count'),
      })
    }
    ctx.json({
      total: total,
      items: rows,
      page: v.get('query.page'),
      count: v.get('query.count'),
    })
  }
)

log.linGet(
  'getUserLogs',
  '/search',
  {
    permission: '搜索日志',
    module: '日志',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    const v = await new LogFindValidator().validate(ctx)
    const keyword = v.get('query.keyword', false, '')
    const { rows, total } = await logDao.searchLogs(v, keyword)
    ctx.json({
      total: total,
      items: rows,
      page: v.get('query.page'),
      count: v.get('query.count'),
    })
  }
)

log.linGet(
  'getUsers',
  '/users',
  {
    permission: '查询日志记录的用户',
    module: '日志',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    const v = await new PaginateValidator().validate(ctx)
    const arr = await logDao.getUserNames(
      v.get('query.page'),
      v.get('query.count')
    )
    ctx.json({
      total: arr.length,
      items: arr,
      page: v.get('query.page'),
      count: v.get('query.count'),
    })
  }
)

export { log }
