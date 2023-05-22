import { createApp } from 'vue';
import { Icon } from '@iconify/vue';
import naive from 'naive-ui';
import JsonViewer from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import './assets/main.scss';
import mitt from 'mitt';
import App from './App';
import router from './router';
import store from './store';

const eventBus = mitt();

const app = createApp(App);
app.provide('eventBus', eventBus);
app.component('Icon', Icon);
app.component('JsonViewer', JsonViewer);

app.use(router);
app.use(naive);
app.use(store);
app.mount('#app');
