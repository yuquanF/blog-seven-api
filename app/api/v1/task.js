import { disableLoading, LinRouter, NotFound } from 'lin-mizar'
import { TaskDao } from '../../dao/task'
import { getSafeParamId } from '../../lib/util'
import { groupRequired, loginRequired } from '../../middleware/jwt'
import { PositiveIdValidator, SearchValidator } from '../../validator/common'
import { CreateOrUpdateTaskValidator } from '../../validator/task'

const taskApi = new LinRouter({
  prefix: '/v1/task',
})

const taskDto = new TaskDao()

taskApi.get('/:id', loginRequired, async (ctx) => {
  await new PositiveIdValidator().validate(ctx)
  const task = await taskDto.getTask(getSafeParamId(ctx))
  if (!task) {
    throw new NotFound({
      msg: '没有找到相关任务',
    })
  }
  ctx.json(task)
})

taskApi.get('/', loginRequired, async (ctx) => {
  const tasks = await taskDto.getTasks()
  ctx.json(tasks)
})

taskApi.get('/search/one', loginRequired, async (ctx) => {
  const v = await new SearchValidator().validate(ctx)
  const task = await taskDto.getTaskByKeyword(v.get('query.q'))
  if (!task) {
    throw new NotFound({
      msg: '没有找到相关任务',
    })
  }
  ctx.json(task)
})

taskApi.linPost(
  'createTask',
  '/',
  {
    permission: '新建任务',
    module: '任务',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    const v = await new CreateOrUpdateTaskValidator().validate(ctx)
    const username = ctx.currentUser.dataValues.username
    const task = await taskDto.createTask(v, username)
    ctx.success({
      msg: {
        code: task.code,
        task_id: task.id,
      },
    })
  }
)

taskApi.linPost(
  'restoreTask',
  '/restore/:id',
  {
    permission: '恢复任务',
    module: '任务',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    await new PositiveIdValidator().validate(ctx)
    await taskDto.restoreTask(getSafeParamId(ctx))
    ctx.success({
      msg: '恢复成功',
    })
  }
)

taskApi.linPut(
  'updateTask',
  '/:id',
  {
    permission: '更新任务',
    module: '任务',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    let v = await new PositiveIdValidator().validate(ctx)
    v = await new CreateOrUpdateTaskValidator().validate(ctx)
    await taskDto.updateTask(v, getSafeParamId(ctx))
    ctx.success({
      msg: '更新任务成功',
    })
  }
)

taskApi.linDelete(
  'deleteTask',
  '/:id',
  {
    permission: '删除任务',
    module: '任务',
    mount: true,
  },
  groupRequired,
  async (ctx) => {
    await new PositiveIdValidator().validate(ctx)
    await taskDto.deleteTask(getSafeParamId(ctx))
    ctx.success({
      msg: '删除任务成功',
    })
  }
)

module.exports = { taskApi, [disableLoading]: false }
