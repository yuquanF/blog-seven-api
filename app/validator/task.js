import { LinValidator, Rule } from 'lin-mizar'

class CreateOrUpdateTaskValidator extends LinValidator {
  constructor() {
    super()
    this.name = new Rule('isNotEmpty', '必须输入任务名')
    this.category_id = new Rule('isNotEmpty', '必须输入任务分类')
    this.size = new Rule('isNotEmpty', '必须输入任务单个文件上传大小限制')
  }
}

export { CreateOrUpdateTaskValidator }
