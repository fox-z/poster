# poster


核心puppeteer中文地址：https://www.mofazhuan.com/puppeteer-doc-zh#puppeteerlaunchoptions
github: https://github.com/puppeteer/puppeteer

海报服务

**本服务开启4线程（服务器为2核），每一个线程上跑1个浏览器实例，若并发高，可加到每个线程2个浏览器实例**

**项目依赖的版本请保持^，例如："egg": "^2.15.1"，不带^项目会报错，无法访问**

> 官方回复：Egg 的依赖，请坚持用 ^，我们保证会严格遵循 Semver 规则。

**页面路由和海报路由名应指定为相同名字，方便找到对应的文件**


部署注意事项：

+ 服务器上缺少chrome相关依赖，需要手动安装

操作系统：
centos:

#依赖库
yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y
 
#字体
yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y


ubuntu:

yum install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils -y


安装完成后：
After installing dependencies you need to update nss library using this command。
yum update nss -y

+ 服务器缺少中日韩字体需手动下载，否则chrome浏览器将不能解析日韩文


参考链接：
> https://www.jianshu.com/p/f2ba4f5b8f36


+ 服务器缺少pdftk应用(主要用于合并pdf)，需要下载安装

- yum install gcc gcc-c++ libXrandr gtk2 libXtst libart_lgpl
- wget  http://mirror.centos.org/centos/6/os/x86_64/Packages/libgcj-4.4.7-23.el6.x86_64.rpm
  完成后执行：rpm -ivh --nodeps libgcj-4.4.7-23.el6.x86_64.rpm
- wget https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk-2.02-1.el6.x86_64.rpm
  完成后执行：yum install pdftk-2.02-1.el6.x86_64.rpm
- 测试是否安装成功,能正常打印路径即可
  which pdftk


## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i --no-package-lock
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm i --no-package-lock --production
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org



## 本地开发注意事项

+ 如果需要使用本服务，需要本地安装 chrome
下载地址：https://npm.taobao.org/mirrors/chromium-browser-snapshots/
不同的系统安装不同的chrome，放在**项目根目录**下，并且**修改config/config.local.js 的 chromePath 的指向路径**，
==路径必须为可执行的应用==
推荐安装版本：782078

+ 如果需要使用pdf服务 需要安装 pdftk(用于合并pdf文件)

macos下载链接: https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-mac_osx-10.11-setup.pkg
windows下载链接：https://www.pdflabs.com/tools/pdftk-server/

## 目录说明

apiCtr: 只针对接口提供

viewCtr: 只针对页面提供