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
            <Label class="action-bar-title" text="Home"></Label>
        </ActionBar>

        <GridLayout class="page-content">
            <!-- <Label class="page-icon fa" text.decode="&#xf015;"></Label>
            <Label class="page-placeholder" :text="message"></Label> -->
            <Button text="Add a Request" @tap="addRequestTap" class="buttons"/>
        </GridLayout>

    </Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";
    import Featured from './Featured';

    export default {
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Home");
        },
        computed: {
            message() {
                return "<!-- Page content goes here -->";
            }
        },
        methods: {
            onDrawerButtonTap() {
                utils.showDrawer();
            },
            addRequestTap(){
                this.$navigateTo(Featured);
            }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables
.buttons{
        margin: 50px;
        background-color: #f87979;
        height: 170px;
        text-align: center;
        border-style: solid;
        border-width: 2px;
        border-color: #ea3b3a;
        border-radius: 30px;
        color: white;
        font-weight: bold;
        font-size: 20em;
    }
    // Custom styles
</style>