var express = require('express');
var router = express.Router();
//引用模型
var models = require('../models');
/* GET home page. */
router.get('/', async function (req, res, next) {
  //数据分页
  var currentPage = parseInt(req.query.currentPage) || 1;
  var pageSize = parseInt(req.query.pageSize) || 10;
  var result = await models.Word.findAndCountAll({
    offset: (currentPage - 1) * pageSize,
    limit: pageSize
  });
  res.json({
    words: result.rows,
    pagination: {
      currentPage: currentPage,
      pageSize: pageSize,
      //一共有几条数据
      total: result.count
    }
  })
});
//实现新增数据API
router.post('/', async function (req, res, next) {
  var word = await models.Word.create(req.body)
  res.json({ word: word });
});
// 通过id查询单词
router.get('/:id', async function (req, res, next) {
  var word = await models.Word.findByPk(req.params.id);
  res.json({ word: word });
});
//通过id修改单词
router.put('/:id', async function (req, res, next) {
  var word = await models.Word.findByPk(req.params.id);
  word.update(req.body);
  res.json({ word: word });
});
//通过id删除单词
router.delete('/:id', async function (req, res, next) {
  var word = await models.Word.findByPk(req.params.id);
  word.destroy();
  res.json({ msg: '删除成功' });
});
module.exports = router;