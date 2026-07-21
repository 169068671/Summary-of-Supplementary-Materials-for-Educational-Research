# 教科研补件 GitHub 一键同步

本目录保存 Obsidian 插件调用的安全同步脚本。

- 目标仓库：`https://github.com/169068671/Summary-of-Supplementary-Materials-for-Educational-Research.git`
- 默认分支：`main`
- 不保存 GitHub Token
- 不执行强制推送
- 远程地址不一致、历史冲突或发现疑似密钥文件时自动停止
- 上传前调用 `99_System/validate_vault.py` 核验仓库

正常使用时，在 Obsidian 左侧功能区点击云朵上传图标即可。
