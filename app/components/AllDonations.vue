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
            <Label class="action-bar-title" text="Your Donations"></Label>
        </ActionBar>

        <GridLayout>
            <ListView v-show="isDonationsSet" for="item in donations" class="list">
                <v-template>
                    <GridLayout class="listRows" rows="auto,auto,auto" cols="auto,auto">
                        <Label :text="item.donation_address" row="0" class="heading"/>
                        <Label :text="'Donated: ' + item.blood_qty + ' units'" row="1" col="0"/>
                        <Label :text="new Date(item.donation_date.split(' ')[0]).toString()" row="2" col="0" class="date"/>
                    </GridLayout>
                </v-template>
            </ListView>
        </GridLayout>

    </Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";
    import * as http from 'http';
    const appSettings = require("tns-core-modules/application-settings");

    export default {
        data(){
            return{
                isDonationsSet: false,
                donations: []
            }
        },
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Browse");
            console.log("in ALLDONATIONSMOUNTED======+++=++==+==+=+====");
            http.request({
                url: "http://ec2-3-132-175-165.us-east-2.compute.amazonaws.com/donation/user/" + appSettings.getString("token"),
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }).then(response => {
                var result = response.content.toJSON();
                console.log("IN DONATION============setting result======");
                if(result.status){
                    console.log("IN DONATION============setting donation======");
                    this.donations = result.blood_donations;
                    this.isDonationsSet = true;
                }
                else{
                    this.alert("There was a problem retrieving the data");
                }
            }, error => {
                console.error(error);
            });
        },
        computed: {
            message() {
                return "<!-- Page content goes here MOFO!!!!!!!!!!!! -->";
            }
        },
        methods: {
            onDrawerButtonTap() {
                utils.showDrawer();
            },
            alert(message) {
                return alert({
                    title: "ELIXIR",
                    okButtonText: "OK",
                    message: message
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables
    .list{
        background-color: white;
        height: auto;
    }
    .listRows{
        height: 250px;
        color: red;
        // text-align: center;
        margin: 20px;
    }
    .heading{
        font-size: 40em;
    }
    .date{
        // text-align: right;
    }
    // Custom styles
</style>