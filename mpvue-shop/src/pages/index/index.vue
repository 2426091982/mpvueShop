<template>
  <div class="index">
    <!-- 头部的搜索 -->
    <div class="search">
      <div @click="toMappage">{{ cityName }}</div>
      <div @click="toSearch">
        <input type="text" placeholder="搜索商品" />
        <span class="icon"></span>
      </div>
    </div>
    <div class="swiper">
      <swiper
        class="swiper-container"
        indicator-dots="true"
        autoplay="true"
        interval="3000"
        circular="true"
        duration="500"
      >
        <block v-for="(item, index) in banner" :key="index">
          <swiper-item class="swiper-item">
            <image class="slide-image" :src="item.image_url" />
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="channel">
      <div
        v-for="(item, index) in channel"
        @click="categoryList(item.id)"
        :key="index"
      >
        <img :src="item.icon_url" alt="" />
        <p>{{ item.name }}</p>
      </div>
    </div>
    <!-- 品牌 -->
    <div class="brand">
      <div @click="tobrandList" class="head">品牌制造商直供</div>
      <div class="content">
        <div
          v-for="(item, index) in brandList"
          @click="branddetail(item.id)"
          :key="index"
        >
          <div>
            <p>{{ item.name }}</p>
            <p class="price">{{ item.floor_price }}元起</p>
          </div>
          <img :src="item.new_pic_url" alt="" />
        </div>
      </div>
    </div>
    <!-- 新品首发 -->
    <div @click="goodsList('new')" class="newgoods">
      <div class="newgoods-top">
        <div class="top">
          <p>新品首发</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li v-for="(item, index) in newGoods" :key="index">
              <img :src="item.list_pic_url" alt="" />
              <p>{{ item.name }}</p>
              <p>{{ item.goods_brief }}</p>
              <p>￥{{ item.retail_price }}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- 好物精选 -->
    <div @click="goodsList('hot')" class="newgoods hotgoods">
      <div class="newgoods-top">
        <div class="top">
          <p>
            人气推荐
            <span></span>
            好物精选
          </p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li v-for="(item, index) in hotGoods" :key="index">
              <img :src="item.list_pic_url" alt="" />
              <p>{{ item.name }}</p>
              <p>{{ item.goods_brief }}</p>
              <p>￥{{ item.retail_price }}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- 专题精选 -->
    <div class="topicList">
      <div class="topicList-top">
        专题精选
        <span class="icon"></span>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li
              @click="topicdetail(item.id)"
              v-for="(item, index) in topicList"
              :key="index"
            >
              <img :src="item.item_pic_url" alt="" />
              <div class="btom">
                <div>
                  <p>{{ item.title }}</p>
                  <p>{{ item.subtitle }}</p>
                </div>
                <div>{{ item.price_info }}元起</div>
              </div>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- 新分类 -->
    <div class="newcategory">
      <div class="list" v-for="(item, index) in newCategoryList" :key="index">
        <div class="head">{{ item.name }}好物</div>
        <div class="sublist">
          <div v-for="(subitem, subindex) in item.goodsList" :key="subindex">
            <img :src="subitem.list_pic_url" alt="" />
            <p>{{ subitem.name }}</p>
            <p>{{ subitem.retail_price }}</p>
          </div>
          <div class="last">
            <p>{{ item.name }}好物</p>
            <span class="icon"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import amapFile from "../../utils/amap-wx.js";
import { mapState, mapMutations } from "vuex";
import { get } from "../../utils";

export default {
  data() {
    return {
      // 轮播图数据
      banner: [],
      // 金刚位数据
      channel: [],
      // 品牌数据
      brandList: [],
      // 新品数据
      newGoods: [],
      // 人气推荐
      hotGoods: [],
      // 专题精选
      topicList: [],
      // 类别列表**好物
      newCategoryList: [],
    };
  },
  computed: {
    ...mapState(["cityName"]),
  },
  mounted() {
    this.getData();
    this.getCityName();
  },
  methods: {
    ...mapMutations(["update"]),
    // 跳转到地图页
    toMappage() {
      let _this = this;
      wx.getSetting({
        success: (res) => {
          // 如果没有同意授权，打开设置
          // console.log(res)
          if (!res.authSetting["scope.userLocation"]) {
            wx.openSetting({
              success: (res) => {
                // 获取授权位置信息
                _this.getCityName();
              },
            });
          } else {
            wx.navigateTo({
              url: "/pages/mappage/main",
            });
            // _this.getCityName()
          }
        },
        fail: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
    },
    // 获取城市名字
    getCityName() {
      let _this = this;
      var myAmapFun = new amapFile.AMapWX({
        key: "256d94ac927c73a25e9177d789a1d060",
      });
      myAmapFun.getRegeo({
        success: function (data) {
          // 成功回调
          console.log(data);
          // ........
        },
        fail: function (info) {
          // 失败回调
          console.log(info);
          // _this.cityName = '北京'
          _this.update({ cityName: "北京" });
        },
      });
    },
    // 获取首页数据
    async getData() {
      get("/index/index").then((res) => {
        this.banner = res.banner;
        this.channel = res.channel;
        this.brandList = res.brandList;
        this.newGoods = res.newGoods;
        this.hotGoods = res.hotGoods;
        this.topicList = res.topicList;
        this.newCategoryList = res.newCategoryList;
      });
    },
    // 点击跳转分类列表
    categoryList(id) {
      wx.navigateTo({
        url: `/pages/categorylist/main?id=${id}`,
      });
    },
    // 跳转品牌列表详情
    branddetail(id) {
      wx.navigateTo({
        url: `/pages/branddetail/main?id=${id}`,
      });
    },
    // 跳转品牌列表（全部列表）
    tobrandList() {
      wx.navigateTo({
        url: `/pages/brandlist/main`,
      });
    },
    // 跳转新品或者热门列表
    goodsList(info) {
      if (info == "hot") {
        wx.navigateTo({
          url: "/pages/newgoods/main?isHot=" + 1,
        });
      } else {
        wx.navigateTo({
          url: "/pages/newgoods/main?isNew=" + 1,
        });
      }
    },
    // 跳转详情
    topicdetail(id) {
      wx.navigateTo({
        url: "/pages/topicdetail/main?id=" + id,
      });
    },
    // 跳转搜索页面
    toSearch() {
      wx.navigateTo({
        url: "/pages/search/main",
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
