# Browser Database 调用与调试

Browser Database 没有独立服务端 CLI。实际入口是页面 JavaScript、浏览器 DevTools 和 Storage/Application 面板；命令必须在目标页面的同一 origin 下执行，因为 IndexedDB 与 OPFS 都按 origin 隔离。

- [IndexedDB API](https://developer.mozilla.org/docs/Web/API/IndexedDB_API)
- [StorageManager.getDirectory](https://developer.mozilla.org/docs/Web/API/StorageManager/getDirectory)
- [Storage API](https://developer.mozilla.org/docs/Web/API/Storage_API)

## 启动本地页面

不要直接依赖 `file://` 的存储行为。用本地 HTTP 服务打开测试目录：

```bash
python -m http.server 8000 --bind 127.0.0.1
```

随后访问 `http://127.0.0.1:8000/`，在该页面打开 DevTools Console。`localhost`/`127.0.0.1` 可作为本地开发安全上下文，部署环境仍应使用 HTTPS。

## 查看存储与配额

```javascript
await indexedDB.databases()

const estimate = await navigator.storage.estimate()
console.table({ usage: estimate.usage, quota: estimate.quota })

await navigator.storage.persisted()
```

Application/Storage 面板可以浏览 IndexedDB 数据库、object store、Cache Storage 和部分文件系统状态；它是调试工具，不是应用数据迁移接口。

## IndexedDB 最小操作

```javascript
const request = indexedDB.open('hello', 1)

request.onupgradeneeded = () => {
  const db = request.result
  if (!db.objectStoreNames.contains('items')) {
    db.createObjectStore('items', { keyPath: 'id' })
  }
}

const db = await new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

const tx = db.transaction('items', 'readwrite')
tx.objectStore('items').put({ id: 1, name: 'alpha' })
await new Promise((resolve, reject) => {
  tx.oncomplete = resolve
  tx.onerror = () => reject(tx.error)
})
```

事务只覆盖创建它时声明的 object store；异步控制流离开活动区间后可能出现 `TransactionInactiveError`。

## OPFS 文件检查

```javascript
const root = await navigator.storage.getDirectory()
for await (const [name, handle] of root.entries()) {
  console.log(name, handle.kind)
}

const fileHandle = await root.getFileHandle('hello.txt', { create: true })
const writable = await fileHandle.createWritable()
await writable.write('hello')
await writable.close()
```

清除站点数据会删除这些内容。调试“数据消失”时先核对协议、主机、端口和隐私模式是否改变了 origin，再检查配额与持久化授权。

资料核对日期：2026-08-28。
