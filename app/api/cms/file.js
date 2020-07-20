import { LinRouter, ParametersException } from 'lin-mizar';

import { loginRequired } from '../../middleware/jwt';
import { CosUploader } from '../../extension/file/cos-uploader'

const file = new LinRouter({
  prefix: '/cms/file'
});

file.linPost('upload', '/', {}, loginRequired, async ctx => {
  const files = await ctx.multipart();
  if (files.length < 1) {
    throw new ParametersException({ msg: '未找到符合条件的文件资源' });
  }
  const uploader = new CosUploader()
  const uploadFiles = await uploader.upload(files)
  ctx.json(uploadFiles);
});

export { file };
