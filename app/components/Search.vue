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
            <Label class="action-bar-title" text="Search"></Label>
        </ActionBar>

        <GridLayout class="page-content">
            <!-- <Label class="page-icon fa" text.decode="&#xf002;"></Label>
            <Label class="page-placeholder" :text="message"></Label> -->
            <Mapbox v-if="isEventsSet && isRequestsSet"
                    accessToken="pk.eyJ1Ijoic2hpdmFuZGVzYWkiLCJhIjoiY2syaW0xaXllMGcydTNjb2hua3UzbHpyMSJ9.ZHxE6FAsU4GeDvz4WH9AhA"
                    mapStyle="traffic_day"
                    latitude="37.3353"
                    longitude="-121.8811"
                    hideCompass="true"
                    zoomLevel="12"
                    showUserLocation="false"
                    disableZoom="false"
                    disableRotation="false"
                    disableScroll="false"
                    disableTilt="false"
                    @mapReady="onMapReady($event)">
                </Mapbox>
        </GridLayout>
    </Page>
</template>

<script>
    import * as utilsa from "~/shared/utils";
    import * as utils from "utils/utils";
    import SelectedPageService from "../shared/selected-page-service";
    import * as http from 'http';
    const appSettings = require("tns-core-modules/application-settings");

    export default {
        data () {
            return { 
                        allEvents: [],
                        allRequests: [],
                        isEventsSet: false,
                        isRequestsSet: false
                    };
        },
        methods: {
            onDrawerButtonTap() {
                utilsa.showDrawer();
            },
            onMapReady(args) {
                var i;
                for(i = 0; i < this.allEvents.length; i++){
                    console.log(this.allEvents[0].location + "=================="+this.allEvents[1].location+"============================");
                    console.log(this.allEvents[i].location + "========================"+this.allEvents[i].event_name+"======================");
                    var loc = this.allEvents[i].location.split(",");
                    var x = loc[0];
                    var y = loc[1].replace(/\s+/g, '');
                    // var x = this.locas[i][0];
                    // var y = this.locas[i][1];
                    var title = this.allEvents[i].event_name;
                    var subt = this.allEvents[i].date;
                    
                    args.map.addMarkers([
                        {
                            lat: parseFloat(x),
                            lng: parseFloat(y),
                            title: title,
                            subtitle: subt,
                            iconPath: 'images/redMarker.png',
                            onCalloutTap: () => {
                                // utils.openUrl("https://www.thepolyglotdeveloper.com");
                                if(confirm("Do you want to accept the request?")){
                                    // do something about accepting the request
                                    this.alert("YOu have confirmed the request");
                                }
                            }
                        }
                    ]);
                }
                console.log("====+++++++++" + this.allRequests.length + "++++======")
                for(i = 0; i < this.allRequests.length; i++){
                    // console.log(this.allRequests[0].location + "=================="+this.allEvents[1].location+"============================");
                    // console.log(this.allEvents[i].location + "========================"+this.allEvents[i].event_name+"======================");
                    // var loc = this.allRequests[i].location.split(",");
                    ;
                    var x = this.allRequests[i].latitude;
                    var y = this.allRequests[i].longitudes;
                    // var x = this.locas[i][0];
                    // var y = this.locas[i][1];
                    var title = this.allRequests[i].location;
                    var subt = this.allRequests[i].blood_group + ' - ' + this.allRequests[i].fulfilled_quantity;
                    var bg = this.allRequests[i].blood_group;
                    var bq = this.allRequests[i].blood_quantity;
                    var rid = this.allRequests[i].id;
                    args.map.addMarkers([
                        {
                            lat: parseFloat(x),
                            lng: parseFloat(y),
                            title: title,
                            subtitle: subt,
                            iconPath: 'images/greenMarker.png',
                            onCalloutTap: () => {
                                // utils.openUrl("https://www.thepolyglotdeveloper.com");
                                if(confirm("Do you want to accept the request?")){
                                    // do something about accepting the request
                                    http.request({
                                        url: "http://ec2-3-132-175-165.us-east-2.compute.amazonaws.com/donation/create",
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        content: JSON.stringify({
                                            blood_group: bg, 
                                            blood_qty: bq,
                                            user_id: appSettings.getString("token", "dasdasd"),
                                            donation_date: new Date(),
                                            gender: 'M',
                                            age: '20',
                                            donation_address: 'some addr',
                                            longitude: parseFloat(y),
                                            latitude: parseFloat(x),
                                            request_id: rid
                                        })
                                    }).then(response => {
                                        var result = response.content.toJSON();
                                        if(result.status){
                                            this.alert("You've successfully accepted the donation request");
                                        }
                                        else{
                                            this.alert("The request was already accepted by someone else");
                                        }
                                    }, error => {
                                        console.error(error);
                                    });
                                }
                            }
                        }
                    ]);
                }
                // args.map.addMarkers([
                //     {
                //         lat: 37.7397,
                //         lng: -121.4252,
                //         title: "Tracy, CA",
                //         subtitle: "Home of The Polyglot Developer!",
                //         onCalloutTap: () => {
                //             utils.openUrl("https://www.thepolyglotdeveloper.com");
                //         }
                //     }
                // ]);
            },
            alert(message) {
                return alert({
                    title: "ELIXIR",
                    okButtonText: "OK",
                    message: message
                });
            }
            
        },
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Search");
            http.request({
                url: "http://ec2-3-132-175-165.us-east-2.compute.amazonaws.com/events/all",
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }).then(response => {
                this.allEvents = response.content.toJSON();
                this.isEventsSet = true;
            }, error => {
                console.error(error);
            });
            http.request({
                url: "http://ec2-3-132-175-165.us-east-2.compute.amazonaws.com/requests/all",
                method: "GET",
            }).then(response => {
                this.allRequests = response.content.toJSON();
                this.isRequestsSet = true;
            }, error => {
                console.error(error);
            });
        }
        // computed: {
        //     message() {
        //         return "<!-- Page content goes here -->";
        //     }
        // },
        // methods: {
            // onDrawerButtonTap() {
            //     utils.showDrawer();
            // }
        // }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
</style>
