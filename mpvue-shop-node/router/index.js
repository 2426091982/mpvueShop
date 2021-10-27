const router = require("koa-router")({
  prefix: "/lm",
});

// index控制器
const controllers = require("../controller/index.js");

// 首页数据
router.get("/index/index", controllers.home.index);

// 分类相关的接口
router.get('/category/categoryNav',controllers.category.index.categoryNav);
router.get('/category/indexaction',controllers.category.index.indexAction);
router.get('/category/currentaction',controllers.category.index.currentAction);


// 搜索相关的接口
router.post(
  "/search/addhistoryaction",
  controllers.search.index.addHistoryAction
);
router.get("/search/indexaction", controllers.search.index.indexAction);
router.post(
  "/search/clearhistoryAction",
  controllers.search.index.clearHistoryAction
);
router.get("/search/helperaction", controllers.search.index.helperAction);

// 商品详情
router.get("/goods/detailaction", controllers.goods.index.detailAction);
router.get("/goods/goodsList", controllers.goods.index.goodsList);

// 收藏相关的接口
router.post("/collect/addcollect", controllers.collect.index.addCollect);

// 订单相关的接口
router.post("/order/submitAction", controllers.order.index.submitAction);
router.get("/order/detailAction", controllers.order.index.detailAction);

// 购物车相关的接口
router.post("/cart/addCart", controllers.cart.index.addCart);
router.get("/cart/cartList", controllers.cart.index.cartList);



//收获地址相关的接口
router.get("/address/getListAction", controllers.address.index.getListAction);

router.get("/address/detailAction", controllers.address.index.detailAction);

router.post("/address/saveAction", controllers.address.index.saveAction);

// 专题接口
router.get("/topic/listaction", controllers.topic.index.listAction);
router.get("/topic/detailaction", controllers.topic.index.detailAction);


module.exports = router;
