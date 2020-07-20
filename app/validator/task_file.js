import { LinValidator, Rule } from 'lin-mizar'

class TaskFileUploadValidator extends LinValidator {
  constructor() {
    super()
    this.task_id = new Rule('isNotEmpty', '必须输入任务编号')
    this.code = new Rule('isNotEmpty', '必须输入上传码')
    this.filename = new Rule('isNotEmpty', '必须输入文件名')
  }
}

class TaskFileGetValidator extends LinValidator {
  constructor() {
    super()
    this.task_id = new Rule('isNotEmpty', '必须输入任务编号')
  }
}

class UpdateFileInfoValidator extends LinValidator {
  constructor() {
    super()
    this.file_id = new Rule('isNotEmpty', '必须输入文件编号')
    this.file_name = new Rule('isNotEmpty', '必须输入文件名')
  }
}

export { TaskFileUploadValidator, TaskFileGetValidator, UpdateFileInfoValidator }
