<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <!-- 
            Use the NavigationButton as a side-drawer button in Android
            because ActionItems are shown on the right side of the ActionBar
            -->
            <NavigationButton ios:visibility="collapsed" icon="res://menu" @tap="onDrawerButtonTap"></NavigationButton>
            <!-- 
            Use the ActionItem for IOS with position set to left. Using the
            NavigationButton as a side-drawer button in iOS is not possible,
            because its function is to always navigate back in the application.
            -->
            <ActionItem 
                android:visibility="collapsed" 
                @tap="onDrawerButtonTap"
                ios.position="left">
            </ActionItem>
            <Label class="action-bar-title" text="Logout"></Label>
        </ActionBar>

        <GridLayout class="page-content">
            <Label class="page-icon fa" text.decode="&#xf1ea;"></Label>
            <Label class="page-placeholder" :text="message"></Label>
        </GridLayout>

    </Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";
    const appSettings = require("tns-core-modules/application-settings");
    import Home from './Home';

    export default {
        mounted() {
            // SelectedPageService.getInstance().updateSelectedPage("Browse");
            appSettings.remove("token");
            appSettings.setBoolean("loggedin", false);
            // this.$navigateTo(Home);

        },
        computed: {
            message() {
                return "<!-- Page content goes here MOFO!!!!!!!!!!!! -->";
            }
        },
        methods: {
            onDrawerButtonTap() {
                utils.showDrawer();
            }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
</style>