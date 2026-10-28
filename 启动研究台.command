#!/bin/zsh
cd "$(dirname "$0")"
if ! command -v python3 >/dev/null 2>&1; then
  echo '请先安装 Python 3.10 或更新版本，再双击此文件。'
  read -r '?按回车退出'
  exit 1
fi
CHAINLENS_OPEN_BROWSER=1 python3 server/app.py
read -r '?服务已停止，按回车关闭'
