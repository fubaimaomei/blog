#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd .vuepress/dist


# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME
echo "fubaimaomei.com" > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# https://github.com/fubaimaomei/blog.git
git push -f https://github.com/fubaimaomei/fubaimaomei.github.io.git master
git push -f https://github.com/fubaimaomei/fubaimaomei.github.io.git master:gh-pages

cd -

rm -rf .vuepress/dist