import { LinValidator, Rule } from 'lin-mizar'

class CreateOrUpdateCategoryValidator extends LinValidator {
  constructor() {
    super()
    this.name = new Rule('isNotEmpty', '必须传入分类名')
  }
}

export { CreateOrUpdateCategoryValidator }
