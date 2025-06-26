@echo off
chcp 65001 > nul
title DepthAnything论文主页
cls

echo.
echo ============================================
echo    DepthAnything At Any Condition
echo         论文主页预览
echo ============================================
echo.

:: 检查文件是否存在
if not exist "index.html" (
    echo ❌ 错误：未找到index.html文件
    echo 请确保在正确的项目目录中运行此脚本
    echo.
    pause
    exit /b 1
)

echo ✅ 发现网站文件
echo 🚀 正在打开论文主页...
echo.

:: 在默认浏览器中打开HTML文件
start "" "index.html"

echo ✅ 网站已在浏览器中打开！
echo.
echo 📝 提示：
echo    - 所有基本功能都可正常使用
echo    - 如需更好的体验，可使用Web服务器
echo.
echo 🎉 享受您的学术论文展示！
echo.
pause 