// main.js
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify"; // Vuetify setup
import router from "./router"; // Vue Router setup

const app = createApp(App);

app.use(vuetify);
app.use(router);
app.mount("#app");
