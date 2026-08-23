# Redis 核心知识

## 核心技术点

### 1. 内存淘汰机制与过期策略

- **过期删除**：采用**惰性删除（访问时检查）** + **定期随机采样删除**。
- **内存达到 maxmemory 时的淘汰策略**：
  - `volatile-lru` / `allkeys-lru`：近似 LRU 淘汰。
  - `volatile-lfu` / `allkeys-lfu`：基于访问频率的 LFU 淘汰。
  - `noeviction`：内存满时直接对写命令报错。

### 2. 大 Key 与阻塞排查

- Redis 单线程执行命令时，对包含数十万元素的集合执行 `HGETALL`、`SMEMBERS` 或 `KEYS *` 会造成主线程严重卡顿。
- 应使用 `SCAN`、`HSCAN` 渐进式遍历，删除大 Key 优先使用 `UNLINK`（异步后台释放）。
