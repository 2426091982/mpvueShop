<template>
  <div class="addaddress">
    <div class="item">
      <input type="text" placeholder="姓名" v-model="userName" />
    </div>
    <div class="item">
      <input type="text" placeholder="手机号码" v-model="telNumber" />
    </div>
    <div class="item">
      <picker
        mode="region"
        @change="bindRegionChange"
        :value="region"
        :custom-item="customItem"
      >
        <input type="text" placeholder="身份，城市，区县" v-model="address" />
      </picker>
    </div>
    <div class="item">
      <input
        type="text"
        placeholder="详细地址，如楼道，楼盘号等"
        v-model="detailaddress"
      />
    </div>
    <div class="item itemend">
      <checkbox-group @change="checkboxChange">
        <label class="checkbox">
          <checkbox
            class="box"
            value="true"
            :checked="checked"
            color="#b4282d"
          ></checkbox>
          设置为默认地址
        </label>
      </checkbox-group>
      <div @click="wxaddress">一键导入微信</div>
    </div>
    <div class="bottom" @click="saveAddress">保存</div>
  </div>
</template>

<script>
import { get, post, getStorageOpenid } from "../../utils";

export default {
  name: "",
  props: {},
  data() {
    return {
      userName: "",
      telNumber: "",
      address: "",
      region: [],
      customItem: "全部",
      detailaddress: "",
      checked: false,
      openId: "",
      id: "",
      detail: "",
    };
  },
  components: {},
  methods: {
    // 选择默认地址
    checkboxChange(e) {
      this.checked = e.mp.detail.value[0];
    },
    // 一键导入
    wxaddress() {
      wx.chooseAddress({
        success: (result) => {
          this.userName = result.userName;
          this.telNumber = result.telNumber;
          this.address = `${result.provinceName} ${result.cityName} ${result.countyName}`;
          this.detailaddress = result.detailInfo;
        },
        fail: () => {},
        complete: () => {},
      });
    },
    // 地址改变
    bindRegionChange(e) {
      let value = e.mp.detail.value;
      this.address = `${value[0]} ${value[1]} ${value[2]}`;
    },
    //保存地址
    async saveAddress() {
      const data = await post("/address/saveAction", {
        userName: this.userName,
        telNumber: this.telNumber,
        address: this.address,
        detailaddress: this.detailaddress,
        checked: this.checked,
        openId: this.openId,
        addressId: this.id,
      });
      console.log(data);
      if (data.data) {
        wx.showToast({
          title: "添加成功",
          icon: "success",
          duration: 2000,
          mask: true,
          success: (res) => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              });
            }, 2000);
          },
        });
      }
    },
    async getDetail() {
      const data = await get("/address/detailAction", {
        id: this.id,
      });
      let detail = data.data;
      this.userName = detail.name;
      this.telNumber = detail.mobile;
      this.address = detail.address;
      this.detailaddress = detail.address_detail;
      this.checked = detail.is_default === 1 ? true : false;
    },
  },
  mounted() {
    this.openId = getStorageOpenid();
    if (this.$root.$mp.query.res) {
      this.res = JSON.parse(decodeURIComponent(this.$root.$mp.query.res));
      this.userName = this.res.userName;
      this.telNumber = this.res.telNumber;
      this.address = `${this.res.provinceName} ${this.res.cityName} ${this.res.countyName}`;
      this.detailaddress = this.res.detailInfo;
    }
    if (this.$root.$mp.query.id) {
      this.id = this.$root.$mp.query.id;
      console.log(this.id);

      this.getDetail();
    }
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
