<template>
  <div class="container-example">
    <div class="list-button">
      <MButton text="Button1"></MButton>
      <MButton text="Button2" icon="fa-solid fa-house"></MButton>
      <MButton
        text="Button3"
        icon="fa-solid fa-house"
        positionIcon="true"
      ></MButton>
      <MButton
        text="Button4"
        icon="fa-solid fa-house"
        bgColor="white"
        color="blue"
      ></MButton>
      <MButton
        text="Button5"
        icon="fa-solid fa-house"
        bgColor="white"
        color="#2B3173"
        bgColorHover="#2B3173"
        colorHover="white"
      ></MButton>
      <MButton
        text="Button6"
        icon="fa-solid fa-house"
        bgColor="white"
        color="#2B3173"
        bgColorHover="white"
        borderHover="1px solid #2B3173"
      ></MButton>
      <MButton
        text="Button7"
        bgColor="white"
        color="#2B3173"
        bgColorHover="white"
        borderHover="1px solid #2B3173"
        isLoading="true"
      >
      </MButton>
      <MButton
        text="Button8"
        icon="fa-solid fa-house"
        bgColor="white"
        color="#2B3173"
        bgColorHover="white"
        borderHover="1px solid #2B3173"
      >
        <template v-slot:icon>
          <i class="fa-solid fa-arrow-left icon-red--left"></i>
        </template>
      </MButton>
      <MButton
        text="Button8"
        positionIcon="true"
        icon="fa-solid fa-house"
        bgColor="white"
        color="#2B3173"
        bgColorHover="white"
        borderHover="1px solid #2B3173"
      >
        <template v-slot:icon>
          <i class="fa-solid fa-arrow-right icon-red--right"></i>
        </template>
      </MButton>
    </div>
    <div class="list-input">
      <div class="width--300px">
        <MInput v-model:value="merchandise" tabindex="4" />
      </div>
      <div class="left">Input định dạng kiểu số</div>
      <div class="width--300px">
        <MInput v-model:value="money" tabindex="4" type="number" />
      </div>
      <div class="left">Custom lại màu border</div>
      <div class="width--300px">
        <MInput
          :checkBorder="checkBorderInputID"
          v-model:value="money"
          tabindex="4"
          type="number"
        />
      </div>
    </div>
    <div class="list-combobox">
      <div>
        <div class="left">Combobox cho phép tìm kiếm</div>
        <div class="width--300px">
          <MCombobox
            :selects="displays"
            v-model:selected="displaySelected"
            isLeft="1"
          ></MCombobox>
        </div>
      </div>
      <div>
        <div class="left">Combobox cho phép tìm kiếm</div>
        <div class="width--300px">
          <MCombobox
            :selects="displays"
            v-model:selected="displaySelected"
            isLeft="2"
            isSearch="true"
          ></MCombobox>
        </div>
      </div>
    </div>
    <div class="input-radio">
      <MInputRadio
        :choices="[
          { label: 'Đang kinh doanh', value: 1 },
          { label: 'Ngừng kinh doanh', value: 0 },
        ]"
        ref="inputStatus"
        tabindex="1"
        name="status"
        v-model:value="status"
      />
    </div>
    <div class="list-icon">
      <MIcon type="1">
        <template v-slot:icon>
          <i class="fa-solid fa-arrow-right icon-red--right"></i>
        </template>
      </MIcon>
    </div>
  </div>
</template>
<script>
import MButton from "../components/common/MButton";
import MInput from "../components/common/MInput";
import MCombobox from "../components/common/MCombobox";
import MInputRadio from "../components/common/MInputRadio";
import MIcon from "../components/common/MIcon";

export default {
  name: "MerchandiseView",
  components: {
    MButton,
    MInput,
    MCombobox,
    MInputRadio,
    MIcon,
  },
  data() {
    return {
      merchandise: "Hello ",
      money: 123456789,
      displays: [
        { id: 2, value: "Tất cả" },
        { id: 1, value: "Có" },
        { id: 0, value: "Không" },
      ],
      displaySelected: { id: 1, value: "Có" },
      status: 1,
    };
  },
  methods: {
    // Custom lại màu sắc border input
    checkBorderInputID(value, isFocus = true) {
      // Tự custom lại isFocus là trạng thái input có đang focus hay không
      let borderRed = "border-input-red";
      let borderGreen = "border-input-green";
      let borderGrey = "border-input-grey";
      if (isFocus == 0) {
        return borderRed;
      } else {
        if (value != "") {
          return borderGreen;
        }
      }
      return borderGrey;
    },
  },
};
</script>
<style>
.container-example {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  justify-content: center;
}
.list-button {
  display: flex;
  column-gap: 10px;
  justify-content: center;
}
.icon-red--left {
  padding-right: 5px;
  color: red;
}
.icon-red--right {
  padding-left: 5px;
  color: red;
}
.width--300px {
  width: 300px;
}
.list-input {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.list-combobox {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.left {
  display: flex;
  justify-content: flex-start;
  padding-top: 12px;
  padding-bottom: 12px;
}
.input-radio {
  display: flex;
  justify-content: center;
}
.list-icon {
  display: flex;
  justify-content: center;
}
</style>
