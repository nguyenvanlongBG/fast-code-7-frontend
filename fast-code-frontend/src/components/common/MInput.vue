<template>
    <div style="position: relative" class="box-input">
        <input type="text" :class="classBorder +
            ' ' +
            'minput__input ' +
            widthClass +
            (type == 'number' ? ' position--right' : '')
            " :tabindex="tabindex" :placeholder="placeholder != undefined ? placeholder : ''" :value="formatData(valueData)"
            ref="input" @input="handleData" @blur="blurInput" />
        <div class="info-error" v-if="infoError != null">
            <span class="detail-info-error">{{
                infoError != undefined ? infoError : ""
            }}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: "MInput",
    props: {
        // Kiểu input mặc định là text
        type: {
            type: String,
            required: false,
            default: "text",
        },
        // Tabindex
        tabindex: {
            type: Int32Array,
            required: false,
            default: null,
        },
        // Placeholder
        placeholder: {
            type: String,
            required: false,
        },
        // Sự kiện blur
        blur: {
            type: Function,
            required: false,
        },
        // Hàm này có thể truyền qua prop để cha custom lại màu border, không sẽ mặc định là class border-input-grey
        checkBorder: {
            type: Function,
            required: false,
            default: () => {
                return "border-input-grey";
            },
        },
        // Chiều rộng input
        widthClass: {
            type: String,
            required: false,
            default: "width-input-flex-1",
        },
        // Thông tin lỗi
        infoError: {
            type: String,
            required: false,
            default: null,
        },
        // Giá trị truyền vào
        value: {
            type: String,
            required: true,
        },
    },
    watch: {
        isFocus() {
            if (!this.isFocus) {
                this.classBorder = this.checkBorder(this.value, this.isFocus);
            }
        },
        valueData() {
            if (this.isFocus && this.positionPointer != null) {
                this.$nextTick(() => {
                    this.$refs.input.setSelectionRange(
                        this.positionPointer,
                        this.positionPointer
                    );
                });
            }
        },
        value() {
            this.valueData = this.formatData(this.value);
        },
    },
    data() {
        return {
            isChange: false,
            isFocus: false,
            classBorder: "border-input-grey",
            valueData: "",
            positionPointer: null,
            movePointer: 0,
        };
    },
    created() {
        this.valueData = this.formatData(this.value);
    },
    methods: {
        /**
         * Khi nhập dữ liệu thì kích hoạt hàm
         * Author: nguyenvanlongBG (13/6/2023)
         * @param {*} event Tham số sự kiện nhập vào
         */
        handleData(event) {
            this.isChange = true;
            this.valueData = event.target.value;
            if (this.type == "number") {
                let value = event.target.value + "";
                let strPointer = value.substring(0, event.target.selectionStart);
                let numberAfterFormat = this.formatData(strPointer);
                this.positionPointer = numberAfterFormat.length;
            }
            this.isFocus = true;
            this.classBorder = this.checkBorder(event.target.value, this.isFocus);
            if (this.type == "number") {
                let inputValue = (event.target.value + "").replace(/\D/g, "");
                this.$emit("update:value", inputValue);
            } else {
                this.$emit("update:value", event.target.value);
            }
        },
        /**
         * Format Data
         * Author: nguyenvanlongBG (23/6/2023)
         */
        formatData(value) {
            if (this.type == "number") {
                //let inputValue = (value + "").replace(/\D/g, "");
                // inputValue = Number(inputValue).toLocaleString();
                // return inputValue;
                const strNumber = (value + "").replace(/\D/g, "");
                const length = strNumber.length;

                // Tính toán số lượng dấu chấm cần chèn
                const dotCount = Math.floor((length - 1) / 3);

                // Xác định vị trí bắt đầu của dấu chấm
                const dotStartIndex = length - dotCount * 3;

                // Chèn dấu chấm vào chuỗi số
                let formattedNumber = strNumber.slice(0, dotStartIndex);
                for (let i = dotStartIndex; i < length; i += 3) {
                    formattedNumber += "." + strNumber.slice(i, i + 3);
                }

                return formattedNumber;
            }
            return value;
        },
        /**
         * Focus vào input
         * Author: nguyenvanlongBG ( 14/6/2023)
         */
        moveFocusInput() {
            this.isFocus = true;
            this.$refs.input.focus();
        },
        /**
         * Blur input
         * Author: nguyenvanlongBG ( 13/6/2023)
         */
        blurInput() {
            this.classBorder = this.checkBorder(this.value, this.isFocus);
            this.isFocus = false;
            this.$emit("blur", this.isChange);
        },
        /**
         * Thiết lập border cho input theo value
         * Author: nguyenvanlongBG ( 13/6/2023)
         */
        setBorder() {
            this.classBorder = this.checkBorder(this.value, this.isFocus);
        },
    },
};
</script>
<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
    /* Firefox */
}

.box-input {
    display: flex;
    width: 100%;
    background-color: inherit;
}

.box-input .minput__input {
    height: 36px;
    padding: 0px 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    background-color: inherit;
}

.position--right {
    text-align: right;
}

.border-input-grey {
    border-color: #e6e6e6;
}

.border-input-red {
    border-color: red !important;
}

.border-input-green {
    border-color: #190472 !important;
}

input::placeholder {
    color: #999999;
}

input:hover {
    background-color: #e6e6e6;
    cursor: pointer;
}

input:focus {
    border-color: #190472;
    outline: none;
}

.width-input-150px {
    width: 150px;
}

.width-input-175px {
    width: 175px;
}

.width-input-200px {
    width: 200px;
}

.width-input-225px {
    width: 225px;
}

.width-input-250px {
    width: 250px;
}

.width-input-300px {
    width: 300px;
}

.width-input-200px {
    width: 200px;
}

.width-input-flex-1 {
    flex: 1;
}

.info-error {
    position: absolute;
    display: none;
}

.border-input-red:hover~.info-error {
    display: flex;
    color: white;
    width: 100%;
    justify-content: center;
    position: absolute;
    top: 24px;
}

.detail-info-error {
    background-color: #222;
    color: white;
    min-height: 24px;
    display: flex;
    align-items: center;
    padding-left: 4px;
    padding-right: 4px;
}

.tooltip {
    position: absolute;
    top: 12px;
    left: 12px;
    visibility: hidden;
}

label:hover~.tooltip {
    position: absolute;
    top: 36px;
    left: 0px;
    visibility: visible;
    background-color: #222;
    color: white;
    z-index: 10;
}
</style>
