<script setup>
import { transactionExample } from '../.vitepress/theme/data/lessonExamples';
</script>

# 事务、锁与并发

事务把一组读写变成一个失败边界。ACID 并不意味着所有并发异常自动消失；隔离级别、锁粒度、MVCC 快照和业务重试共同决定可见行为。

## 工程检查表

- 事务必须尽量短，避免在事务中等待网络调用。
- 更新顺序保持一致，减少死锁。
- Serializable 失败需要重试策略。
- “读后写”要验证丢失更新，不能只依赖应用内判断。

<DatabaseWorkbench engine="sqlite" title="COMMIT 与 ROLLBACK" :initial-source="transactionExample" />
