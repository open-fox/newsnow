# API 接口文档

## 概述

NewsNow 项目提供 RESTful API 接口，用于获取各数据源的最新资讯。接口基于 H3 (Nitro) 框架实现。

## 接口列表

### 1. 获取单个 Source 数据

**端点:** `GET /api/s`

**参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | Source ID，如 `36kr`、`weibo-hot`、`github-trending` |
| `latest` | string | 否 | `true` 强制获取最新数据（默认 `false`，使用缓存） |

**响应:**

```json
{
  "status": "success" | "cache",
  "id": "github-trending",
  "updatedTime": 1234567890,
  "items": [
    {
      "id": "唯一标识",
      "title": "文章标题",
      "url": "原文链接",
      "mobileUrl": "移动端链接",
      "pubDate": "发布时间",
      "extra": {
        "hover": "悬停提示",
        "date": "日期",
        "info": "额外信息或 false",
        "diff": "时间差(秒)",
        "icon": "图标 URL 或 false 或 { url, scale }"
      }
    }
  ]
}
```

**状态说明:**
- `success`: 成功获取最新数据
- `cache`: 返回缓存数据（未到刷新间隔或 TTL 内）

---

### 2. 批量获取多个 Source 数据

**端点:** `POST /api/s/entire`

**请求体:**

```json
{
  "sources": ["github-trending", "weibo-hot", "hackernews"]
}
```

**响应:**

```json
[
  {
    "status": "cache",
    "id": "github-trending",
    "updatedTime": 1234567890,
    "items": [...]
  },
  {
    "status": "cache",
    "id": "weibo-hot",
    "updatedTime": 1234567890,
    "items": [...]
  }
]
```

---

### 3. 获取版本信息

**端点:** `GET /api/latest`

**响应:**

```json
{
  "v": "0.0.39"
}
```

---

### 4. 登录相关接口

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/login` | GET | GitHub OAuth 登录 |
| `/api/enable-login` | GET | 检查登录是否启用 |
| `/api/me/index` | GET | 获取当前用户信息 |
| `/api/me/sync` | POST | 同步用户数据 |

---

## 可用 Source ID 列表

### 国内源

| Source ID | 名称 |
|-----------|------|
| `36kr` | 36氪 |
| `weibo-hot` | 微博热搜 |
| `weibo-topic` | 微博话题 |
| `zhihu` | 知乎 |
| `bilibili` | B站 |
| `douyin` | 抖音 |
| `toutiao` | 头条 |
| `baidu` | 百度热搜 |
| `tencent` | 腾讯新闻 |
| `ifeng` | 凤凰网 |
| `thepaper` | 澎湃新闻 |
| `juejin` | 掘金 |
| `douban` | 豆瓣 |
| `tieba` | 百度贴吧 |
| `hupu` | 虎扑 |
| `smzdm` | 什么值得买 |
| `coolapk` | 酷安 |
| `steam` | Steam |
| `pcbeta` | PCBeta |
| `v2ex` | V2EX |
| `xueqiu` | 雪球 |
| `jin10` | 金十数据 |
| `cls` | 财经乐讯 |
| `wallstreetcn` | 华尔街见闻 |
| `zaobao` | 早报 |
| `cankaoxiaoxi` | 参考消息 |
| `sputniknewscn` | 俄罗斯卫星通讯社 |
| `sspai` | 少数派 |
| `gelonghui` | 格隆汇 |
| `fastbull` | 财联社 |
| `chongbuluo` | 冲部落 |
| `ghxi` | 谷粉吧 |
| `ithome` | IT之家 |
| `linuxdo` | Linux.do |
| `mktnews` | 营销日历 |
| `nowcoder` | 牛客 |
| `kaopu` | 靠谱社 |
| `kuaishou` | 快手 |
| `qqvideo` | QQ 视频 |
| `iqiyi` | 爱奇艺 |

### 海外源

| Source ID | 名称 |
|-----------|------|
| `github-trending` | GitHub Trending |
| `hackernews` | Hacker News |
| `producthunt` | Product Hunt |
| `solidot` | Solidot |

---

## 缓存策略

- **刷新间隔 (interval)**: 每个 Source 有各自的刷新间隔（默认 10 分钟），在间隔内不会重新获取数据
- **TTL**: 缓存总有效期，超过后无论是否登录都会重新获取数据
- **latest 参数**: 当 `latest=true` 时，会跳过缓存直接获取最新数据（需要用户已登录）

---

## 认证说明

部分接口（如 `latest=true` 获取最新数据）需要用户登录后才能使用。登录通过 GitHub OAuth 实现，认证信息存储在 cookie 中。

---

## 数据类型

### NewsItem

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string \| number | 唯一标识 |
| `title` | string | 文章标题 |
| `url` | string | 原文链接 |
| `mobileUrl` | string | 移动端链接 |
| `pubDate` | number \| string | 发布时间 |
| `extra` | object | 额外信息 |

### SourceResponse

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | `"success"` \| `"cache"` | 状态 |
| `id` | string | Source ID |
| `updatedTime` | number \| string | 更新时间戳 |
| `items` | NewsItem[] | 数据列表 |

---

## 使用示例

### cURL

```bash
# 获取 GitHub Trending 数据
curl "https://your-domain.com/api/s?id=github-trending"

# 强制获取最新数据（需登录）
curl "https://your-domain.com/api/s?id=github-trending&latest=true"

# 批量获取数据
curl -X POST "https://your-domain.com/api/s/entire" \
  -H "Content-Type: application/json" \
  -d '{"sources": ["github-trending", "hackernews"]}'
```

### JavaScript

```typescript
// 获取单个 Source
const response = await fetch("/api/s?id=github-trending")
const data = await response.json()

// 批量获取
const response = await fetch("/api/s/entire", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sources: ["github-trending", "hackernews"] })
})
const data = await response.json()
```
