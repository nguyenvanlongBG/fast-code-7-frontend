<template>
    <div class="combobox">
        <div :class="'selected-box ' + classBorder" ref="inputCombobox">
            <input id="selected-option" :readonly="!isSearch" :tabindex="tabindex" :class="classBorder"
                :placeholder="placeholder != undefined ? placeholder : ''" @keydown.up="handleKeyUp"
                @keydown.down="handleKeyDown" @keydown.enter="handleKeyEnter" @input="handleData" @focus="openDropdown"
                @click="openDropdown" @keydown.tab="closeDropdown" ref="combobox" v-model="valueData" />
            <MIcon @click="changeStatusDropdown">
                <template v-slot:icon>
                    <i class="fa-solid fa-angle-down"></i>
                </template>
            </MIcon>
            <div class="info-error" v-if="descriptionError != null">
                <span class="detail-info-error">{{ descriptionError }}</span>
            </div>
        </div>
        <ul class="select-item-combobox" ref="dropdown" v-show="displaySelectsDropdown">
            <li :ref="'item' + index" :class="getClassRowSelect(select, index)"
                :style="{ paddingLeft: getPaddingLeft(select) }" v-for="(select, index) in listSelect" :key="index"
                @click="selectOption(select)">
                {{ select[dataKey] }}
            </li>
        </ul>
    </div>
