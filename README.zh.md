# 🧩 Hermes DSH 插件

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 编写的插件，遵循[官方插件规范](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.zh.md)。

## 插件列表

| 插件 | 类型 | 说明 |
|---|---|---|
| [`dsh-yamic-repo-index`](./src/dsh-yamic-repo-index/index.ts) | 命令 | 新增 `/yamic-index` 命令，一键打开本索引仓库 |
| [`dsh-turn-clock`](./src/dsh-turn-clock/index.ts) | 界面 | 回合耗时计时器，演示 `ctx.effect()` 生命周期清理 |
| [`dsh-quant-links`](./src/dsh-quant-links/index.ts) | 工具 | 注册 `quant_links` 工具，返回精选量化框架清单 |

## 安装 / 使用

```sh
# 在 DSH 源码目录，通过 cordis.yml overlay 加载：
pnpm dsh web --patch ./cordis.yml
```

每个插件均符合规范：导出 `name` + `apply(ctx: Context)`，用 `inject` 声明依赖服务，用 `ctx.effect()` 清理资源。

文档：**[中文](./README.zh.md)** · **[English](./README.md)** ⬅ 返回[总索引](https://github.com/Ya-MiC/hermes/tree/main)
