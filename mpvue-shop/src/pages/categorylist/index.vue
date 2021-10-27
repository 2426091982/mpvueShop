<template>
  <div class="categoryList">
    <scroll-view scroll-x="true" class="head" :scroll-left="scrollLeft">
      <div
        v-for="(item, index) in navData"
        :key="index"
        :class="[nowIndex == index ? 'active' : '']"
        @click="changeTab(index, item.id)"
      >
        {{ item.name }}
      </div>
    </scroll-view>
    <div class="info">
      <p>{{ currentNav.name }}</p>
      <p>{{ currentNav.front_desc }}</p>
    </div>
    <div class="list" v-if="goodsList">
      <div
        class="item"
        v-for="(item, index) in goodsList"
        :key="index"
        @click="goodsDetail(item.id)"
      >
        <img :src="item.list_pic_url" alt="" />
        <p class="name">{{ item.name }}</p>
        <p class="price">${{ item.retail_price }}</p>
      </div>
    </div>
    <div class="none" v-else>数据库暂无数据...</div>
  </div>
</template>

<script>
import { get, post, getStorageOpenid } from "../../utils";

export default {
  name: "categorylist",
  props: {},
  data() {
    return {
      scrollLeft: 0,
      openId: "",
      navData: [],
      categoryId: "",
      currentNav: {},
      nowIndex: 0,
      goodsList: [],
    };
  },
  onShow() {
    this.openId = getStorageOpenid();
  },
  components: {},
  methods: {
    async getAllData() {
      const data = await get("/category/categoryNav", {
        id: this.categoryId,
      });
      this.navData = data.navData;
      this.currentNav = data.currentNav;
      for (let i = 0; i < this.navData.length; i++) {
        const id = this.navData[i].id;
        if (id == this.currentNav.id) {
          this.nowIndex = i;
        }
      }

      // 获取商品
      const listData = await get("/goods/goodsList", {
        categoryId: this.categoryId,
      });

      this.goodsList = listData.goodsList;
    },
    async changeTab(index, id) {
      this.nowIndex = index;
      const listData = await get("/goods/goodsList", {
        categoryId: id,
      });
      console.log(listData);
      this.goodsList = listData.goodsList;
      this.currentNav = listData.currentNav;
      // 让导航栏滚动到可见区域
      if (this.nowIndex > 4) {
        this.scrollLeft = this.nowIndex * 60;
      } else {
        this.scrollLeft = 0;
      }
    },
    goodsDetail(id) {
      wx.navigateTo({
        url: "/pages/goods/main?id=" + id,
      });
    },
  },
  mounted() {
    // 获取页面传递的参数
    this.categoryId = this.$root.$mp.query.id;
    console.log(this.categoryId);

    this.getAllData();
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
