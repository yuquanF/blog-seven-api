'use strict'
const fs = require('fs')
const path = require('path')
const { config } = require('lin-mizar/lin/config')

/**
 * 获取配置
 */
function applyConfig() {
  const cwd = process.cwd()
  const files = fs.readdirSync(path.resolve(`${cwd}/app/config`))
  for (const file of files) {
    config.getConfigFromFile(`app/config/${file}`)
  }
  // 加载其它配置文件
  config.getConfigFromFile('app/extension/file/config.js')
}

const run = async () => {
  applyConfig()
  const { createApp } = require('./app')
  const app = await createApp()
  const port = config.getItem('port')
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })
}

// 启动应用
run()
