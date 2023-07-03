<template>
    <div class="select-radio-box">
        <div class="box-select" v-for="(choice, index) in choices" :key="index">
            <input :name="name" type="radio" class="radio-input" :id="choice.id" :tabindex="tabindex" :value="choice.value"
                :checked="value == choice.value" ref="input" @input="$emit('update:value', $event.target.value)" />
            <label class="" for="male">{{ choice.label }}</label>
        </div>
    </div>
</template>
<script>
export default {
    name: "MInputRadio",
    // name: Tên input, tabindex: Tabindex input. value: giá trị input, choices: các lựa chọn của input
    props: {
        name: {
            type: String,
            required: true,
        },
        tabindex: {
            type: Int32Array,
            required: false,
            default: 1,
        },
        choices: {
            type: Array,
            required: true,
        },
        value: {
            type: String,
            required: true,
            default: null,
        },
    },
    methods: {
        focusInput() {
            this.$refs.input[0].focus();
        },
    },
};
</script>
<style scoped>
.select-radio-box {
    display: flex;
    column-gap: 8px;
    height: 36px;
}

.box-select {
    display: flex;
    justify-content: center;
    align-items: center;
}

.box-sex label {
    padding-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.radio-input {
    width: 18px;
    height: 18px;
    accent-color: #190472;
}
</style>
