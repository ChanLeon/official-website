fis.set('project.fileType.text', 'ejs');

// page下直接生成
fis.match('/page/(**.ejs)', {
  isHtmlLike: true,
  release: '/view/$1'
});

// common下不生成
fis.match('/common/**.ejs', {
  isHtmlLike: true,
  release: false
});

fis.match('/asset/(**.{js,css,png,jpg})', {
  useHash: true,
  release: '/public/$1',
  url: '/$1'
});

fis.match('/asset/(**.{txt,ico})', {
  useHash: false,
  release: '/public/$1',
  url: '/$1'
});

// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});

// 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});
