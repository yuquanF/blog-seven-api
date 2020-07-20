import { ParametersException } from 'lin-mizar'
import { get, isInteger, toSafeInteger } from 'lodash'

function getSafeParamId(ctx) {
  const id = toSafeInteger(get(ctx.params, 'id'))
  if (!isInteger(id)) {
    throw new ParametersException({
      msg: '路由参数错误',
    })
  }
  return id
}

function isOptional(val) {
  // undefined , null , ""  , "    ", 皆通过
  if (val === undefined) {
    return true
  }
  if (val === null) {
    return true
  }
  if (typeof val === 'string') {
    return val === '' || val.trim() === ''
  }
  return false
}

function getRandomCode(size = 4) {
  let len = parseInt(size)
  if (!len) {
    len = 4
  }
  let str = ''
  for (let i = 0; i < len; i++) {
    str += Math.floor(Math.random() * 10)
  }
  return str
}
export { getSafeParamId, isOptional, getRandomCode }
