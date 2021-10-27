<template>
  <div class="address">
    <div class="item">
      <scroll-view scroll-y="true" class="addcont" style="height: 100%">
        <div class="item" v-if="listData.length !== 0">
          <div class="list" v-for="(item, index) in listData" :key="index">
            <div class="addresslist">
              <div>
                <span>{{ item.name }}</span>
                <div class="moren" v-if="item.is_default">默认</div>
              </div>
              <div class="info" @click="selAddress(item.id)">
                <p>{{ item.mobile }}</p>
                <p>{{ item.address + item.address_detail }}</p>
              </div>
              <div @click="toDetail(item.id)"></div>
            </div>
          </div>
        </div>
        <div class="center" v-else>
          <p>收获地址在那里？</p>
        </div>
      </scroll-view>

      <div class="bottom">
        <div @click="wxaddress(1)">+新建地址</div>
        <div @click="wxaddress">一键导入微信地址</div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, getStorageOpenid } from "../../utils";
export default {
  name: "",
  props: {},
  data() {
    return {
      listData: [],
      openId: "",
    };
  },
  components: {},
  onShow() {
    this.openId = getStorageOpenid();
    this.getAddressList();
  },
  methods: {
    toDetail(id) {
      wx.navigateTo({
        url: "/pages/addaddress/main?id=" + id,
      });
    },
    wxaddress(index) {
      if (index === 1) {
        wx.navigateTo({
          url: "/pages/addaddress/main",
        });
      } else {
        wx.chooseAddress({
          success: function (res) {
            console.log(res);
            let data = encodeURIComponent(JSON.stringify(res));
            wx.navigateTo({
              url: "/pages/addaddress/main?res=" + data,
            });
          },
        });
      }
    },
    async getAddressList() {
      let _this = this;
      const data = await get("/address/getListAction", {
        openId: _this.openId,
      });
      console.log(data);
      _this.listData = data.data;
    },
    // 选择地址
    selAddress(id) {
      wx.setStorageSync("addressId", id);
      wx.navigateBack({
        delta: 1,
      });
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
