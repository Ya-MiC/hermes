# 🧾 Audit Report Agent（阶段一交付物）

吃家庭行业老本的垂直工具：**agent 起草，人类复核**。

## 设计原则
1. 结构化输入（findings 数组），确定性模板渲染——报告骨架零幻觉
2. 高风险发现自动排序置顶
3. 输出强制带"需人工复核"水印

## 文件
- [`report-agent.ts`](./report-agent.ts) — 模板引擎 + DSH 插件封装

## 路线
- [ ] 接 LLM 把 observation 扩写成正式段落（Phase 2）
- [ ] 多司法辖区模板（大陆格式 / 英文 ICFR 格式）
- [ ] 卖给家里的行业人脉——第一个付费客户

⬅ 返回[路线图](../../README.zh.md)
