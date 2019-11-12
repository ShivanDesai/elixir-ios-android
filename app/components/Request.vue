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
            <Label class="action-bar-title" text="Browse"></Label>
        </ActionBar>

        <GridLayout rows="auto,auto,auto,auto,auto,auto" class="section">
            <Label :text="'Blood group requested: ' + oneRequest.blood_group" row="0" class="label"/>
            <Label :text="'Location: ' + oneRequest.location" row="1" class="label"/>
            <Label :text="'Requested Date: ' + oneRequest.requested_date" row="2" class="label" textWrap="true"/>
            <Label :text="'Requested Quantity: ' + oneRequest.blood_quantity" row="3" class="label"/>
            <Label :text="'Fulfilled Quantity: ' + oneRequest.fulfilled_quantity" row="4" class="label"/>
            <Label :text="'Status: ' + oneRequest.status" row="5" class="label"/>
        </GridLayout>

    </Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";

    export default {
        props: ['oneRequest'],
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Browse");
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
    .label{
	margin: 50px;
	text-align: center;
	font-weight: bold;
}

    .section{
	margin: 50px;
background-color: #f87979;
height: 1100px;
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