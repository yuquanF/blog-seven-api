'use strict'

export const db = {
  database:
    process.env.NODE_ENV !== 'production'
      ? 'fyq-blog-admin'
      : process.env.database,
  host: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.host,
  dialect:
    process.env.NODE_ENV !== 'production' ? 'mysql' : process.env.dialect,
  port: process.env.NODE_ENV !== 'production' ? 3306 : process.env.port,
  username:
    process.env.NODE_ENV !== 'production' ? 'root' : process.env.username,
  password: process.env.NODE_ENV !== 'production' ? '' : process.env.password,
  logging: false,
  timezone: '+08:00',
}
export const secret = process.env.NODE_ENV !== 'production' ?
  '\x77W\xf09\x91\x07\x97\x79\x77\x96\xa0A\xc67\xf9\xecJJU\x17\xc5V\xbe\x7b\xef\xd7\xd7\xd3\xe6\x95*4': process.env.secret
