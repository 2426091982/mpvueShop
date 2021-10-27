const _ = require("lodash");
const fs = require("fs");
const path = require("path");

// 映射 d 文件夹下的文件为模块

const mapDir = (d) => {
  const tree = {};
  // 获取当前文件夹下的所有文件夹和文件，分成两组，文件夹一组，文件一组
  const [dirs, files] = _(fs.readdirSync(d)).partition((p) =>
  // 判断是文件夹还是文件，最后把文件夹和文件分成两个数组
    fs.statSync(path.join(d, p)).isDirectory()
  );

  // 映射文件夹
  dirs.forEach((dir) => {
    // 递归,查看该文件夹下还有没有文件，直到没有多的文件
    tree[dir] = mapDir(path.join(d, dir));
  });

  // 映射文件
  files.forEach((file) => {
    // 获取文件后缀名字
    if (path.extname(file) === ".js") {
      // tree的属性为该文件名字，值为导入该文件的内容
      tree[path.basename(file, ".js")] = require(path.join(d, file));
    }
  });

  // 返回树对象
  return tree;
};

// 默认导出当前文件夹下的映射
module.exports = mapDir(path.join(__dirname))