// store/index.js

import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from 'vuex-persist'
import localforage from 'localforage'
import vuetify from "../plugins/vuetify";

Vue.use(Vuex);

const vuexIndexDBStorage = new VuexPersistence({
    key: 'k8-test',
    storage: localforage,
    asyncStorage: true

});

const getDefaultState = () => {
    return {
        user: 'anonymous',
        kubeconfig: 'EMPTY',
        logs: [
            {
                timestamp: 'START',
                loglevel: 'OF',
                msg: 'LOG - ENABLE IN SETTINGS'
            }
        ],
        settings: {
            options: {
                theme: "dark",
                timeManagement: 'stopwatch',
                stopwatch: {
                    customWarningTime: 5
                },
                countdown: {
                    customTimeUp: 5
                },
                activityLogs: false,
                viewTags: true

            }
        },
        progress: {
            date: '',
            question_set: []
        },
        qNav: {
            random: false,
            currentPos: 0,
            qSet: []
        }

    }
};

export default new Vuex.Store({
    state: getDefaultState(),
    getters: {
        getKubeConfig(state) {


            return state.kubeconfig
        },
        getThemeBool(state) {
            // this.log('INFO',"Getting theme is " + state.settings.options.theme);
            return state.settings.options.theme !== 'light';
        },
        getCurrentPosition(state) {
            try {
                return state.qNav.currentPos
            } catch (e) {
                console.log('Unable to return QNav', e);
                return 0
            }
        },
        getCurrentPage(state){

            return parseInt(state.qNav.currentPos +1) || 1
        }


    },
    mutations: {

        commitReset(state) {
            Object.assign(state, getDefaultState())

        },
        commitLog(state, input) {
            state.logs.push({
                // console.log({
                timestamp: input.timestamp,
                loglevel: input.loglevel,
                msg: input.msg
            })
        },
        commitClearLogs(state) {
            state.logs = [
                {
                    timestamp: 'START',
                    loglevel: 'OF',
                    msg: 'LOG'
                }
            ];
            console.log("Reset Logs");
        },
        commitKubeConfig(state, input) {
            state.kubeconfig = input;
        },
        commitProgress(state, input) {
            console.log("Write to Progress");
            console.log(input);
            state.progress = input;
            console.log(state)
        },
        commitSettingsTheme(state, input) {
            state.settings.options.theme = input;
            console.log('Updated Theme to ' + input);
            vuetify.framework.theme.dark = state.settings.options.theme !== 'light';

        },
        commitSettingsTimeManagement(state, input) {
            state.settings.options.timeManagement = input;
            console.log('Updated timeManagement to' + input)
        },
        commitUpdateActivityLogs(state, input) {
            state.settings.options.activityLogs = input;
            console.log("Updated ActivityLogs to " + input);
        },
        commitUpdateStopwatchCustomWarningTime(state, input) {
            state.settings.options.stopwatch.customWarningTime = parseInt(input);
            console.log("Updated Time Warn at " + input + " Mins")
        },
        commitUpdateCountDownCustomTimeUp(state, input) {
            state.settings.options.countdown.customTimeUp = parseInt(input);
            console.log("Updated CountDown From " + input + " Mins")
        },
        commitAddQuestionProgress(state, input) {
            // console.log(state)
            if (state.progress.question_set[input.category] === undefined) {
                state.progress.question_set[input.category] = {}
            }
            state.progress.question_set[input.category]['no' + input.question_no] = {
                question_no: input.question_no,
                attempt: input.attempt,
                condition: input.condition,
                preview: input.preview || ''
            }
        },
        commitQNav(state, input) {
            state.qNav = input

        },
        commitUpdateCurrentPosQNav(state, input) {
            state.qNav.currentPos = input;
            // console.log('updated currentpos to', state.qNav.currentPos)
        },
        commitUpdateQuestionCondition(state, input) {
            console.log(input);
            // Vue.set(state.progress.question_set[input.category]['no' + input.question_no],'condition', input.condition)
            state.progress.question_set[input.category]['no' + input.question_no].condition = input.condition;
        },
        commitResetAttempt(state) {
            let defaultAttempt = getDefaultState();
            state.progress = defaultAttempt.progress;
            state.qNav = defaultAttempt.qNav;

        },
        commitViewTags(state,input){
            state.settings.options.viewTags = input;
        },
        commitUpdateTimeQuestion(state,input){
            let cat = input['cat'];
            let question = input['qNo'];
            state.progress.question_set[cat][question]['completionTime'] = input['time']
        }
    },
    actions: {
        // Add to logs page
        logger(context, input) {
            if ('timestamp' in input && 'loglevel' in input && 'msg' in input) {
                context.commit('commitLog', input);
            } else {
                console.log('Unable to Add To Log Raw Message Below');
                console.log(input)
            }
        },
        actionReset(context) {
            console.log('Reset Settings to Default');
            context.commit('commitReset');
        },
        actionProgress(context, input) {
            if (input['date'] !== '' && Object.keys(input['question_set']).length > 1) {
                context.commit('commitProgress', input)
            }
        },
        actionClearLogs(context) {
            context.commit("commitClearLogs")
        },
        actionKubeconfig(context, input) {
            // this.logger(context,{timestamp: new Date().toISOString(),loglevel: 'DEBUG',msg: 'Attempting to persist kubeconfig to indexedDB'})
            context.commit('commitKubeConfig', input)
        },
        actionUpdateSettingsTheme(context, input) {
            if (input === 'dark' || input === 'light') {
                context.commit('commitSettingsTheme', input)
            }
        },
        actionUpdateTimeManagement(context, input) {
            if (input === 'stopwatch' || input === 'countdown' || input === 'disable') {
                context.commit('commitSettingsTimeManagement', input)
            }
        },
        actionUpdateActivityLogs(context, input) {
            if (typeof input === 'boolean') {
                context.commit('commitUpdateActivityLogs', input)
            }else{
                console.log('Unable to update Acitivity Log Settings ',input)
            }
        },
        actionUpdateCountDownCustomTimeUp(context, input) {
            if (Number.isInteger(parseInt(input))) {
                context.commit('commitUpdateCountDownCustomTimeUp', input)
            } else {
                console.log("Invalid Number " + input)

            }
        },
        actionUpdateStopwatchCustomWarningTime(context, input) {
            if (Number.isInteger(parseInt(input))) {
                context.commit('commitUpdateStopwatchCustomWarningTime', input)
            } else {
                console.log("Invalid Number " + input)
            }
        },
        actionAddQuestionProgress(context, input) {
            // console.log('actionAddQuestionProgress');
            const checkIndex = ['category', 'question_no', 'attempt', 'condition'];
            if (checkIndex.every(key => Object.keys(input).includes(key))) {
                context.commit('commitAddQuestionProgress', input)
            } else {
                console.log('Unable to add Question to Navigation');
            }
        },
        actionQNav(context, input) {
            if (input.qSet.length > 0) {
                context.commit('commitQNav', input)
            } else {
                console.log('Unable to commit Question Nav array')
            }
        },
        actionUpdateCurrentPosQNav(context, input) {
            let realInt = parseInt(input);

            if (realInt <= this.state.qNav.qSet.length && Math.sign(realInt) >= 0) {
                context.commit('commitUpdateCurrentPosQNav', input)
            } else {
                console.log('Unable to update current QNav position, reset to first question');
                context.commit('commitUpdateCurrentPosQNav', 0)
            }
        },
        actionUpdateQuestionCondition(context, input) {
            const conditionKeys = ['question_no', 'category', 'condition'];
            if (conditionKeys.every(key => Object.keys(input).includes(key))) {
                context.commit('commitUpdateQuestionCondition', input)
            } else {
                console.log('Unable to Update Question Condition Failed Check', input);
            }
        },
        actionUpdateRandomQNav(context, input) {
            if (typeof input === "boolean") {
                console.log('actionupdateRandomQNav')
            } else {
                console.log('Unable to Update RandomQNav input not boolean', input)
            }
        },
        actionResetAttempt(context) {
            console.log('Reset Attempt');
            context.commit('commitResetAttempt');
        },
        actionUpdateViewTags(context, input){
            if (typeof input === 'boolean') {
                console.log('Update View Tags');
                context.commit('commitViewTags',input);
            }else{
                console.log('Unable to update viewTags settings input not boolean ',input)
            }
        },
        actionUpdateTimeQuestion(context,input){
            const conditionKeys = ['qNo', 'cat', 'time'];
            if (conditionKeys.every(key => Object.keys(input).includes(key))) {
                context.commit('commitUpdateTimeQuestion', input)
            }else{
                console.log('Unable to update Question Time',input)
            }
        }
    },
        plugins: [vuexIndexDBStorage.plugin]
    });