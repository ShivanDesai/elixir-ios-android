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
            <Label class="action-bar-title" text="Settings"></Label>
        </ActionBar>

        <GridLayout class="page-content">
            <ListView for="item in options" @itemTap="onItemTap" class="list" separatorColor="transparent">
                <v-template>
                    <GridLayout class="listItem">
                    <Label :text="item"/>
                    </GridLayout>
                </v-template>
            </ListView>
        </GridLayout>
    </Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";
    import AllDonations from './AllDonations';
    import AllRequests from './AllRequests';

    export default {
        data(){
            return{
                options: ["Your Donations", "Your Requests"]
            }
        },
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Settings");
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
            onItemTap(event){
                if(event.index == 0){
                    this.$navigateTo(AllDonations);
                }
                else if(event.index == 1){
                    this.$navigateTo(AllRequests);
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables
    .listItem{
        padding: 30px;
        width: 90%;
        font-size: 20em;
        margin: 20px;
        color: black;
        text-align: center;
        border-style: solid;
        border-width: 2px;
        border-color: #ea3b3a;
        border-radius: 30px;
        background-color: #f87979;
        font-weight: bold;
        height: 170px;
    }
    .list{
  background-color: white;
  margin-top: 50px;
}
    // Custom styles
</style>