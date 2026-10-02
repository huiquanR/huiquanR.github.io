# 个人网站

- 主页：<https://huiquanr.github.io/>
- 随笔：<https://huiquanr.github.io/posts/>
- 电子书：<https://huiquanr.github.io/books/>

## 添加一篇文章

1. 在 `posts/` 新建一篇 Markdown 文件。
2. 在文件开头添加 YAML 信息：`title`、`date`、`permalink` 和 `layout: post`。`date` 填文章原本的日期，格式为 `YYYY-MM-DD`。
3. `permalink` 使用 `/posts/文章短名/` 的格式。
4. 提交并推送到 GitHub，GitHub Pages 会自动生成文章页面，并按 `date` 从新到旧更新 `posts/` 索引。旧文章也会自动插入对应日期的位置，不需要手动调整列表。

## 添加一本电子书

1. 将可公开分享的 PDF、EPUB 等文件放进 `books/files/`。
2. 在 `books/index.html` 添加书名、简介和阅读或下载链接。
3. 推送后可从 `https://huiquanr.github.io/books/` 访问。

所有内容都保存在当前个人网站仓库中。Markdown 是文章源文件，Jekyll/GitHub Pages 会根据 Front Matter 自动生成文章页。
