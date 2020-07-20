import { Forbidden, LinRouter, NotFound, ParametersException } from 'lin-mizar'
import { TaskDao } from '../../dao/task'
import { TaskFileDao } from '../../dao/task_file'
import { CosUploader } from '../../extension/file/cos-uploader'
import { loginRequired } from '../../middleware/jwt'
import { PositiveIdValidator } from '../../validator/common'
import {
  TaskFileGetValidator,
  TaskFileUploadValidator,
  UpdateFileInfoValidator,
} from '../../validator/task_file'

const taskDto = new TaskDao()
const taskFileDto = new TaskFileDao()

const fileApi = new LinRouter({
  prefix: '/v1/file',
})

/**
 * get taskFiles by task_id，根据task_id获取该task下的所有file
 */
fileApi.get('/', loginRequired, async (ctx) => {
  const v = await new TaskFileGetValidator().validate(ctx)
  const taskFiles = await taskFileDto.getTaskFiles(v.get('query.task_id'))
  ctx.json(taskFiles)
})

/**
 * update file info by file_id
 */
fileApi.put('updateFileInfo', '/:file_id', loginRequired, async (ctx) => {
  const v = await new UpdateFileInfoValidator().validate(ctx)
  await taskFileDto.updateFileInfo(v)
  ctx.success({ msg: '更新成功！' })
})

/**
 * delete file by file_id
 */
fileApi.delete('deleteFile', '/:id', loginRequired, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)
  await taskFileDto.deleteFile(v)
  ctx.success({ msg: '删除成功！' })
})

fileApi.linPost('uploadCos', '/cos', {}, async (ctx) => {
  const v = await new TaskFileUploadValidator().validate(ctx)
  // 检查id是否正确
  const task = await taskDto.getTask(v.get('query.task_id'))
  if (!task) {
    throw new NotFound({
      msg: '请检查你的任务编号是否错误',
    })
  }
  // 检查code是否正确
  if (task.code !== v.get('query.code')) {
    throw new Forbidden({
      msg: '当前上传码错误',
    })
  }
  const files = await ctx.multipart({
    singleLimit: 1024 * 1024 * parseInt(task.dataValues.size),
    totalLimit: 1024 * 1024 * parseInt(task.dataValues.size) * 10,
  })
  if (files.length < 1) {
    throw new ParametersException({ msg: '未找到符合条件的文件资源' })
  }
  const uploader = new CosUploader()
  const uploadFiles = await uploader.upload(files)
  await taskFileDto.createTaskFile(v, uploadFiles[0])
  ctx.success({
    msg: '上传文件成功',
  })
})

export { fileApi }
