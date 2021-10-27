<template>
  <div class="category">
    <div @click="toSearch" class="search">
      <div class="ser">
        <span class="icon"></span>
        <span>商品搜索,共239款好物</span>
      </div>
    </div>
    <div class="content">
      <scroll-view class="left" scroll-y="true">
        <div
          class="iconText"
          v-for="(item, index) in listData"
          :key="index"
          :class="[index === nowIndex ? 'active' : '']"
          @click="selectItem(item.id, index)"
        >
          {{ item.name }}
        </div>
      </scroll-view>
      <scroll-view class="right" scroll-y="true">
        <div class="banner">
          <img :src="detailData.banner_url" alt="">
        </div>
        <div class="title">
          <span>-</span>
          <span>{{detailData.name}}分类</span>
          <span>-</span>
        </div>
        <div class="bottom">
          <div class="item" @click="categoryList(item.id)" v-for="(item,index) in detailData.subList" :key="index">
            <img :src="item.wap_banner_url" alt="">
            <span>{{item.name}}</span>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { get } from "../../utils";
export default {
  name: "category",
  props: {},
  data() {
    return {
      listData: [],
      nowIndex: 0,
      id: "1005000",
      detailData: {},
    };
  },
  components: {},
  methods: {
    toSearch() {
      wx.navigateTo({
        url: "/pages/search/main",
      });
    },
    async getListData() {
      const data = await get("/category/indexaction");
      this.listData = data.categoryList;
    },
    async selectItem(id, index) {
      // 获取右边商品的数据
      this.nowIndex = index;
      const data = await get("/category/currentaction", {
        id,
      });
      this.detailData = data.data.currentOne;

    },
    categoryList(id) {
      wx.navigateTo({
        url: '/pages/categorylist/main?id='+ id
      }) 
    }
  },
  mounted() {
    this.getListData();
    this.selectItem(this.id, this.nowIndex);
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
