# SQL 学习路线

SQL 的难点不是记住关键字，而是把业务问题转换为关系运算，并理解数据库如何在事务和索引约束下执行这些运算。

<div class="path-grid">
  <article class="path-card"><a href="./query"><h3>1. 查询与过滤</h3><p>SELECT、WHERE、ORDER BY、LIMIT 和 NULL。</p></a></article>
  <article class="path-card"><a href="./joins"><h3>2. 聚合、JOIN 与子查询</h3><p>关系组合、分组粒度和集合语义。</p></a></article>
  <article class="path-card"><a href="./advanced-query"><h3>3. CTE 与窗口函数</h3><p>拆解复杂查询，在不折叠行的情况下计算。</p></a></article>
  <article class="path-card"><a href="./schema"><h3>4. Schema 与约束</h3><p>让数据库替应用守住数据不变量。</p></a></article>
  <article class="path-card"><a href="./transactions"><h3>5. 事务与并发</h3><p>原子性、隔离级别、锁和失败恢复。</p></a></article>
  <article class="path-card"><a href="./indexes-explain"><h3>6. 索引与执行计划</h3><p>从访问路径理解性能，而不是猜优化。</p></a></article>
</div>

## 推荐顺序

先用 SQLite Live 完成查询与建模，再用 PGlite 比较 PostgreSQL 方言，最后用 DuckDB 理解分析型执行路径。每个实验默认加载相同的 `lessons` 数据集，便于横向比较。
