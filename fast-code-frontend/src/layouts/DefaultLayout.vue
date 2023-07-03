<template>
    <div class="container">
        <TheSideBar />
        <div class="main-view">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import TheSideBar from "@/layouts/TheSideBar.vue";

export default {
    name: "DefaultLayout",
    components: {
        TheSideBar,
    },
};
</script>
<style>
.container {
    display: flex;
}

.main-view {
    flex: 1;
    background-color: white;
    height: 100vh;
    overflow-y: hidden;
}

.body-controller {
    height: 100%;
    padding: 8px;
}
</style>
