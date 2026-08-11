# 数据库横向对比矩阵

矩阵不是排行榜。它把产品的模型、事务、索引、扩展和运行边界放到同一组问题下，帮助缩小概念验证范围。

<div class="path-grid">
  <article class="path-card"><a href="./connection-strings"><h3>连接串与驱动</h3><p>URI、JDBC、端口、TLS、命名空间与云端身份认证。</p></a></article>
  <article class="path-card"><a href="./sql-dialects"><h3>SQL 方言与查询能力</h3><p>JOIN、窗口函数、CTE、UPSERT、JSON 和过程语言。</p></a></article>
  <article class="path-card"><a href="./transactions"><h3>事务与一致性</h3><p>MVCC、隔离级别、分布式事务和失败语义。</p></a></article>
  <article class="path-card"><a href="./indexes-json"><h3>索引、搜索与 JSON</h3><p>B-tree、倒排、列存、向量与半结构化数据。</p></a></article>
  <article class="path-card"><a href="./scaling"><h3>扩展、复制与分片</h3><p>单机、读副本、Raft、分区键和云弹性。</p></a></article>
  <article class="path-card"><a href="./browser-wasm"><h3>浏览器与 WASM</h3><p>Worker、OPFS、IndexedDB、导入格式和限制。</p></a></article>
</div>

## 第一轮选型问题

1. 系统事实源还是派生索引？
2. 事务边界是单记录、单分区还是跨实体？
3. 主要访问模式是点查、关系组合、搜索、图遍历还是大扫描？
4. 是否需要多区域写入？可以接受什么一致性和延迟？
5. 团队能否承担目标产品的部署与故障恢复？
