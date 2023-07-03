<template>
    <div class="sidebar">
        <div class="header-sidebar">
            <a href="/">
                Hello
            </a>
        </div>
        <div class="body-sidebar">
            <div class="item-sidebar" :class="getClasses('Merchandise')">
                <MIcon>
                    <template v-slot:icon>
                        <div class="icon-merchandise"></div>
                    </template>
                </MIcon>
                <div class="title-item-sidebar">Hàng hóa</div>
            </div>
        </div>
    </div>
</template>
<script>
import MIcon from "../components/common/MIcon";
export default {
    name: "TheSideBar",
    components: {
        MIcon,
    },
    methods: {
        getClasses(routerName) {
            if (routerName == this.$route.name) {
                return "item-sidebar--selected";
            } else {
                return "";
            }
        },
    },
};
</script>
<style scoped>
.sidebar {
    width: 200px;
    display: flex;
    flex-direction: column;
}

.header-sidebar {
    background-color: #1e235a;
}

.img-logo-full {
    height: 54px;
}

.body-sidebar {
    background-color: #2b3173;
    color: #9e9e9e;
    display: flex;
    justify-content: center;
    flex: 1;
}

.item-sidebar {
    display: flex;
    color: #aaacc7;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 44px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 12px;
    column-gap: 12px;
    box-sizing: border-box;
    cursor: pointer;
    background-color: #2b3173;
}

.item-sidebar:hover {
    background-color: #1e235a;
}

.item-sidebar--selected {
    background-color: #1e235a;
}

</style>
