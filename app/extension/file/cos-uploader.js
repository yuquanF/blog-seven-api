import COS from 'cos-nodejs-sdk-v5'
import { Failed, Uploader } from 'lin-mizar'
import path from 'path'
import { FileModel } from '../../model/file'

class CosUploader extends Uploader {
  async upload(files) {
    const arr = []
    for (const file of files) {
      const md5 = this.generateMd5(file)
      // 检查md5存在
      const exist = await FileModel.findOne({
        where: {
          md5: md5,
        },
      })
      if (exist) {
        arr.push({
          id: exist.id,
          key: file.fieldname,
          path: `https://${exist.path}`,
          url: `https://${exist.path}`,
          type: exist.type,
          name: exist.name,
          extension: exist.extension,
          size: exist.size,
        })
      } else {
        try {
          const { realName } = this.getStorePath(file.filename)
          const ext = path.extname(realName)
          const data = await CosPutObj(realName, file)
          const saved = await FileModel.createRecord(
            {
              path: data.Location,
              type: 'REMOTE',
              name: realName,
              extension: ext,
              size: file.size,
              md5: md5,
            },
            true
          )

          arr.push({
            id: saved.id,
            key: file.fieldname,
            path: `https://${saved.path}`,
            url: `https://${saved.path}`,
            type: saved.type,
            name: file.name,
            extension: saved.extension,
            size: saved.size,
          })
        } catch (error) {
          throw new Failed({
            msg: '文件上传错误',
          })
        }
      }
    }
    return arr
  }
}

function CosPutObj(realName, file) {
  return new Promise((resolve, reject) => {
    const cos = new COS({
      SecretId: 'AKIDz671lKDtthJjx3RI9pNly0uneKtIpYP4',
      SecretKey: 'b2pX45353tgIj7MSMfwY6ScaO0QgopjX',
    })
    cos.putObject(
      {
        Bucket: 'blog-1256893237' /* 必须 */,
        Region: 'ap-beijing' /* 必须 */,
        Key: realName /* 必须 */,
        StorageClass: 'STANDARD',
        Body: file.data, // 上传文件对象
      },
      function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  })
}

module.exports = { CosUploader }