</template>
<script>
import MIcon from "./MIcon";
export default {
    name: "MInsertSelect",
    components: {
        MIcon,
    },
    props: {
        // Danh sách option
        selects: {
            type: Array,
            required: true,
            immediate: true,
        },
        // Có phân cấp cha, con hay không 1: có, 0: là không
        type: {
            type: Int32Array,
            required: false,
            default: 2,
        },
        // Placeholder input
        placeholder: {
            type: String,
            required: false,
        },
        // Tabindex
        tabindex: {
            type: String,
            required: false,
        },
        // Vị trí data bên trái, giữa hay phải
        isLeft: {
            type: Int32Array,
            required: false,
        },
        // Tên key của trường id
        idKey: {
            type: String,
            required: false,
            default: "id",
        },
        // Tên key của data
        dataKey: {
            type: String,
            required: false,
            default: "value",
        },
        // Mô tả lỗi
        descriptionError: {
            type: String,
            required: false,
            default: null,
            immediate: true,
        },
        // Có cho phép tìm kiếm hay không
        isSearch: {
            type: Boolean,
            required: false,
            default: false,
        },
        // Hàm custom lại border, trả về class mà muốn css cho border
        checkBorder: {
            type: Function,
            required: false,
            default: () => {
                return "border-input-grey";
            },
        },
        // Dữ liệu đã chọn
        selected: {
            type: Object,
            required: false,
            default: null,
            immediate: true,
        },
    },
    emits: [
        // Cập nhật dữ liệu lên vào model của cha truyền vào
        "update:selected",
    ],
    computed: {},
    watch: {
        /**
         * Theo dõi nếu selects thay đổi thì gán lại danh sách option
         * Author: nguyenvanlongBG (5/6/2023)
         */
        selects() {
            if (this.selected == null) {
                this.listSelect = [...this.selects];
            } else {
                if (this.isSearch) {
                    this.listSelect = this.selects.filter((select) => {
                        return select[this.dataKey].includes(this.selected[this.dataKey]);
                    });
                } else {
                    this.listSelect = [...this.selects];
                }
            }
            this.setValueData();
        },
        /**
         * Nếu value thay đổi thì gán lại valueData đồng thời thiết lập lại indexSelected và indexMove
         * Author: nguyenvanlongBG (5/6/2023)
         */
        selected() {
            if (this.isSearch) {
                if (this.selected == null) {
                    this.listSelect = [...this.selects];
                } else {
                    this.listSelect = this.selects.filter((select) => {
                        return select[this.dataKey].includes(this.selected[this.dataKey]);
                    });
                }
            } else {
                this.listSelect = [...this.selects];
            }
            this.setValueData();
            this.classBorder = this.checkBorder(
                this.selected,
                this.valueData,
                this.isFocus,
                this.isFirst
            );
        },
        /**
         * Nếu valueData thay đổi thì thiết lập lại danh sách option
         * Author: nguyenvanlongBG (5/6/2023)
         * Modified: nguyenvanlongBG (11/6/2023)
         */
        valueData() {
            if (this.isSearch) {
                this.listSelect = this.selects.filter((select) => {
                    return select[this.dataKey].includes(this.valueData);
                });
            } else {
                this.listSelect = [...this.selects];
            }
            if (this.valueData == "") {
                if (this.isFirst) {
                    this.isFirst = false;
                }
            }
            this.classBorder = this.checkBorder(
                this.selected,
                this.valueData,
                this.isFocus,
                this.isFirst
            );
        },
    },
    data() {
        return {
            classBorder: "border-input-grey",
            isFocus: false,
            listSelect: [],
            indexSelected: null,
            indexMove: null,
            isFirst: true,
            valueData: "",
            displaySelectsDropdown: false,
        };
    },
    /**
     * Gán danh sách option trong component bằng prop truyền vào và gán mô tả lỗi nếu có.
     * Author: nguyenvanlongBG (5/6/2023)
     */
    created() {
        if (this.selected == null) {
            this.listSelect = [...this.selects];
        } else {
            if (this.isSearch) {
                this.listSelect = this.selects.filter((select) => {
                    return select[this.dataKey].includes(this.selected[this.dataKey]);
                });
            }
        }
        this.setValueData();
    },
    /**
     * Gỡ bỏ event listener khi component bị hủy
     * Author: nguyenvanlongBG (5/6/2023)
     */
    beforeUnmount() {
        document.removeEventListener("click", this.closeSelectBox);
    },
    mounted() {
        document.addEventListener("click", this.closeSelectBox);
    },
    /**
     * Khi update component thì tính toán lại vị trí đặt ul
     * Author: nguyenvanlongBG (5/6/2023)
     */
    updated() {
        this.calculateDropdownPosition();
    },
    methods: {
        getClassRowSelect(select, index) {
            let classCss = "";
            if (this.isLeft == 1) {
                classCss += "data-left";
            } else {
                if (this.isLeft == 0) {
                    classCss += "data-center";
                } else {
                    classCss += "data-right";
                }
            }
            if (this.selected != null) {
                if (select[this.idKey] == this.selected[this.idKey]) {
                    classCss += " --selected";
                }
            }
            if (this.indexMove == index) {
                classCss += " --move-select";
            }
            return classCss;
        },
        /**
         * Nhập giá trị
         * Author: nguyenvanlongBG ( 6/6/2023)
         */
        handleData(event) {
            console.log(event);
            this.isFocus = true;
        },
        /**
         * Thiết lập giá trị cho valueData
         * Author: nguyenvanlongBG (4/6/2023)
         * Modified: nguyenvanlongBG ( 11/6/2023)
         */
        setValueData() {
            this.indexSelected = 0;
            this.indexMove = -1;
            if (this.selected != null) {
                this.valueData = this.selected[this.dataKey];
            }
        },
        /**
         * Thêm khoảng trống cho các grade
         * Created By: nguyenvanlongBG (3/7/2023)
         **/
        getPaddingLeft(item) {
            if (this.type == 1) {
                return `${(item?.grade - 1) * 10 + 15}px`;
            } else {
                return "";
            }
        },
        /**
         * Tính px để đặt vị trí select box
         * Author: nguyenvanlongBG (31/5/2023)
         */
        calculateDropdownPosition() {
            if (this.displaySelectsDropdown) {
                const comboboxElement = this.$refs.combobox;
                const dropdownElement = this.$refs.dropdown;

                const comboboxRect = comboboxElement.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (comboboxRect.top > windowHeight / 2) {
                    // Hiển thị phía trên combobox
                    dropdownElement.style.bottom = "100%";
                } else {
                    // Hiển thị phía dưới combobox
                    dropdownElement.style.top = "100%";
                }
            }
        },
        /**
         * Focus vào input
         * Author: nguyenvanlongBG (30/5/2023)
         **/
        focusInput() {
            this.openDropdown();
        },
        /**
         * Không focus vào input
         * Author: nguyenvanlongBG (30/5/2023)
         **/
        notFocusInput() {
            this.displaySelectsDropdown = false;
            this.isFirst = false;
        },
        /**
         * Sự kiện người dùng nhấn phím xuống
         * Author: nguyenvanlongBG (30/5/2023)
         * Modified By: nguyenvanlongBG (3/7/2023)
         * @param {*} event
         */
        handleKeyDown(event) {
            event.stopPropagation();
            if (this.indexMove < this.listSelect.length - 1) {
                this.indexMove += 1;
                this.scrollToItem(this.indexMove);
            } else {
                this.indexMove = 0;
                this.scrollToItem(this.indexMove);
            }
        },
        /**
         * Sự kiện người dùng nhấn phím lên
         * Author: nguyenvanlongBG (30/5/2023)
         * Modified By: nguyenvanlongBG (3/7/2023)
         * @param {*} event
         */
        handleKeyUp(event) {
            event.stopPropagation();
            if (this.indexMove > 0) {
                this.indexMove -= 1;
                this.scrollToItem(this.indexMove);
            } else {
                this.indexMove = this.listSelect.length - 1;
                this.scrollToItem(this.indexMove);
            }
        },
        /**
         * Sự kiện người dùng nhấn enter
         * Author: nguyenvanlongBG (30/5/2023)
         * @param {*} event
         */
        handleKeyEnter() {
            if (this.displaySelectsDropdown) {
                this.$emit("update:selected", this.listSelect[this.indexMove]);
                this.displaySelectsDropdown = false;
                this.isFirst = false;
            } else {
                this.displaySelectsDropdown = true;
            }
        },
        /**
         * Click ra ngoài nếu giá trị bằng rỗng thì update lên cha bằng '' để chuyển màu border
         * Author: nguyenvanlongBG (30/5/2023)
         */
        blurSelect() {
            this.classBorder = this.checkBorder(
                this.selected,
                this.valueData,
                false,
                this.isFirst
            );
        },
        /**
         * Mở bảng chọn bằng cách thay đổi trạng thái displaySelectsDropdown
         * Author: nguyenvanlongBG (30/5/2023)
         */
        openDropdown() {
            if (!this.isSearch) {
                this.classBorder = "border-input-green";
            } else {
                this.classBorder = this.checkBorder(
                    this.selected,
                    this.valueData,
                    true,
                    this.isFirst
                );
            }
            if (!this.displaySelectsDropdown) {
                this.displaySelectsDropdown = true;
                this.isFocus = true;
            }
        },
        /**
         * Thay đổi trạng thái dropdown
         * Author: nguyenvanlongBG ( 29/6/2023)
         */
        changeStatusDropdown() {
            if (!this.displaySelectsDropdown) {
                this.openDropdown();
                this.$refs.combobox.focus();
            } else {
                this.closeDropdown();
            }
        },
        /**
         * Đóng dropdown
         * Author: nguyenvanlongBg (8/6/2023)
         */
        closeDropdown() {
            this.$emit("update:selected", this.selected);
            this.classBorder = this.checkBorder(
                this.selected,
                this.valueData,
                false,
                this.isFirst
            );
            this.displaySelectsDropdown = false;
            this.isFirst = false;
            this.indexMove = -1;
        },
        /**
         * Khi click vào 1 select thì emit lên component cha có thể render lại data
         * Author: nguyenvanlongBG (30/5/2023)
         * @param {*} value giá trị chọn
         */
        selectOption(select) {
            this.$emit("update:selected", select);
            this.indexSelected = 0;
            this.indexMove = -1;
            this.selectedValue = select;
            this.valueData = select[this.dataKey];
            this.displaySelectsDropdown = false;
            this.isFirst = false;
        },
        /**
         * Đóng bảng chọn nếu click ra bên ngoài
         * Author: nguyenvanlongBG (30/5/2023)
         * @param {*} event event
         */
        closeSelectBox(event) {
            // Kiểm tra xem sự kiện click có diễn ra trong component hay không
            if (!this.$el.contains(event.target)) {
                // Xử lý khi click ra ngoài component
                if (this.displaySelectsDropdown) {
                    this.isFirst = false;
                    this.updateDataComponentParent();
                }
            }
        },
        /**
         * Update data emit component cha
         * Author: nguyenvanlongBG ( 11/6/2023)
         */
        updateDataComponentParent() {
            let select = null;
            if (this.selected != null) {
                if (this.valueData == this.selected[this.dataKey]) {
                    select = this.selected;
                }
            }
            this.$emit("update:selected", select);
            if (this.isFocus) {
                this.classBorder = this.checkBorder(
                    this.selected,
                    this.valueData,
                    false,
                    this.isFirst
                );
            }
            this.displaySelectsDropdown = false;
            this.isFocus = false;
        },
        /**
         * Scroll đến vị trí cho trước
         * Author: nguyenvanlongBG (30/5/2023)
         */
        scrollToItem(indexScroll) {
            const listItem = this.$refs["item" + indexScroll];
            if (listItem) {
                setTimeout(() => {
                    listItem[0].scrollIntoView();
                }, 100);
            }
        },
    },
};
</script>
<style scoped>
.combobox {
    position: relative;
    box-sizing: border-box;
    min-width: 40px;
    background-color: white;
    height: 36px;
    width: 100%;
}

