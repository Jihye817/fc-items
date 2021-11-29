<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-col cols="12" class="ma-0 pa-0">
      <v-row class="ma-0 pa-0 grey">test</v-row>
    </v-col>
  </v-container>
</template>

<style>
.input-box {
  width: 100%;
  background-color: white;
  padding: 5px;
  border-radius: 4px;
}
</style>
<script>
export default {
  name: "RidePage",

  data: () => ({
    currentPage: 1,
    pageDataSize: 10,
    keyword: "",
    itemList: [],
    searchList: [],
    testList: [],
    name: "",
    amount: "0",
    hq_amount: "0",
    dialog: false,
    name_update: "",
    amount_update: "",
    hq_amount_update: "",
    dialog_update: [],
    dialog_delete: [],
    valid: true,
    valid_update: true,
  }),
  created() {
    this.getItem();
  },
  computed: {
    startIndex() {
      return (this.currentPage - 1) * this.pageDataSize;
    },
    endIndex() {
      return this.startIndex + this.pageDataSize;
    },
    pages() {
      return Math.ceil(this.searchList.length / this.pageDataSize);
    },
    pageData() {
      this.searchList = this.itemList
        .filter((data) => {
          return data.name.includes(this.keyword);
        })
        .slice(0);

      return this.searchList.slice(this.startIndex, this.endIndex);
    },
  },
  methods: {
    searchKeyword(e) {
      this.keyword = e.target.value;
    },
    addItem() { //아이템 추가
      this.$refs.itemForm.validate(); //null 값 입력 방지
      this.$firebase
        .database()
        .ref("fcItems/")
        .child("itemList")
        .child(this.name)
        .set({
          name: this.name,
          amount: this.amount,
          hq_amount: this.hq_amount,
        });
      this.dialog = false;
      //초기화
      this.name = "";
      this.amount = "0";
      this.hq_amount = "0";
    },
    getItem() { //아이템 목록 조회
      this.$firebase
        .database()
        .ref("fcItems")
        .child("itemList")
        .on("value", (data) => {
          this.itemList = Object.values(data.val()).map((e) => e);
        });
      for (var i = 0; i < this.itemList.length; i++) { //dialog를 위한 배열 만들어주기
        this.dialog_update.push(false);
        this.dialog_delete.push(false);
      }
    },
    updateDialog(name, amount, hq_amount) {
      this.name_update = name;
      this.amount_update = amount;
      this.hq_amount_update = hq_amount;
    },
    updateItem(name, i) {
      this.$firebase
        .database()
        .ref("fcItems/")
        .child("itemList")
        .child(name)
        .remove();
      this.$firebase
        .database()
        .ref("fcItems/")
        .child("itemList")
        .child(this.name_update)
        .set({
          name: this.name_update,
          amount: this.amount_update,
          hq_amount: this.hq_amount_update,
        });
      this.$set(this.dialog_update, i, false);
    },
    dialogUpdateOff(i) {
      this.$set(this.dialog_update, i, false);
    },
    deleteItem(name, i) {
      this.$firebase
        .database()
        .ref("fcItems/")
        .child("itemList")
        .child(name)
        .remove();
      this.$set(this.dialog_delete, i, false);
    },
    dialogDeleteOff(i) {
      this.$set(this.dialog_delete, i, false);
    },
  },
};
</script>
