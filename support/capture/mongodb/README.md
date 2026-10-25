# MongoDB 镜像与文件采集

本目录由 Hello SQL 维护 MongoDB 9.0.4、mongosh 2.12.0 和 Database Tools 100.19.1 的安装、版本、案例和采集入口。公共 Ubuntu 基线与 Bash 采集工具由 Hello Docker 提供；页面读取本站生成的展示包。旧 MongoDB 7/8 证据不变。

镜像关系：`公共 Ubuntu 26.04 → MongoDB + Shell + Tools`。MongoDB 所需 apt 运行库在产品层安装，差异包含这些依赖；产品命令仅来自 recipe 中的三个 `/opt` 安装目录。归档包来源和 SHA-256 固定在 `recipe.json`，安装先校验再解压。apt 依赖先记录解析出的下载地址和 SHA-256，再下载、核验、离线安装；镜像中保留依赖证据、产品包文件表和实际 apt 版本。apt 包名本身不是版本锁；更新仓库后重新构建属于新批次。

在本地 Linux / WSL2 执行。默认 rootless Podman，需安装 Compose provider（例如 podman-compose）、Node.js 22 和 Bash；也可设 `ENGINE=docker`。容器基线版本与 WSL 宿主版本相互独立。

```bash
# 从 Hello SQL 仓库根目录运行；工具路径显式指定，不猜相邻目录。
export HELLO_DOCKER_HOME=/absolute/path/to/hello-docker
export ENGINE=podman
export BASE_IMAGE=localhost/hello-capture/ubuntu:26.04

# 基线可以给 Java、MongoDB、RabbitMQ 共用，已有则跳过。
bash "$HELLO_DOCKER_HOME/support/capture/ubuntu/build.sh"

# 只构建；每个新批次使用新目录，保存日志、真实镜像 ID 和 recipe 哈希。
export BUILD_OUTPUT_DIR="$PWD/support/capture/mongodb/.local/builds/mongo-9.0.4-first"
bash support/capture/mongodb/build.sh

# 扫描已构建父/子镜像，再在新的产品容器执行五组案例。
bash support/capture/mongodb/capture.sh \
  --tools "$HELLO_DOCKER_HOME" \
  --images "$BUILD_OUTPUT_DIR/images.json" \
  --workspace "$PWD/support/capture/mongodb/.local/runs/mongo-9.0.4-first"
```

`MONGODB_IMAGE` 可覆盖产品镜像标签。采集使用构建记录内的不可变镜像 ID；recipe 改动后必须重新构建。公共工具只接收阶段镜像、recipe 和输出目录，不识别 MongoDB 产品参数。

采集只有一个读写挂载 `/capture`，脚本位于 `/capture/scripts/product`，工作数据位于 `/capture/work`，输出在 `/capture/results`。完整文件扫描排除该挂载和声明的运行时挂载。`prepare.sh` 在案例容器启动一次本地 MongoDB，等待成功后填充三条 seed 数据，全部案例完成或出错时停止该进程。案例覆盖版本、连接、临时集合增查、导出导入、备份恢复；不连接外部数据库。

完成校验后可给 `capture.sh` 传 `--site <本站展示包目录>`。原始清单、差分、步骤 stdout/stderr/退出码和构建日志归本项目批次保存；本地 `.local` 不自动进入 Git。手动工作流 `collect-mongodb-capture.yml` 要求提供已发布的 Hello Docker 完整提交 SHA，仅上传产物，不自动提交、推送或发布。

