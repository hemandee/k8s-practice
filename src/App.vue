<template>
    <v-app>
        <v-navigation-drawer
                expand-on-hover
                app
                color="primary"
                clipped
                permanent
        >
            <!-- -->
            <SideNav appName="K8S Practice"/>
        </v-navigation-drawer>

        <v-app-bar
                app
                clipped-left
                dense
                color="primary">
            <!-- -->
            <AppBar/>
        </v-app-bar>

        <!-- Sizes your content based upon application components -->
        <v-content>

            <!-- Provides the application the proper gutter -->
            <v-container fluid>

                <!-- If using vue-router -->

                <router-view></router-view>

            </v-container>
        </v-content>

        <v-footer
                app
                inset
                dense
                class="d-none d-sm-flex d-sm-none d-md-flex">
            <!-- -->
            <Footer/>
        </v-footer>
    </v-app>
</template>
<script>
    import Footer from './components/Footer.vue'
    import SideNav from './components/SideNav.vue'
    import AppBar from "./components/AppBar";
    import {mapGetters, mapState} from 'vuex';

    export default {
        name: 'App',
        mounted() {

        },
        components: {
            Footer,
            SideNav,
            AppBar
        },
        computed : {
            ...mapGetters([
                 'getThemeBool'
            ]),
            ...mapState(['settings']),
        },
        watch : {
            settings(){
                // console.log(newVal,oldVal)
                // console.log("Getting Theme App Color " + this.$store.state.settings.options.theme)
                // console.log(this.$store.state)
                this.$vuetify.theme.dark = this.$store.getters.getThemeBool
            }
        },
        data() {

            return {}
        }
    }
</script>
<style>
    /*html{*/
    /*    overflow-y: hidden;*/
    /*}*/
    /*html {*/
    /*    overflow: hidden !important;*/
    /*    scrollbar-width: none;*/
    /*    -ms-overflow-style: none;*/
    /*}*/

    /*html::-webkit-scrollbar {*/
    /*    width: 0;*/
    /*    height: 0;*/
    /*}*/
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition-duration: 0.5s;
        transition-property: height, opacity, transform;
        transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
        overflow: hidden;
    }

    .slide-left-enter,
    .slide-right-leave-active {
        opacity: 0;
        transform: translate(2em, 0);
    }

    .slide-left-leave-active,
    .slide-right-enter {
        opacity: 0;
        transform: translate(-2em, 0);
    }
</style>