.combobox .selected-box {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
}

.selected-box:hover {
    border: 1px solid #190472;
}

.selected-box:focus-within {
    border: 1px solid #190472;
}

.selected-box input {
    padding: 0px;
    border: none;
    box-sizing: border-box;
    outline: none;
    border-radius: 4px;
    padding-left: 12px;
    flex: 1;
    height: 100%;
    width: 36px;
}

.selected-box input:focus {
    border-color: #190472;
    outline: none;
}

.selected-box input:focus-visible {
    outline: none;
}

.selected-box input::placeholder {
    color: #999999;
}

.box-icon-dropdown {
    padding-left: 2px;
    padding-right: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon-dropdown {}

.combobox .select-item-combobox {
    display: flex;
    flex-direction: column;
    list-style: none;
    width: 100%;
    margin-left: 0px;
    padding-left: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    position: absolute;
    background-color: white;
    border: 1px solid #eeeeee;
    max-height: 216px;
    overflow-y: auto;
    z-index: 10;
}

.select-item-combobox li {
    width: 100%;
    min-height: 36px;
    max-height: 36px;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
}

.select-item-combobox li:hover {
    background-color: #dee1f9;
}

.--move-select {
    background-color: #dee1f9;
}

.--selected {
    background-color: #dee1f9;
}

.select-item-combobox .data-left {
    padding-left: 12px;
    justify-content: flex-start;
}

.select-item-combobox .data-center {
    padding-left: 12px;
    justify-content: center;
}
.select-item-combobox .data-right {
    padding-right: 12px;
    justify-content: flex-end;
}
.border-input-grey {
    border-color: #e6e6e6 !important;
}

.border-input-red {
    border-color: red !important;
}

.border-input-green {
    border-color: #190472 !important;
}

.selected-box:hover .info-error {
    visibility: visible;
}

.info-error {
    position: absolute;
    top: 24px;
    display: flex;
    color: white;
    width: 100%;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    z-index: 11;
}

.detail-info-error {
    background-color: #222;
    color: white;
    display: flex;
    align-items: center;
    min-height: 24px;
    padding-left: 4px;
    padding-right: 4px;
}
</style>
