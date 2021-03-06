import Vue from 'vue';
import VueRouter from 'vue-router';


import Home from './components/Home';
import Log from './components/Logs'
import Settings from "./components/Settings";
import QuestionSet from "./components/QuestionSet";
import Question from "./components/Question";
import ErrorPage from "./components/ErrorPage";
import store from "./store/index"
import Report from "./components/Report";
import About from "./components/About";

Vue.use(VueRouter);

const waitForStorageToBeReady = async (to, from, next) => {
    document.title = 'k8s Practice - ' + to.name || 'k8s Practice';
    try {
        await store.restored;
    }catch (e){
        console.log(e)
    }
    next()
};

const router = new VueRouter({
    // Github Pages does not work with history mode unless custom 404 page is included
    mode: 'history',
    base: process.env.NODE_ENV === 'production'
        ? '/k8s-practice'
        : '/',
    routes: [
        {path: '/', component: Home, name: "Home"},
        {path: '/logs', component: Log, name: "Logs"},
        {path: '/settings', component: Settings, name: "Settings"},
        {path: '/questions/', component: QuestionSet, name: "Practice Questions"},
        {path: '/questions/:category/:question', component: Question, name: "Question"},
        {path: '/report', component: Report, name: "Report"},
        {path: '/about',component: About, name: "About"},
        {path: '*', component: ErrorPage , name: 'Error'}

    ]
});

router.beforeEach(waitForStorageToBeReady);
export default router
