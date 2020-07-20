import { NotFound } from 'lin-mizar'
import { TaskFile } from '../model/task_file'

class TaskFileDao {
  async getTaskFiles(task_id) {
    const taskFiles = await TaskFile.findAndCountAll({
      where: {
        task_id,
      },
    })
    return taskFiles
  }

  async updateFileInfo (v) {
    const file = await TaskFile.findOne({
      where: {
        file_id: v.get('path.file_id')
      }
    })
    if (!file) {
      throw new NotFound({
        msg: '文件不存在'
      })
    }
    file.file_name = v.get('body.file_name')
    await file.save()
  }

  async deleteFile (v) {
    const file = await TaskFile.findByPk(v.get('path.id'))
    if (!file) {
      throw new NotFound({
        msg: '文件不存在'
      })
    }
    await file.destroy()
  }
  
  async createTaskFile(v, file) {
    const taskFiles = await TaskFile.findAll({
      where: {
        file_id: file.id,
      },
    })
    let exist = false
    const task_id = parseInt(v.get('query.task_id'))
    const filename = v.get('query.filename') + file.extension

    if (taskFiles.length > 0) {
      taskFiles.forEach((item) => {
        // 当存在文件与相同任务关联时且文件名一致时，跳过。否则插入新的关联
        if (item.task_id === task_id && item.file_name === filename) {
          exist = true
        }
      })
    }

    if (exist) {
      return
    }

    const tf = new TaskFile()
    tf.task_id = task_id
    tf.file_id = file.id
    tf.file_name = filename
    tf.file_url = file.url
    tf.save()
  }
}

export { TaskFileDao }
