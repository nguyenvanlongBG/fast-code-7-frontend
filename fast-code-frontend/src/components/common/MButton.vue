<template>
  <div
    class="button"
    :style="getStyle"
    @click="onClick"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
    :tabindex="tabindex"
  >
    <div v-if="isDisabled" class="button--disabled"></div>
    <slot name="icon" v-if="!positionIcon"></slot>
    <div class="button__icon">
      <div
        class="box-icon--left"
        v-if="icon != '' && !isLoading && !positionIcon"
      >
        <i :class="icon + ' icon--left'"></i>
      </div>
      <div v-if="isLoading && !positionIcon" class="button__loading--left">
        <i class="fa-solid fa-spinner icon-loading"></i>
      </div>
    </div>
    <slot name="content"></slot>
    <div class="button__text">{{ text }}</div>
    <div class="button__icon">
      <div
        class="box-icon--right"
        v-if="icon != '' && !isLoading && positionIcon"
      >
        <i :class="icon + ' icon'"></i>
      </div>
      <div v-if="isLoading && positionIcon" class="button__loading--right">
        <i class="fa-solid fa-spinner"></i>
      </div>
    </div>
    <slot name="icon" v-if="positionIcon"></slot>
  </div>
</template>
<script>
export default {
  name: "MButton",
  props: {
    // Các trường có requied bằng false nếu không truyền vào thì sẽ được mặc định sử dụng hàm getStyle ở phần method

    // Vị trí icon bên trái hay phải phần chữ, false: bên trái, true: bên phải
    positionIcon: {
      type: Boolean,
      required: false,
      default: false,
    },
    width: {
      type: String,
      required: false,
      default: "fit-content",
    },
    // clas icon VD: fa-solid fa-wreath-laurel
    icon: {
      type: String,
      required: false,
      default: "",
    },
    // Chiều cao button
    height: {
      type: String,
      required: false,
      default: "36px",
    },
    // Chữ trong button
    text: {
      type: String,
      required: true,
    },
    // Trạng thái button disabled hay không
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    // border-radius:
    round: {
      type: String,
      required: false,
      default: "4px",
    },
    // Có ở trạng thái loading hay không
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    // Backgound color cho button
    bgColor: {
      type: String,
      required: false,
      default: "#2B3173",
    },
    // Border button
    border: {
      type: String,
      required: false,
      default: "1px solid #e6e6e6",
    },
    // Màu font của button
    color: {
      type: String,
      required: false,
      default: "#FFFFFF",
    },
    // Backgound khi hover vào mặc định sẽ là opacity 0.5
    bgColorHover: {
      type: String,
      required: false,
      default: "",
    },
    // border button khi hover vào
    borderHover: {
      type: String,
      required: false,
      default: "",
    },
    // Màu font khi hover vào
    colorHover: {
      type: String,
      required: false,
      default: "",
    },
    // Tabindex button
    tabindex: {
      type: Int32Array,
      required: false,
      default: 0,
    },
  },
  emits: ["click"],
  data() {
    return {
      classCSS: "",
      isHovered: false,
    };
  },
  computed: {
    /**
     * Lấy style cần thiết cho button
     * Created By: nguyenvanlongBG (30/6/2023)
     */
    getStyle() {
      let style = {};
      if (this.round != "") {
        style["border-radius"] = this.round;
      }
      if (this.isHovered) {
        if (this.bgColorHover != "") {
          style["background-color"] = this.bgColorHover;
        } else {
          style["background-color"] = this.bgColor;
          style["opacity"] = 0.5;
        }
        if (this.borderHover != "") {
          style["border"] = this.borderHover;
        } else {
          style["border"] = this.border;
        }
        if (this.colorHover != "") {
          style["color"] = this.colorHover;
        } else {
          style["color"] = this.color;
        }
      } else {
        if (this.bgColor != "") {
          style["background-color"] = this.bgColor;
        }
        if (this.border != "") {
          style["border"] = this.border;
        }
        if (this.color != "") {
          style["color"] = this.color;
        }
      }
      if (this.width != "") {
        style["width"] = this.width;
      }
      if (this.height != "") {
        style["height"] = this.height;
      }
      if (!this.isDisabled && !this.isLoading) {
        style["cursor"] = "pointer";
      }
      return style;
    },
  },
  mounted() {},
  methods: {
    /**
     * Bắt sự kiện click vào thì emit component cha
     * Author:  nguyenvanlongBG ( 13/6/2023)
     */
    onClick() {
      this.$emit("click", true);
    },
    /**
     * Thay đổi trạng thái hover
     * Created By: nguyenvanlongBG ( 30/6/2023)
     */
    handleMouseOver() {
      this.isHovered = true;
    },
    /**
     * Thay đổi trạng thái hover
     * Created By: nguyenvanlongBG ( 30/6/2023)
     */
    handleMouseOut() {
      this.isHovered = false;
    },
  },
};
</script>
<style scoped>
.button {
  height: 36px;
  min-width: 80px;
  padding-left: 12px;
  padding-right: 12px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  box-sizing: border-box;
}

.button__icon .box-icon--left {
  padding-right: 5px;
  box-sizing: border-box;
}

.button__icon .box-icon--right {
  padding-left: 5px;
  box-sizing: border-box;
}

.button__icon .box-icon .icon {
  font-size: 14px;
  box-sizing: border-box;
}
.button__loading--left {
  padding-right: 5px;
}
.button__loading--right {
  padding-left: 5px;
}
.button__loading--left .icon-loading {
  animation: circle 2s linear infinite;
}
.button__loading--right .icon-loading {
  animation: circle 2s linear infinite;
}

@keyframes circle {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
