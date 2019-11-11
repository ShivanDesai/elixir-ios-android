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
            <Label class="action-bar-title" text="Request Blood"></Label>
        </ActionBar>
        <GridLayout rows="auto,auto,auto">
            <GridLayout class="sGroup" rows="auto,auto" row="0">
                <Label class="sLabel" text="Select the blood group below" row="0"/>
                <ListPicker :items="bloodGroupList" v-model="selectedBG" selectedIndex="0" row="1"/>
            </GridLayout>
            <GridLayout class="sGroup" rows="auto,auto" row="1">
                <Label class="sLabel" text="Select the amount below" row="0"/>
                <ListPicker :items="bloodAmount" v-model="selectedAmount" selectedIndex="0" row="1"/>
            </GridLayout>
            <Button class="submitButton" text="Submit Request" @tap="onSubmit" row="2"/>
        </GridLayout>

    </Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";
    import * as http from 'http';
    const appSettings = require("tns-core-modules/application-settings");
    import Home from './Home';

    export default {
        props: ['long', 'lat'],
        data(){
            return{
                bloodGroupList: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
                selectedBG: "",
                bloodAmount: [1,2,3,4,5,6,7,8,9],
                selectedAmount: 0
            }
        },
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("RequestBlood");
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
            onSubmit(){
                // console.log("=======in request==== long: " + this.long);
                http.request({
                    url: "http://ec2-3-132-175-165.us-east-2.compute.amazonaws.com/requests/addRequest",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    content: JSON.stringify({
                        blood_group: this.selectedBG,
                        blood_quantity: this.selectedAmount,
                        location: "San Jose, CA",
                        latitude: this.lat,
                        longitudes: this.long,
                        user_id: appSettings.getString("token")
                    })
                }).then(response => {
                    var result = response.content.toJSON();
                    if(result.status){
                        // appSettings.setString("token", result.token);
                        // this.alert("The request was submitted successfully");
                        this.$navigateTo(Home);
                    }
                    //TODO if successfully logged in, $navigateTo(Home)

                }, error => {
                    console.error(error);
                });
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
    // End custom common variables
    .sGroup{
        margin: 20px;
        color: Black;
        border-radius: 20px;
        background-color: pink;
    }

    .sLabel{
        font-size: 25em;
        text-align: center;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }

    .submitButton{
        background-color: red;
        color: black;
        width: 70%;
        border-radius: 30px;
        margin-top: 50px;
        height: 200px;
        font-size: 20em;
        font-weight: bold;
    }
    // Custom styles
</style>