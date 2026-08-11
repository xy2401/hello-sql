export interface GuideConcept {
  title: string;
  summary: string;
  points: string[];
}

export interface GuideVersion {
  line: string;
  changes: string[];
  impact: string;
}

export interface DatabaseGuideData {
  intro: string;
  goals: string[];
  concepts: GuideConcept[];
  versionModel: string;
  versions: GuideVersion[];
  officialReleaseNotes: string;
  upgradeFocus: string[];
}

const concept = (title: string, summary: string, points: string[]): GuideConcept => ({ title, summary, points });
const version = (line: string, changes: string[], impact: string): GuideVersion => ({ line, changes, impact });
const guide = (
  intro: string,
  goals: string[],
  concepts: GuideConcept[],
  versionModel: string,
  versions: GuideVersion[],
  officialReleaseNotes: string,
  upgradeFocus: string[],
): DatabaseGuideData => ({ intro, goals, concepts, versionModel, versions, officialReleaseNotes, upgradeFocus });

export const databaseGuides = {
  postgresql: guide(
    '学习 PostgreSQL 的重点不只是 SQL 语法，而是理解 MVCC、WAL、统计信息和扩展机制如何共同决定正确性与性能。',
    ['能解释一条查询如何生成并执行计划', '能判断 vacuum、锁与长事务问题', '能设计可回滚的主版本升级'],
    [
      concept('MVCC 与 Vacuum', '更新会产生新的行版本，旧版本由 vacuum 回收；长事务会阻止垃圾回收并放大表膨胀。', ['关注 xmin 与事务年龄', '区分 autovacuum 不足和索引膨胀', '用锁等待图定位阻塞链']),
      concept('规划器与索引', '规划器基于统计信息估算行数，再在顺序扫描、索引扫描、连接算法和并行计划之间选择。', ['理解 B-tree、GIN、GiST、BRIN 的适用边界', '用 EXPLAIN (ANALYZE, BUFFERS) 验证估算', '优先修复数据分布和查询形状']),
      concept('WAL、复制与恢复', 'WAL 既服务崩溃恢复，也驱动物理流复制和逻辑解码。', ['明确 RPO/RTO 与同步级别', '定期演练 PITR', '复制槽必须监控积压']),
    ],
    '每年一个主版本；受支持主版本会并行发布修复版本。主版本升级需要 pg_upgrade、逻辑迁移或转储恢复。',
    [
      version('PostgreSQL 18', ['异步 I/O 与查询执行继续增强', '升级前检查扩展、参数与统计行为变化'], '适合新部署；从旧主版本迁移时必须在真实数据上验证计划回归。'),
      version('PostgreSQL 17', ['VACUUM、备份和逻辑复制能力增强', 'JSON 与 SQL 能力继续扩展'], '大量写入和逻辑复制场景值得重点评估。'),
      version('PostgreSQL 16 及更早受支持版本', ['并行查询、监控和复制能力逐代完善', '不同版本的扩展 ABI 与默认参数不同'], '不要跨主版本复制数据目录；先确认扩展支持矩阵。'),
    ],
    'https://www.postgresql.org/docs/release/',
    ['列出全部扩展及目标版本兼容性', '回放生产查询并对比执行计划', '验证备份恢复、复制槽和回滚窗口'],
  ),
  mysql: guide(
    'MySQL 的工程核心是 InnoDB：聚簇索引、二级索引回表、undo/redo、next-key lock 与复制拓扑决定大多数线上行为。',
    ['掌握 InnoDB 行与索引组织', '能定位锁等待和复制延迟', '区分 LTS 与 Innovation 版本线'],
    [
      concept('InnoDB 存储结构', '主键即聚簇索引，二级索引叶子保存主键；主键选择会直接影响所有索引大小。', ['优先短且稳定的主键', '理解覆盖索引与回表', '控制大字段和页分裂']),
      concept('隔离与锁', '默认 Repeatable Read 配合 next-key lock 防止幻读，但范围更新可能扩大锁范围。', ['用 performance_schema 查看等待', '避免无索引更新', '把死锁当作可重试的并发信号']),
      concept('复制与高可用', 'binlog、GTID、异步/半同步复制和 Group Replication 构成常见高可用基础。', ['监控 apply 延迟而非只看连接', '校验 failover 后数据一致性', '区分读扩展和写扩展']),
    ],
    'MySQL 同时提供长期支持（LTS）与快速创新版本；生产平台通常固定 LTS，功能验证环境跟踪 Innovation。',
    [
      version('MySQL 8.4 LTS', ['稳定功能集合与长期修复窗口', '从 8.0 升级涉及权限、参数和已移除能力'], '多数生产新部署的基准版本线。'),
      version('MySQL 9.x Innovation', ['更快交付新功能和移除项', '升级频率与兼容验证成本更高'], '适合提前验证未来 LTS，不宜无策略滚动到核心生产。'),
      version('MySQL 8.0', ['窗口函数、CTE、原子 DDL 与数据字典奠定现代基线', '生命周期与升级窗口必须纳入计划'], '迁往 8.4 前先升级到最新 8.0 修复版本并运行 upgrade checker。'),
    ],
    'https://dev.mysql.com/doc/relnotes/mysql/8.4/en/',
    ['运行 MySQL Shell Upgrade Checker', '检查 sql_mode、字符集与认证插件', '演练复制拓扑混合版本和回退'],
  ),
  mariadb: guide(
    'MariaDB 已不是 MySQL 的无差别替代品。学习重点是存储引擎、Galera、优化器行为，以及两条产品线持续扩大的兼容边界。',
    ['能选择合适存储引擎', '能解释 Galera 认证冲突', '能做真实 SQL 与驱动兼容评估'],
    [
      concept('多存储引擎', '事务、索引、锁和备份能力取决于具体引擎，InnoDB、Aria、ColumnStore 不能按同一规则运维。', ['建表时明确引擎', '备份工具必须覆盖目标引擎', '跨引擎事务边界需验证']),
      concept('Galera 集群', 'Galera 在提交时进行写集合认证，提供同步复制体验，但热点写入会增加冲突。', ['理解 wsrep 状态', '避免大事务', '演练节点重加入与 SST/IST']),
      concept('MySQL 兼容边界', '系统表、GTID、JSON、复制和 SQL 语法已经分化。', ['迁移必须回放真实查询', '核对连接器与 ORM 支持', '不要直接复用升级手册']),
    ],
    '社区版并行维护长期支持、滚动和开发版本线；生产应固定明确的长期支持系列。',
    [
      version('MariaDB 11.8 LTS', ['面向长期维护的稳定系列', '需核对从 10.x/11.4 的参数和插件差异'], '新生产部署优先从 LTS 系列评估。'),
      version('MariaDB 11.4 LTS', ['成熟的长期支持基线', '生态兼容通常比快速版本更充分'], '既有平台可按支持周期决定是否迁往 11.8。'),
      version('MariaDB 12.x 滚动/开发线', ['更快引入优化器和 SQL 能力', '兼容与回退成本更高'], '用于前瞻验证，不要把开发版本当作默认生产基线。'),
    ],
    'https://mariadb.com/docs/release-notes',
    ['执行 mariadb-upgrade 并核对系统表', '验证存储引擎、Galera 和备份插件', '对比 MySQL 客户端、SQL mode 与 GTID 行为'],
  ),
  sqlite: guide(
    'SQLite 是嵌入式库而非缩小版数据库服务器。正确使用它需要理解类型亲和性、事务锁、WAL 和宿主进程的文件语义。',
    ['能设计单写者并发模型', '能判断 WAL 与回滚日志差异', '能安全升级文件格式与宿主绑定'],
    [
      concept('类型亲和性与 STRICT', '普通表采用动态类型和列亲和性；STRICT 表可在需要时收紧写入检查。', ['不要把 VARCHAR 长度当约束', '显式处理日期与布尔值', '跨数据库迁移先做类型归一化']),
      concept('事务与 WAL', 'SQLite 支持 ACID，但同一数据库文件同一时刻只有一个写者。WAL 改善读写并发，不消除写竞争。', ['缩短写事务', '设置合理 busy_timeout', '关注 WAL checkpoint']),
      concept('嵌入式边界', '连接、权限、备份和同步由宿主应用负责。网络文件系统和多进程锁语义必须单独验证。', ['使用官方备份 API', '避免直接复制活跃文件', '移动端升级需包含迁移测试']),
    ],
    'SQLite 使用连续 3.x 版本线并保持极强文件格式兼容；每次发布仍可能新增 SQL、函数和安全修复。',
    [
      version('SQLite 3.50+', ['SQL 函数、查询规划和平台支持持续演进', '绑定库版本可能落后于系统 SQLite'], '先确认应用实际加载的库版本，而非只看系统命令。'),
      version('SQLite 3.45–3.49', ['JSON 与查询能力持续增强', '部分边界行为和优化会变化'], '对依赖 JSON、FTS 或特定计划的应用执行回归。'),
      version('SQLite 3.37+', ['STRICT 表提供可选严格类型', '文件格式仍保持兼容'], '可逐表引入严格模式，但要先清理历史脏数据。'),
    ],
    'https://sqlite.org/changes.html',
    ['记录宿主绑定实际版本和编译选项', '运行 PRAGMA integrity_check 与迁移回归', '验证 WAL、备份和异常退出恢复'],
  ),
  'sql-server': guide(
    'SQL Server 的学习主线是存储引擎、成本优化器、Query Store 与 Microsoft 高可用/云产品体系。',
    ['能判断聚集索引和堆表取舍', '能用 Query Store 处理计划回归', '能区分 SQL Server 与 Azure SQL 能力'],
    [
      concept('页、聚集索引与列存储', '行存表围绕 8KB 页组织；聚集键影响全部非聚集索引，列存储适合分析扫描。', ['控制聚集键宽度', '识别 key lookup', '按工作负载选择 rowstore/columnstore']),
      concept('优化器与 Query Store', '参数嗅探、统计信息和内存授予会影响计划；Query Store 保存计划与运行时历史。', ['先定位估算偏差', '谨慎强制计划', '监控 plan regression']),
      concept('事务与 Always On', '锁、行版本和恢复模型共同决定并发与恢复；Always On 提供可用性组。', ['理解 tempdb 影响', '演练日志链恢复', '明确同步副本提交延迟']),
    ],
    'SQL Server 以大版本加累计更新（CU）交付；生产通常固定大版本并持续应用经过验证的 CU。',
    [
      version('SQL Server 2025 (17.x)', ['引入向量数据与 AI/开发体验增强', '存在需要单独核对的 breaking changes 与预览功能'], '升级前区分 GA 与 PREVIEW_FEATURES。'),
      version('SQL Server 2022 (16.x)', ['Query Store、Azure 集成和分析能力增强', '兼容级别可用于分阶段启用优化器行为'], '升级二进制后不要立即提高数据库兼容级别。'),
      version('SQL Server 2019 (15.x)', ['智能查询处理和大数据能力构成重要基线', '旧驱动与 TLS 配置需检查'], '迁移时同步评估操作系统、驱动和许可。'),
    ],
    'https://learn.microsoft.com/en-us/sql/sql-server/sql-server-2025-release-notes',
    ['运行 Data Migration Assistant/升级检查', '备份并验证还原与 AG 切换', '分阶段提升 compatibility level 并观察 Query Store'],
  ),
  oracle: guide(
    'Oracle 的核心不只在 SQL/PLSQL，而在多租户、undo 一致性读、优化器、Data Guard/RAC 和严格的版本许可治理。',
    ['能解释 CDB/PDB 边界', '能判断执行计划与统计问题', '能制定 RU 和大版本升级策略'],
    [
      concept('多租户架构', 'CDB 承载公共基础设施，PDB 提供可插拔业务数据库；资源、备份和补丁都受容器边界影响。', ['理解 common/local user', '设计 PDB 服务名', '演练 clone/relocate']),
      concept('一致性读与 Undo', 'Oracle 通过 undo 提供读一致性；长查询、undo 保留和 ORA-01555 直接相关。', ['规划 undo retention', '控制长事务', '区分锁等待与一致性读']),
      concept('优化器与高可用', '统计、绑定变量、SQL Plan Management 与 Exadata/RAC 拓扑会共同影响性能。', ['保留 AWR/SQL Monitor 基线', '谨慎使用 hint', 'Data Guard 必须演练 switchover']),
    ],
    '长期支持版本配合季度 Release Update（RU）维护；版本标签与云服务命名可能不同。',
    [
      version('Oracle AI Database 26ai', ['AI Vector Search、JSON Relational Duality 和 SQL/PLSQL 能力增强', '部分功能受 COMPATIBLE、平台和许可约束'], '按实际部署形态核对功能，不要只依据产品名称。'),
      version('Oracle Database 23ai', ['面向开发者的数据类型、JSON 与向量能力形成新基线', '与 26ai 存在命名和 RU 映射关系'], '升级文档需同时核对版本号、RU 与云服务标签。'),
      version('Oracle Database 19c', ['长期存在的企业生产基线', '迁往新代际涉及多租户和已弃用能力'], '先清理 desupported/deprecated feature 再升级。'),
    ],
    'https://docs.oracle.com/en/database/oracle/oracle-database/26/nfcoa/all-nfg.html',
    ['运行 AutoUpgrade precheck', '核对 COMPATIBLE、字符集、时区文件和选件许可', '演练 RMAN、Data Guard 与应用回退'],
  ),
  duckdb: guide(
    'DuckDB 把列式向量化分析带进单个进程。学习重点是文件扫描、向量化执行、内存/溢写和扩展安全。',
    ['能直接查询 Parquet 并利用裁剪', '能控制内存与临时目录', '能理解嵌入式并发边界'],
    [
      concept('向量化执行', '算子按数据块处理列向量，减少函数调用和缓存浪费，适合聚合与扫描。', ['观察 EXPLAIN ANALYZE', '避免逐行 UDF', '利用并行扫描']),
      concept('文件即数据源', 'CSV、Parquet、JSON、Arrow 可直接参与 SQL；投影和谓词下推决定读取量。', ['优先 Parquet', '核对远程对象存储凭证', '避免自动类型推断误判']),
      concept('嵌入式运行', 'DuckDB 与应用共享进程资源，不提供独立多租户服务器语义。', ['限制 memory_limit', '设置 temp_directory', '连接级并发要符合宿主模型']),
    ],
    '遵循语义化版本；较大功能进入 minor，patch 主要修复。从 1.4 起交替提供 LTS 系列。',
    [
      version('DuckDB 1.5', ['继续扩展分析 SQL、文件与性能能力', '文件格式和扩展兼容需按发布说明核对'], '升级嵌入式绑定时同时更新扩展。'),
      version('DuckDB 1.4 LTS', ['首批明确 LTS 版本线', '适合需要较稳定维护窗口的嵌入式生产'], '生产基线优先评估 LTS，而不是无条件跟随最新 minor。'),
      version('DuckDB 1.0+', ['稳定存储格式和 API 进入成熟阶段', 'WASM 与本地客户端能力并非完全一致'], '浏览器端单独验证线程、内存和文件 API。'),
    ],
    'https://duckdb.org/release_calendar',
    ['备份数据库文件并测试向前/向后读取', '核对扩展仓库与客户端绑定版本', '回归浮点、排序和非确定性查询'],
  ),
  clickhouse: guide(
    'ClickHouse 的性能来自 MergeTree、稀疏主索引、后台合并和列式向量化；表结构与 ORDER BY 往往比增加节点更重要。',
    ['能设计分区键和排序键', '能解释 parts/merges', '能区分复制、分片和分布式表'],
    [
      concept('MergeTree 与排序键', '数据按 part 写入并按 ORDER BY 排序，稀疏索引通过 granule 跳过数据。', ['排序键服务主要过滤路径', '分区不要过细', '检查 primary key 命中率']),
      concept('合并与变更', '后台 merge 重写 parts；mutation、TTL 和去重都可能放大 I/O。', ['监控 part 数量', '避免高频小批写入', '理解 FINAL 的代价']),
      concept('集群拓扑', '副本解决可用性，分片解决容量，Distributed 表负责路由。', ['明确一致性预期', '设计 sharding key', 'Keeper 需要独立容量规划']),
    ],
    '采用日历式快速发布节奏；云服务和自托管版本交付节奏不同，升级应重点检查行为变化。',
    [
      version('ClickHouse 26.x', ['SQL、Lakehouse、向量与可观测能力持续演进', '按月版本可能包含默认行为调整'], '核心集群应固定经过压测的版本而非自动追新。'),
      version('ClickHouse 25.x', ['查询优化器与存储能力形成新基线', '旧设置和实验特性可能被替换'], '升级前导出 settings 与 system 表基线。'),
      version('ClickHouse 24.x 及更早', ['MergeTree 基础语义稳定', '跨大版本升级需要分段验证'], '重点检查数据格式、Keeper 和客户端兼容。'),
    ],
    'https://github.com/ClickHouse/ClickHouse/blob/master/CHANGELOG.md',
    ['在副本上先做滚动升级演练', '核对默认 settings、函数与数据格式变化', '对典型查询比较读取行数、内存和延迟'],
  ),
  tidb: guide(
    'TiDB 把 MySQL 协议、分布式事务和 HTAP 组合在一起；必须理解 TiDB、TiKV、PD、TiFlash 的职责边界。',
    ['能解释 Region 与 Raft', '能判断事务冲突和热点', '能选择 TiKV/TiFlash 执行路径'],
    [
      concept('计算与存储分离', 'TiDB 负责 SQL，TiKV 保存行数据，PD 管理时间戳与调度，TiFlash 提供列式副本。', ['监控每层瓶颈', '避免把扩 TiDB 当成扩存储', '理解 Region split/merge']),
      concept('分布式事务', 'TSO、两阶段提交与悲观/乐观事务共同提供一致性。', ['控制大事务', '识别 write conflict', '跨 Region 事务关注延迟']),
      concept('HTAP 执行', '优化器可把分析查询推到 TiFlash，但副本同步、统计和算子支持决定收益。', ['检查 EXPLAIN ANALYZE', '维护统计信息', '隔离 OLTP 与分析资源']),
    ],
    'TiDB 交替提供 LTS 与开发里程碑（DMR）；生产通常选择仍在支持期的 LTS。',
    [
      version('TiDB 8.5 LTS', ['8.x 能力沉淀为长期支持线', '组件必须遵守兼容矩阵'], '新生产集群的重点评估基线。'),
      version('TiDB 8.1 LTS', ['较早的 8.x 长期支持线', '迁往 8.5 需关注计划与系统变量'], '既有集群按支持周期和收益决定升级。'),
      version('TiDB 7.5 LTS', ['成熟 7.x 基线', '跨 8.x 可能出现优化器和行为变化'], '先在克隆流量上比较执行计划。'),
    ],
    'https://docs.pingcap.com/releases/tidb-self-managed/',
    ['使用 TiUP 检查组件和拓扑', '备份并演练 BR 恢复', '回放慢查询、DDL、大事务与 TiFlash 计划'],
  ),
  cockroachdb: guide(
    'CockroachDB 默认提供分布式 Serializable 事务。核心学习点是 Range/Raft、leaseholder、事务重试和多区域 locality。',
    ['能解释 Range 与副本', '能正确处理序列化重试', '能设计多区域表局部性'],
    [
      concept('Range 与 Raft', '键空间自动切为 Range，每个 Range 通过 Raft 复制；leaseholder 通常服务一致性读。', ['关注热点 Range', '理解 rebalancing', '容量按副本数计算']),
      concept('Serializable 与重试', '并发冲突可能返回可重试错误，应用和驱动需要正确的事务重试循环。', ['事务保持短小', '使用稳定幂等逻辑', '监控 contention events']),
      concept('多区域局部性', 'REGIONAL BY ROW/TABLE 与 GLOBAL 表在延迟、存活和一致性之间做不同取舍。', ['先定义 survival goal', '让数据靠近写入者', '量化跨区域提交延迟']),
    ],
    '按 vYY.R.PP 命名，季度发布主版本，并区分 Regular/LTS 与 Innovation 支持窗口。',
    [
      version('CockroachDB v26.2 Regular', ['较长稳定与支持窗口', '适合生产升级规划'], '生产优先评估 Regular/LTS 版本。'),
      version('CockroachDB v26.1 Innovation', ['更快获得新能力', '支持窗口更短'], '用于验证新功能，升级节奏要与支持策略匹配。'),
      version('CockroachDB v25.4 Regular', ['上一代稳定版本线', '跨代升级必须遵守相邻版本路径'], '不要跳过官方要求的中间版本。'),
    ],
    'https://www.cockroachlabs.com/docs/releases',
    ['检查 deprecation、cluster setting 与 license', '逐节点升级并观察 Range 可用性', '压测事务重试和跨区域延迟'],
  ),
  snowflake: guide(
    'Snowflake 是持续交付的云服务，学习重点不是服务器参数，而是微分区、虚拟仓库、缓存、数据共享和成本治理。',
    ['能利用分区裁剪', '能隔离计算并控制成本', '能管理行为变更 bundle'],
    [
      concept('微分区与裁剪', '数据自动组织为微分区，聚簇元数据用于跳过扫描；聚簇键只应服务高价值过滤路径。', ['查看 query profile', '避免无谓 recluster', '关注扫描字节而非只有行数']),
      concept('虚拟仓库', '计算与存储分离，仓库尺寸、自动暂停和多集群策略影响延迟与费用。', ['按工作负载隔离仓库', '设置 resource monitor', '评估 queue 与 spill']),
      concept('持续交付治理', '服务端每周更新，行为变化通过 bundle 和公告管理；客户端有独立版本。', ['订阅 behavior change', '在测试账户预演', '维护驱动最低支持版本']),
    ],
    '服务端按周持续发布，不采用传统自托管主版本升级；行为变更、客户端和连接器分别维护。',
    [
      version('每周 Server Release', ['功能、SQL 与性能持续上线', '账户所在区域可能分阶段获得更新'], '监控发布说明与关键查询基线。'),
      version('Behavior Change Bundle', ['潜在行为变化可按 bundle 预启用/延后', '最终会默认启用'], '在强制日期前完成回归和代码修正。'),
      version('驱动与 Snowpark 版本', ['客户端独立语义化版本', '旧客户端不保证理解未来服务能力'], '维护企业级驱动最低版本清单。'),
    ],
    'https://docs.snowflake.com/en/release-notes/overview',
    ['订阅行为变更并在测试账户启用 bundle', '比较 Query History 的扫描、spill 与成本', '核对驱动、连接器和 Snowpark 支持矩阵'],
  ),
  bigquery: guide(
    'BigQuery 是无服务器分析服务。工程重点是列式扫描、slot、分区/聚簇、数据位置和按扫描量或容量计费。',
    ['能估算查询成本', '能设计分区与聚簇', '能处理持续服务变更'],
    [
      concept('执行与 Slot', '查询被拆为 stage 并由 slot 执行；shuffle、倾斜和高基数聚合常是瓶颈。', ['查看 execution graph', '减少重复扫描', '处理 skew 与大 shuffle']),
      concept('分区、聚簇与成本', '分区消除整段数据，聚簇改善块裁剪；SELECT * 会直接放大扫描成本。', ['启用 require_partition_filter', '先 dry run', '合理使用物化视图']),
      concept('数据位置与治理', 'dataset location 影响 join、复制和合规；IAM、行列策略与审计共同构成治理。', ['先定区域再建表', '最小权限', '区分 time travel 与备份']),
    ],
    '云服务持续更新且不可降级；GoogleSQL、服务能力、驱动和客户端库分别发布。',
    [
      version('BigQuery 服务更新', ['功能按日期持续发布', 'Preview 与 GA 边界需要显式记录'], '生产只依赖已满足稳定性要求的能力。'),
      version('GoogleSQL 行为变化', ['新函数、数据类型和限制持续演进', 'Legacy SQL 能力逐步受限'], '固定方言并回归关键查询结果。'),
      version('客户端库/驱动', ['Java、Python、ODBC/JDBC 独立发布', 'API 能力与库版本可能不同步'], '维护最低版本并执行序列化兼容测试。'),
    ],
    'https://docs.cloud.google.com/bigquery/docs/release-notes',
    ['记录 Preview/GA 依赖', '回放查询并比较 bytes processed 与 slot time', '核对区域、IAM、客户端和 Data Transfer 变更'],
  ),
  mongodb: guide(
    'MongoDB 的关键不是“无 Schema”，而是围绕原子边界、查询模式、索引和分片键设计稳定的文档模型。',
    ['能选择嵌入或引用', '能解释 replica set 与读写关注', '能设计可扩展分片键'],
    [
      concept('文档原子边界', '单文档写入天然原子，嵌入可减少 join，但无限增长数组会制造热点和大文档。', ['按一致性边界嵌入', '控制文档大小', '避免无界数组']),
      concept('索引与聚合', '复合索引顺序、multikey、覆盖查询和 Aggregation Pipeline 决定查询成本。', ['用 explain executionStats', '限制高代价 $lookup', '维护索引选择性']),
      concept('复制与分片', 'replica set 负责高可用，sharding 负责容量；read/write concern 定义一致性。', ['选择高基数分片键', '避免单调热点', '演练 stepdown 与 chunk 迁移']),
    ],
    'MongoDB 提供 stable release 与历史长期版本线；大版本升级通常需要逐级提升 featureCompatibilityVersion。',
    [
      version('MongoDB 8.3 Stable', ['快速稳定版本线持续引入能力', '驱动与 Atlas 支持需同步核对'], '采用前确认组织对升级频率的承受能力。'),
      version('MongoDB 8.2', ['8.x 查询与性能能力继续演进', '部分行为受 FCV 控制'], '升级二进制后分阶段提升 FCV。'),
      version('MongoDB 8.0', ['性能、安全和分片能力形成重要基线', '从 7.x 升级需检查不兼容项'], '先处理 deprecation 和索引/查询回归。'),
    ],
    'https://www.mongodb.com/docs/manual/release-notes/',
    ['运行 compatibility/deprecation 检查', '逐节点升级 replica set/sharded cluster', '延后 FCV 提升以保留回退窗口'],
  ),
  couchdb: guide(
    'CouchDB 围绕 HTTP、MVCC 修订树和复制构建。最重要的是接受最终一致复制与应用级冲突处理，而不是把它当 MongoDB 替代品。',
    ['能解释 revision 与冲突', '能设计复制拓扑', '能选择 Mango 或 View'],
    [
      concept('Revision 与 MVCC', '更新创建新 revision，冲突分支可能同时存在；_rev 是并发控制令牌而非业务版本号。', ['写入携带当前 _rev', '保留业务合并策略', '不要依赖 revision 排序']),
      concept('复制与冲突', '复制是增量、可恢复和双向的，但不会自动按业务语义合并冲突。', ['监控 checkpoint', '设计幂等文档', '定期扫描冲突']),
      concept('Mango 与 View', 'Mango 提供声明式选择器，MapReduce View 适合预计算索引；两者能力与成本不同。', ['为 selector 建索引', '避免全库扫描', '规划索引重建']),
    ],
    '采用 3.x 稳定分支和补丁发布；升级要同时核对 Erlang/OTP、索引实现和集群配置。',
    [
      version('CouchDB 3.5.x', ['Nouveau 搜索与索引构建持续增强', '便利二进制的 Erlang 版本会影响安全'], '升级后检查搜索索引版本与重建策略。'),
      version('CouchDB 3.4.x', ['3.x 集群与安全能力持续维护', '配置默认值可能变化'], '对认证、复制和 compaction 做回归。'),
      version('CouchDB 3.0+', ['默认文档大小、分片与节点接口有重要变化', '从 2.x 迁移需阅读专门升级说明'], '先修正超大文档和旧接口依赖。'),
    ],
    'https://docs.couchdb.org/en/stable/whatsnew/index.html',
    ['备份配置和系统数据库', '验证复制 checkpoint、冲突与索引重建', '核对 Erlang/OTP、认证和集群节点兼容'],
  ),
  redis: guide(
    'Redis 的低延迟来自内存数据结构和单命令原子性。持久化、淘汰、复制与 Cluster 需要按数据丢失预算设计。',
    ['能选择数据结构', '能计算内存与过期风险', '能设计复制和 Cluster 故障切换'],
    [
      concept('数据结构与原子性', 'String、Hash、Set、ZSet、Stream 等提供不同复杂度；Lua/Functions 可组合原子逻辑。', ['先估算 O(N)', '避免大 key', '脚本必须有时间边界']),
      concept('过期、淘汰与持久化', 'TTL、maxmemory policy、RDB 和 AOF 分别解决生命周期、容量与恢复。', ['区分 expire 与 eviction', '监控 fork/AOF rewrite', '演练数据恢复']),
      concept('复制与 Cluster', '异步复制意味着故障切换可能丢失已确认写入；Cluster 用 hash slot 分片。', ['理解 WAIT 的边界', '使用 hash tag 控制多键操作', '处理 MOVED/ASK']),
    ],
    'Redis 7.4+ 的开源版本和模块采用新的发布/许可体系；服务器、Stack 和模块版本需分别核对。',
    [
      version('Redis 8.x', ['模块能力逐步整合到统一发行线', '许可、命令和客户端支持需按具体版本确认'], '升级决策必须同时包含技术与许可评审。'),
      version('Redis 7.4', ['Hash field TTL 等数据结构能力增强', 'Stack 模块组合与移除项需要检查'], '回归过期语义、RDB/AOF 和模块索引。'),
      version('Redis 7.2', ['稳定的 ACL、Functions 与 Cluster 基线', '较新客户端可能默认使用新协议能力'], '维护协议和客户端兼容矩阵。'),
    ],
    'https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/release-notes/',
    ['扫描大 key、过期分布和模块依赖', '在副本上验证 RDB/AOF 加载', '演练 Sentinel/Cluster 故障切换与客户端重连'],
  ),
  valkey: guide(
    'Valkey 延续 RESP 与 Redis OSS 数据结构，同时在 Linux Foundation 治理下快速演进。关键是验证命令、持久化、模块和客户端兼容边界。',
    ['能从 Redis OSS 评估迁移', '能设计低延迟数据结构', '能管理快速版本线'],
    [
      concept('RESP 与兼容性', '大多数 Redis OSS 客户端可连接 Valkey，但新命令、模块和管理工具不会永久完全同步。', ['跑命令兼容测试', '核对 ACL/协议版本', '检查云服务支持']),
      concept('线程与内存', 'Valkey 在保持命令语义的同时持续优化 I/O、内存和多线程路径。', ['监控 latency doctor', '避免大 key', '按数据结构计算内存']),
      concept('持久化与集群', 'RDB、AOF、复制和 hash slot 仍是核心恢复与扩展机制。', ['验证文件双向兼容', '演练 reshard', '明确故障丢失窗口']),
    ],
    '提供 7.2、8.x、9.x 等并行版本线；主版本可能引入新能力，补丁版本集中安全与缺陷修复。',
    [
      version('Valkey 9.1', ['最新功能版本线', '需要较新的客户端与工具验证'], '适合新能力验证，生产采用要核对生态支持。'),
      version('Valkey 9.0', ['9.x 主版本基线', '与 8.x 的配置和命令变化需检查'], '升级前回放命令、脚本和持久化文件。'),
      version('Valkey 8.1/8.0', ['生态较成熟的版本线', '仍持续获得补丁更新'], '从 Redis OSS 迁移通常先以此类成熟线做验证。'),
    ],
    'https://valkey.io/download/releases/',
    ['比较 COMMAND 输出与脚本依赖', '验证 RDB/AOF、模块和客户端', '演练复制、Cluster 与回滚'],
  ),
  dynamodb: guide(
    'DynamoDB 没有传统服务器版本，设计核心是把访问模式编码到分区键、排序键和二级索引中，并管理容量与热点。',
    ['能从访问模式反推主键', '能识别热分区', '能选择一致性、事务与全球表'],
    [
      concept('单表与键设计', 'PK 决定数据分布，SK 决定同一实体集合内的排序与范围查询。', ['先列出访问模式', '避免低基数 PK', '用条件写入保护约束']),
      concept('GSI 与容量', 'GSI 是异步维护的新访问路径，会额外消耗写入和存储；容量模式不消除热点。', ['投影最少字段', '监控 throttling reason', '预热突发流量']),
      concept('一致性与全球表', '基础表可强一致读取，GSI 最终一致；全球表的一致性模式和区域拓扑需明确。', ['区分 RPO/RTO', '处理跨区冲突', 'Streams 消费保持幂等']),
    ],
    'AWS 持续交付托管服务能力；DynamoDB Local、SDK 和全局服务功能有各自变更记录。',
    [
      version('托管服务持续更新', ['功能无需用户升级服务器', '区域可用性和限制可能不同'], '基础设施代码和能力探测要按区域验证。'),
      version('全球表与一致性演进', ['多区域强一致等能力按区域和拓扑提供', '旧全局表模式需核对迁移路径'], '更新灾备设计文档和故障演练。'),
      version('DynamoDB Local 3.x', ['本地模拟器迁移到较新 AWS SDK 基线', '不模拟全部托管服务行为'], '本地测试之外仍需在真实 AWS 环境做集成验证。'),
    ],
    'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DocumentHistory.html',
    ['核对区域、配额和 IAM 变化', '回放热点键与容量突发', '验证 Streams、全球表和 SDK 重试语义'],
  ),
  cassandra: guide(
    'Cassandra 要按查询反向设计表。分区键、聚簇顺序、一致性级别、压缩和 tombstone 是性能与可靠性的共同基础。',
    ['能设计有界分区', '能计算一致性条件', '能治理 compaction 与 tombstone'],
    [
      concept('查询驱动建模', '每张表服务明确查询，分区键定位节点，聚簇列定义分区内排序。', ['避免跨分区扫描', '限制分区大小', '为每个访问模式建表']),
      concept('一致性与修复', '副本数 N、读写一致性 R/W 决定可用性与一致性；repair 修复副本差异。', ['记录 consistency level', '规划增量 repair', '处理 hinted handoff 边界']),
      concept('LSM、压缩与 Tombstone', '写入先到 memtable/WAL，再形成 SSTable；删除产生 tombstone，压缩负责合并。', ['按工作负载选 UCS/STCS/LCS', '避免 tombstone storm', '监控 pending compaction']),
    ],
    'Apache Cassandra 以大版本和补丁线维护；跨大版本升级需逐节点滚动并遵守 SSTable/协议兼容要求。',
    [
      version('Cassandra 5.0', ['SAI、Trie memtable/SSTable、向量类型与 Unified Compaction', '要求 JDK 17 并包含新 guardrail'], '索引和压缩收益大，但必须先验证硬件与运维工具。'),
      version('Cassandra 4.1', ['配置、guardrail 和可观测性增强', '从 4.0 升级相对平滑'], '适合作为迁往 5.0 前的兼容基线。'),
      version('Cassandra 4.0', ['一致性、修复和性能的重要成熟基线', '旧 3.x 迁移需要分阶段'], '升级前完成 repair 并清理不兼容 SSTable。'),
    ],
    'https://cassandra.apache.org/doc/stable/cassandra/new/',
    ['升级前完成 repair 与快照', '逐节点升级并观察 schema agreement', '验证驱动协议、JDK、压缩和 SSTable 工具'],
  ),
  scylladb: guide(
    'ScyllaDB 兼容 CQL，但 shard-per-core、Seastar 调度和节点资源隔离改变了容量规划与尾延迟治理方式。',
    ['能解释 shard-per-core', '能复用并验证 CQL 模型', '能执行安全滚动升级'],
    [
      concept('Shard-per-core', '每个 CPU 核心拥有独立 shard，减少共享锁；分区到 shard 的映射影响均衡。', ['绑定 CPU/NUMA', '控制 cross-shard 操作', '按 shard 观察负载']),
      concept('CQL 与数据模型', '仍需按分区键与聚簇键设计有界分区，兼容不意味着所有 Cassandra 行为一致。', ['验证驱动和 system 表', '避免大分区', '核对 LWT 语义']),
      concept('Compaction 与维护', '压缩、repair、streaming 和 tablet/ring 管理直接影响尾延迟。', ['限制维护并发', '监控 reactor stall', '逐节点演练恢复']),
    ],
    '新版本采用年份版本号并提供明确的相邻版本升级指南；补丁升级与主线升级路径不同。',
    [
      version('ScyllaDB 2026.2', ['2026 年功能线继续演进', '从 2026.1 有专门升级路径'], '只按官方相邻版本指南滚动升级。'),
      version('ScyllaDB 2026.1', ['年份版本基线', '配置、监控和驱动需要同步核对'], '升级前保存 system 与监控基线。'),
      version('旧 6.x/2025.x 版本线', ['版本命名和产品形态发生演进', '跨代升级可能要求中间版本'], '先确认支持策略和许可形态。'),
    ],
    'https://docs.scylladb.com/manual/stable/upgrade/index.html',
    ['按节点完成 repair/备份与健康检查', '核对驱动、CQL、system 表和管理工具', '滚动升级期间监控 shard、streaming 和延迟'],
  ),
  elasticsearch: guide(
    'Elasticsearch 是近实时搜索系统。mapping、分析器、Lucene segment、shard 拓扑和生命周期策略决定相关性与集群成本。',
    ['能设计 mapping/analyzer', '能控制 shard 与 segment', '能安全完成大版本 reindex/upgrade'],
    [
      concept('倒排索引与 Mapping', 'text 经 analyzer 进入倒排索引，keyword 保留精确值；错误 mapping 很难原地修复。', ['显式模板', '控制动态字段爆炸', '区分 text/keyword']),
      concept('Shard 与 Segment', '每个 shard 是 Lucene 索引，刷新产生 segment，merge 回收删除并重写数据。', ['避免过多小 shard', '监控 merge/refresh', '容量包含副本']),
      concept('查询与生命周期', 'Query DSL/ES|QL、聚合、向量和 ILM 共同服务检索与冷热分层。', ['过滤与评分分离', '限制深分页', '用 rollover 管理时序索引']),
    ],
    'Elastic Stack 使用语义化大版本；大版本会移除已弃用行为，云 Serverless 还有独立持续更新节奏。',
    [
      version('Elasticsearch 9.x', ['ES|QL、向量与平台能力继续增强', '9.0 移除多项 8.x 已弃用行为'], '先清空 deprecation API 告警再迁移。'),
      version('Elasticsearch 8.x', ['默认安全、向量检索与数据流形成成熟基线', '索引兼容受创建版本限制'], '旧索引可能需要 reindex。'),
      version('Elasticsearch 7.x', ['移除 mapping type 的过渡版本', '已结束或接近支持边界'], '迁往 8/9 应规划中间版本与 reindex。'),
    ],
    'https://www.elastic.co/docs/release-notes',
    ['运行 Upgrade Assistant 与 deprecation API', '快照并验证 restore/reindex', '核对插件、JDK、客户端和索引创建版本'],
  ),
  opensearch: guide(
    'OpenSearch 从 Elasticsearch OSS 分支演进出独立的搜索、可观测和向量生态；核心仍是 mapping、shard、segment 与插件兼容。',
    ['能设计搜索索引', '能管理插件版本锁步', '能选择滚动升级或迁移方式'],
    [
      concept('搜索与向量索引', '倒排索引、doc values、k-NN 与混合检索服务不同查询路径。', ['设计 analyzer', '量化向量内存', '评估混合排序']),
      concept('插件化平台', 'Security、Alerting、ISM、Observability 等插件与核心版本需要严格匹配。', ['维护插件清单', '版本号锁步', '升级前验证自定义插件']),
      concept('Shard 与生命周期', '主分片、副本、segment merge 和 ISM 决定容量、恢复和冷热迁移。', ['控制 shard 数量', '快照外置', '演练 rolling restart']),
    ],
    '遵循语义化版本，breaking changes 集中在主版本；官方插件通常要求主/次/补丁严格匹配。',
    [
      version('OpenSearch 3.x', ['向量、可观测和 Agent 能力快速增强', 'JDK、插件和 breaking changes 需核对'], '升级前建立插件和索引兼容矩阵。'),
      version('OpenSearch 2.x', ['成熟的搜索与插件基线', '迁往 3.x 需处理已弃用术语和行为'], '可通过 rolling、snapshot/restore 或 remote reindex 迁移。'),
      version('OpenSearch 1.x', ['从 Elasticsearch OSS 分支的早期基线', '多项限制和 API 已在 2/3 中变化'], '不应直接跳过中间大版本滚动升级。'),
    ],
    'https://docs.opensearch.org/latest/version-history/',
    ['快照并校验恢复', '核对核心、Dashboards、插件和 JDK 版本', '检查 breaking changes 与旧索引兼容'],
  ),
  neo4j: guide(
    'Neo4j 把关系作为一等数据。核心是属性图建模、Cypher 路径语义、索引/约束和集群路由，而不是把关系表逐行搬成节点。',
    ['能识别适合图遍历的问题', '能写有界 Cypher', '能管理 Cypher 与服务器版本变化'],
    [
      concept('属性图建模', '节点表达实体，关系表达有方向的语义，属性承载过滤和展示数据。', ['关系类型具体化', '避免超级节点', '用约束保证身份']),
      concept('Cypher 与路径', 'MATCH 描述图模式；可变长度路径若无边界会产生组合爆炸。', ['尽早过滤起点', '限制路径长度', '查看 PROFILE db hits']),
      concept('索引、事务与集群', '范围/文本/点/向量索引加速起点定位，事务保证图更新原子性，集群提供路由与副本。', ['索引不是遍历替代品', '使用书签保证因果一致', '区分读副本和主成员']),
    ],
    '5.26 之后采用年份.月份版本线并保留 LTS；Cypher 版本可与服务器版本分开选择。',
    [
      version('Neo4j 2025–2026', ['按月发布服务器能力', 'Cypher 25 与配置默认值逐步变化'], '固定 db.query.default_language 并跟踪月度 breaking changes。'),
      version('Neo4j 5.26 LTS', ['5.x 长期支持基线', '是迁往年份版本线的重要比较点'], '长期生产可围绕 LTS 规划。'),
      version('Neo4j 5.x', ['多数据库、集群与 Cypher 能力持续演进', '配置名和过程存在弃用'], '先运行配置迁移和 deprecation 检查。'),
    ],
    'https://neo4j.com/docs/operations-manual/current/changes-2025-2026/',
    ['运行 migrate-configuration 和兼容检查', '备份并验证 restore/cluster seed', '回归 Cypher 版本、过程、插件与驱动'],
  ),
  influxdb: guide(
    'InfluxDB 不同代际的存储与查询架构差异很大。学习时必须先确认使用 1.x、2.x 还是 3 Core/Enterprise。',
    ['能控制 series cardinality', '能区分代际查询语言', '能规划跨代迁移'],
    [
      concept('时序模型与基数', 'measurement/table、tag 和 field 的选择决定索引基数与查询性能。', ['高基数值放 field', '规范 tag 集合', '监控 series 增长']),
      concept('写入与窗口查询', '批量写入、时间范围、降采样与保留策略是主要吞吐和成本杠杆。', ['批量且有序写入', '查询必带时间范围', '预计算长期聚合']),
      concept('产品代际', '1.x 以 InfluxQL 为主，2.x 引入 Flux 与统一 API，3.x 转向 Arrow/Parquet/DataFusion 与 SQL。', ['不要假设 API 兼容', '列出 Flux 依赖', '先做双写/导出验证']),
    ],
    '1.x、2.x 与 3.x 是架构代际而非普通原地升级；3 Core 与 Enterprise 也有能力差异。',
    [
      version('InfluxDB 3 Core', ['Parquet/对象存储与 SQL 查询成为核心', '配置和资源默认值仍在快速演进'], '新部署适合评估，但要仔细阅读 breaking changes。'),
      version('InfluxDB 2.x', ['Flux、bucket/token 与统一 API', '迁往 3.x 需重新评估查询和任务'], '保留 Flux/Task 清单并验证替代方案。'),
      version('InfluxDB 1.x', ['InfluxQL、database/retention policy 模型', '与新代际身份和 API 不同'], '迁移通常是数据与查询重构项目。'),
    ],
    'https://docs.influxdata.com/influxdb3/core/release-notes/',
    ['盘点 InfluxQL/Flux/SQL 与 API 使用', '导出样本数据验证精度、类型和聚合', '演练认证、保留、备份和回退'],
  ),
  timescaledb: guide(
    'TimescaleDB 是 PostgreSQL 扩展。核心价值来自 hypertable/chunk、连续聚合和列式压缩，同时继承 PostgreSQL 的事务与运维责任。',
    ['能设计 chunk interval', '能使用连续聚合', '能协调 PostgreSQL 与扩展升级'],
    [
      concept('Hypertable 与 Chunk', 'hypertable 把时间数据路由到 chunk；chunk 太大影响维护，太小增加规划开销。', ['按活跃数据量定 interval', '时间条件必须可裁剪', '管理旧 chunk']),
      concept('列式压缩/Hypercore', '历史 chunk 可转换为更适合分析的列式组织，segment/order 配置决定压缩和查询收益。', ['按常用过滤 segment', '按时间排序', '理解更新限制']),
      concept('连续聚合', '连续聚合增量维护时间桶结果，并通过 refresh policy 控制新鲜度。', ['设置合理 lag', '保留原始数据边界', '监控 refresh job']),
    ],
    'TimescaleDB 2.x 作为 PostgreSQL 扩展独立发布；升级还必须满足宿主 PostgreSQL 版本兼容。',
    [
      version('TimescaleDB 当前 2.x', ['列式、连续聚合和云能力持续演进', '文档与许可边界需按具体版本核对'], '固定扩展版本并维护 PostgreSQL 兼容矩阵。'),
      version('TimescaleDB 较早 2.x', ['分布式、压缩 API 和策略行为曾多次演进', '部分能力可能弃用或迁移'], '逐版阅读 release notes，不跨过要求的中间版本。'),
      version('TimescaleDB 1.x', ['早期 hypertable/continuous aggregate 基线', '迁往 2.x 涉及 API 与策略变化'], '先在副本完成扩展升级和作业验证。'),
    ],
    'https://docs.timescale.com/about/latest/release-notes/',
    ['核对 PostgreSQL 与 TimescaleDB 兼容矩阵', '新会话首先执行 ALTER EXTENSION UPDATE', '验证 jobs、连续聚合、压缩和备份恢复'],
  ),
} satisfies Record<string, DatabaseGuideData>;
