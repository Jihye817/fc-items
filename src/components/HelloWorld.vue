<template>
  <v-container>
    <v-col cols="12" class="ma-0 pa-0">
      <v-row>
        <v-col class="mb-5 pa-0" cols="12">
          <v-row class="ma-0 pa-0">
            <v-col cols="12" class="grey mt-5 pa-3">
              <input
                class="input-box"
                placeholder="검색어를 입력하세요"
                :value="keyword"
                @input="searchKeyword"
              />
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="12" class="ma-0 pa-0">
              <v-row class="blue ma-0 pa-3">
                <v-col cols="6" class="ma-0 pa-0">템 이름</v-col>
                <v-col cols="6" class="ma-0 pa-0">
                  <v-row class="text-center ma-0 pa-0">
                    <v-col cols="3" class="ma-0 pa-0"> NQ </v-col>
                    <v-col cols="3" class="ma-0 pa-0"> HQ </v-col>
                    <v-col cols="3" class="ma-0 pa-0"> 총 </v-col>
                    <v-col cols="3" class="ma-0 pa-0"></v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row
                v-for="(item, i) in pageData"
                :key="i"
                :href="item.amount"
                target="_blank"
                class="align-center ma-0 pa-3"
              >
                <v-col cols="6" class="ma-0 pa-0">
                  {{ item.name }}
                </v-col>
                <v-col cols="6" class="ma-0 pa-0">
                  <v-row class="text-center align-center">
                    <v-col cols="3" class="ma-0 pa-0">
                      {{ item.amount }}
                    </v-col>
                    <v-col cols="3" class="ma-0 pa-0">
                      {{ item.hq_amount }}
                    </v-col>
                    <v-col cols="3" class="ma-0 pa-0">
                      {{ item.hq_amount * 1 + item.amount * 1 }}
                    </v-col>
                    <v-col cols="3" class="ma-0 pa-0">
                      <v-row class="ma-0 pa-0">
                        <v-col cols="5" class="ma-0 pa-0">
                          <v-dialog
                            v-model="dialog_update[i]"
                            persistent
                            max-width="290"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                elevation="0"
                                color="primary"
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="
                                  updateDialog(
                                    item.name,
                                    item.amount,
                                    item.hq_amount
                                  )
                                "
                              >
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <v-form
                                ref="itemUpdateForm"
                                v-model="valid_update"
                              >
                                <v-card-title>
                                  <span class="text-h5">아이템 수정</span>
                                </v-card-title>
                                <v-card-text>
                                  <v-container>
                                    <v-row>
                                      <v-col cols="12">
                                        <v-text-field
                                          v-model="name_update"
                                          label="아이템명"
                                          hint="띄어쓰기도 해서 입력해주세용"
                                          persistent-hint
                                          required
                                          :rules="[
                                            (v) =>
                                              !!v || '아이템명은 필수입니다',
                                          ]"
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-text-field
                                          v-model="amount_update"
                                          label="NQ"
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-text-field
                                          v-model="hq_amount_update"
                                          label="HQ"
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-container>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    color="error"
                                    text
                                    @click="dialogUpdateOff(i)"
                                  >
                                    취소
                                  </v-btn>
                                  <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="updateItem(item.name, i)"
                                  >
                                    저장
                                  </v-btn>
                                </v-card-actions>
                              </v-form>
                            </v-card>
                          </v-dialog>
                        </v-col>
                        <v-col cols="5" class="ma-0 pa-0">
                          <v-dialog
                            v-model="dialog_delete[i]"
                            persistent
                            max-width="290"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                elevation="0"
                                color="primary"
                                icon
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon>mdi-close</v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="text-h5">아이템 삭제</span>
                              </v-card-title>
                              <v-card-text>
                                {{ item.name }}을 삭제하시겠습니까?
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="error"
                                  text
                                  @click="dialogDeleteOff(i)"
                                >
                                  취소
                                </v-btn>
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="deleteItem(item.name, i)"
                                >
                                  확인
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row class="grey justify-end text-right ma-0 pa-2">
                <v-dialog v-model="dialog" persistent max-width="290">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" v-bind="attrs" v-on="on">
                      추가
                    </v-btn>
                  </template>
                  <v-card>
                    <v-form ref="itemForm" v-model="valid">
                      <v-card-title>
                        <span class="text-h5">아이템 추가</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                v-model="name"
                                label="아이템명"
                                hint="띄어쓰기도 해서 입력해주세용"
                                persistent-hint
                                required
                                :rules="[(v) => !!v || '아이템명은 필수입니다']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                v-model="amount"
                                label="NQ"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                v-model="hq_amount"
                                label="HQ"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" text @click="dialog = false">
                          취소
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="addItem">
                          저장
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
              </v-row>
              <v-row class="text-center ma-0 pa-3">
                <v-col cols="12" class="ma-0 pa-0">
                  <v-pagination v-model="currentPage" :length="pages">
                  </v-pagination>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
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
  name: "HelloWorld",

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
