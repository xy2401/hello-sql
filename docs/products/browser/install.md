# Browser Database 安装与切换

Browser Database 指 IndexedDB、OPFS、Cache Storage 等浏览器能力，不是一个可下载的数据库服务。安装对象是浏览器；存储实现与配额跟随浏览器版本和用户配置。

- [IndexedDB 标准](https://w3c.github.io/IndexedDB/)
- [File System 标准（OPFS）](https://fs.spec.whatwg.org/)
- [MDN 存储配额](https://developer.mozilla.org/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

## 推荐方式

至少准备 Chromium 与 Firefox 稳定版；涉及 Safari 用户时在 macOS/iOS 对应版本验证。开发页面必须通过 HTTPS 或 localhost 进入安全上下文。

## 浏览器准备

~~~powershell
winget install Google.Chrome
winget install Mozilla.Firefox
# macOS（Homebrew 社区 cask）
brew install --cask google-chrome firefox
~~~

## 能力检查

~~~javascript
console.log({
  indexedDB: "indexedDB" in globalThis,
  opfs: Boolean(navigator.storage?.getDirectory),
  persisted: await navigator.storage?.persisted?.()
})
~~~

## 版本切换

无需、也无法单独切换 Browser Database 版本。通过浏览器稳定版/Beta/ESR 通道和自动化测试矩阵切换实现；用户数据目录要隔离，避免测试版直接复用生产 profile。

## Docker

Docker 不适用：这些 API 属于浏览器进程和站点安全上下文，数据库状态还受 origin、profile 与配额策略影响。无头浏览器容器可用于测试，但不是独立数据库镜像。

## 安装验证

~~~javascript
const estimate = await navigator.storage.estimate()
console.log(estimate)
console.log(await indexedDB.databases?.())
~~~

## 升级、卸载与冲突

由浏览器厂商更新和卸载。清除站点数据会删除数据库；升级前为关键数据设计导出/同步策略。测试时记录浏览器完整版本、origin、持久化授权和无痕模式。

## 官方资料

- [IndexedDB 标准](https://w3c.github.io/IndexedDB/)
- [File System 标准（OPFS）](https://fs.spec.whatwg.org/)
- [MDN 存储配额](https://developer.mozilla.org/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

资料核对日期：2026-08-27。
