import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
Vue.use(Vuetify);


export default new Vuetify({
    iconfont: 'md',
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#326CE5',
                accent: '#FF4081',
                secondary: '#81D4FA',
                success: '#4CAF50',
                info: '#2196F3',
                warning: '#FB8C00',
                error: '#FF5252'
            },
            light: {
                primary: '#326CE5',
                accent: '#e91e63',
                secondary: '#30b1dc',
                success: '#4CAF50',
                info: '#2196F3',
                warning: '#FB8C00',
                error: '#FF5252'
            }
        }

    },
})