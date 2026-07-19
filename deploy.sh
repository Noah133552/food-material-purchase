#!/bin/bash

echo "=== 食材采购管理系统部署脚本 ==="

if [ -d "dist" ]; then
    echo "清理旧构建..."
    rm -rf dist
fi

echo "构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "构建失败！"
    exit 1
fi

echo "构建成功！"
echo "部署文件位于 dist/ 目录"
echo ""
echo "=== Nginx 配置示例 ==="
echo "在 /etc/nginx/sites-available/ 下创建配置文件："
echo ""
echo "server {"
echo "    listen 80;"
echo "    server_name your-domain.com;"
echo ""
echo "    root /var/www/food-material-purchase/dist;"
echo "    index index.html;"
echo ""
echo "    # 处理 React Router 路由"
echo "    location / {"
echo "        try_files \$uri \$uri/ /index.html;"
echo "    }"
echo ""
echo "    # 静态资源缓存"
echo "    location ~* \\.(js|css|png|jpg|jpeg|gif|svg|ico)$ {"
echo "        expires 1y;"
echo "        add_header Cache-Control \"public, immutable\";"
echo "    }"
echo "}"
