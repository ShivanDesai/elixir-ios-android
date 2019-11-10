import Vue from "nativescript-vue";
import App from "./components/App";
import Login from './components/Login';
import Home from "./components/Home";
import DrawerContent from "./components/DrawerContent";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
Vue.use(RadSideDrawer);

Vue.config.silent = (TNS_ENV === 'production');
Vue.registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

new Vue({
    render (h) {
        return h(
          App,
          [
            h(DrawerContent, { slot: 'drawerContent' }),
            h(Login, { slot: 'mainContent' })
          ]
        )
      }
    // render: h => h('frame', [h(Login)])
  }).$start();
