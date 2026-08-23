# Neo4j 核心知识

## Cypher 实战模式

```cypher
// 查找两跳关注关系推荐
MATCH (me:User {name: 'Alice'})-[:FOLLOWS]->(:User)-[:FOLLOWS]->(recommendation:User)
WHERE NOT (me)-[:FOLLOWS]->(recommendation) AND me <> recommendation
RETURN recommendation.name, count(*) AS strength
ORDER BY strength DESC
LIMIT 10;
```
