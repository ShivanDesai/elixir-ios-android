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
            <Label class="action-bar-title" text="Featured"></Label>
        </ActionBar>

        <GridLayout class="page-content" rows="auto,*">
            <SearchBar row="0" hint="Enter where you want the donor to donate" v-model="searchPhrase" @submit="onSubmit" class="search"/>
            <ListView separatorColor="transparent" v-show="locationSet" row="1" for="item in searchResults" @itemTap="onItemTap" class="list">
                <v-template>
                    <GridLayout class="listRows" rows="auto,auto">
                        <Label :text="item.text" row="0" class="heading"/>
                        <Label textWrap="true" :text="item.place_name" row="1" class="address"/>
                    </GridLayout>
                </v-template>
            </ListView>
            <!-- <Label class="page-icon fa" text.decode="&#xf005;"></Label>
            <Label class="page-placeholder" :text="message"></Label> -->
        </GridLayout>
    </Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";
    // import * as Geolocation from 'nativescript-geolocation';
    const Geolocation = require("nativescript-geolocation");
    import * as http from 'http';
    import RequestBlood from './RequestBlood';

    export default {
        data(){
            return{
                searchPhrase: "",
                userLat: null,
                userLong: null,
                searchResults: null,
                locationSet: false
            }
        },
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Featured");
            Geolocation.enableLocationRequest();
            console.log("=====IN GETLOC=====");
            Geolocation.getCurrentLocation({})
            .then(result => {
                console.log('loc result', result);
                // this.needLocation = false;
                this.userLat = result.latitude;
                this.userLong = result.longitude;
                console.log('userlocation is : ', this.userLong);
                this.locationSet = true;
            })
            .catch(e => {
                console.log('loc error', e);
            });
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
            alert(message) {
                return alert({
                    title: "ELIXIR",
                    okButtonText: "OK",
                    message: message
                });
            },
            onItemTap(event){
                console.log(this.searchResults[event.index].center[0]);
                this.$navigateTo(RequestBlood, {
                    props: {
                        long: this.searchResults[event.index].center[0],
                        lat: this.searchResults[event.index].center[1]
                    }
                });
            },
            onSubmit(){
                console.log("in onsubmit: " + this.searchPhrase);
                var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + this.searchPhrase + ".json?proximity=" + this.userLong + "," + this.userLat + "&access_token=pk.eyJ1Ijoic2hpdmFuZGVzYWkiLCJhIjoiY2syaW0xaXllMGcydTNjb2hua3UzbHpyMSJ9.ZHxE6FAsU4GeDvz4WH9AhA";
                console.log('url', url);
                http.request({
                    url: url,
                    method: "GET"
                }).then(response => {
                    var result = response.content.toJSON();
                    console.log(result);
                    if(result.features.length > 0){
                        this.searchResults = result.features;
                    }
                    else{
                        console.log("Couldn't find anything. Try searching for something else...");
                    }
                }, error => {
                    console.error(error);
                });
            }
            // getLoc(){
            //     console.log("=====IN GETLOC=====");
            //     Geolocation.getCurrentLocation({})
            //     .then(result => {
            //         console.log('loc result', result);
            //         // this.needLocation = false;
            //         this.userLocation = result;
            //         this.locationSet = true;
            //     })
            //     .catch(e => {
            //         console.log('loc error', e);
            //     });
            // }
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables
    .listRows{
        padding: 10px;
        width: 90%;
        margin: 30px;
        border-style: solid;
        border-width: 2px;
        border-color: #ea3b3a;
        border-radius: 30px;
    }
    .list{
        background-color: white;
    }
    .search{
        background-color: white;
        color: #ea3b3a;
    }
    .heading{
        font-size: 20em;
        font-weight: bold;
        color: #ea3b3a;
    }
    .address{
        color: black;
    }
    // Custom styles
</style>
