<template>
  <div class="search">
    <div class="head">
      <div>
        <img
          src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png"
          alt=""
        />
        <input
          type="text"
          confirm-type="search"
          focus="true"
          v-model="words"
          @focus="inputFocus"
          @input="tipsearch"
          @confirm="searchWords"
          placeholder="商品搜索"
        />
        <img
          @click="clearInput"
          class="del"
          src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png"
          alt=""
        />
      </div>
      <div @click="cancel">取消</div>
    </div>
    <div class="searchtips" v-if="words">
      <div v-if="tipsData.length">
        <div
          v-for="(item, index) in tipsData"
          :key="index"
          @click="searchWords"
          :data-value="item.name"
        >
          {{ item.name }}
        </div>
      </div>
      <div v-else class="nogoods">数据库暂无此类商品</div>
    </div>
    <div class="history" v-if="historyData.length !== 0">
      <div class="t">
        <div>历史记录</div>
        <div @click="clearHistory"></div>
      </div>
      <div class="cont">
        <div
          v-for="(item, index) in historyData"
          :key="index"
          @click="searchWords"
        >
          {{ item.keyword }}
        </div>
      </div>
    </div>
    <div class="history hotsearch">
      <div class="t">
        <div>热门搜索</div>
      </div>
      <div class="cont">
        <div
          v-for="(item, index) in hotData"
          :key="index"
          :class="{ active: item.is_hot === 1 }"
          @click="searchWords"
          :data-value="item.keyword"
        >
          {{ item.keyword }}
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="goodsList" v-if="listData.length != 0">
      <div class="sortnav">
        <div @click="changeTab(0)" :class="[0 === nowIndex ? 'active' : '']">
          综合
        </div>
        <div
          @click="changeTab(1)"
          :class="[1 === nowIndex ? 'active' : '']"
          class="price"
        >
          价格
        </div>
        <div @click="changeTab(2)" :class="[2 === nowIndex ? 'active' : '']">
          分类
        </div>
      </div>
      <div class="sortlist">
        <div
          class="item"
          v-for="(item, index) in listData"
          @click="goodsDetail(item.id)"
          :key="index"
        >
          <img :src="item.list_pic_url" alt="" />
          <p class="name">{{ item.name }}</p>
          <p class="price">￥{{ item.retail_price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from "../../utils";
export default {
  name: "search",
  data() {
    return {
      words: "",
      openid: "",
      // 热门搜索
      hotData: [],
      // 历史搜索
      historyData: [],
      // 搜索提示数组
      tipsData: [],
      order: "",
      // 商品数组
      listData: [],
      // 选中的tab栏
      nowIndex: 0,
    };
  },
  mounted() {
    this.openid = wx.getStorageSync("openId") || "";
    // 获取历史数据
    this.getHotData();
  },
  methods: {
    // 清空输入框
    clearInput() {
      this.words = "";
      this.listData = [];
      this.tipsData = [];
    },
    cancel() {
      wx.navigateBack({
        delta: 1,
      });
    },
    async clearHistory() {
      const data = await post("/search/clearhistoryAction", {
        openId: this.openid,
      });
      if (data) {
        // 清除成功的话清空现有的HTML结构数据
        this.historyData = [];
      }
    },
    inputFocus() {},
    // 搜索提示关键字
    async tipsearch() {
      const data = await get("/search/helperaction", {
        keyword: this.words,
      });
      this.tipsData = data.keywords;
      console.log(data);
    },
    // 搜索关键词
    async searchWords(e) {
      let values = e.currentTarget.dataset.value;
      this.words = values || this.words;
      const data = await post("/search/addhistoryaction", {
        openId: this.openid,
        keyword: values || this.words,
      });
      // 获取历史数据
      this.getHotData();
      // 获取列表数据
      this.getlistData();
    },
    // 获取热门数据
    async getHotData(first) {
      const data = await get("/search/indexaction?openId=" + this.openid);
      this.historyData = data.historyData;
      this.hotData = data.hotKeywordList;
      console.log(data);
    },
    // 获取搜索列表
    async getlistData() {
      // 获取商品列表
      const data = await get("/search/helperaction", {
        keyword: this.words,
        order: this.order,
      });
      this.listData = data.keywords;
      console.log(data, 123);
    },
    // 改变tab
    changeTab(index) {
      this.nowIndex = index;
      if (index === 1) {
        this.order = this.order == "asc" ? "desc" : "asc";
      } else {
        this.order = "";
      }
      this.getlistData();
    },
    // 商品详情
    goodsDetail(id) {
      wx.navigateTo({
        url: "/pages/goods/main?id=" + id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
