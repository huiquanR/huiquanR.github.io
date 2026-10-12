---
title: "日记"
date: 2019-10-23
permalink: /posts/2019-10-23-clean-r-scripts/
layout: post
---

最近有个需求要用R语言实现。因为要分享 CODES，整洁一点毕竟比较好，所以想把一个R脚本中不必要加载的 package 都找出来，并且删掉，不必加载。

于是找到两个网上的讨论：`NCmisc` 和 `iconv`。因为我的数据库、变量取值和R脚本包含一些中文 non-ASCII 字符，于是先用 `iconv` 转换一下，再使用 `NCmisc::list.functions.in.file` 检查脚本中调用的函数和 package。

这个函数如果想要正确执行，需要R环境先加载相关的包。也就是说要先把“可能要用到的包”加载，然后函数才能判断脚本里调用了环境中的哪些包。其后，再提取这些真正用到的 packages（应该是之前所有加载包的真子集），精简代码到只载入相关包。

稍微有点小麻烦，且现在电脑性能高了，也许没必要做的这么 clean。但很多资深程序员都强调工作环境要 clean，代码要 clean，听内行的准没错儿。

## 2026补充 note

现在更建议使用 `package::function()` 明确函数来源，用 `renv::dependencies()` 扫描项目依赖，用 `lintr` 和 `codetools` 辅助检查，并用 `renv::snapshot()` 和 `renv::restore()` 固定、重建 package 环境。不要为了旧工具而把中文转换成 ASCII；优先保持 UTF-8。真正删除 `library()` 前，应在干净的 R 会话中运行完整脚本，检查动态调用、`source()`、S3/S4 方法和可选依赖。

推荐的核心检查函数：

```r
list_project_packages <- function(path = getwd(), dev = FALSE) {
  deps <- renv::dependencies(path = path, dev = dev)
  deps <- deps[!is.na(deps$Package) & nzchar(deps$Package), , drop = FALSE]
  unique(deps[c("Package", "Source", "File")])
}
```
