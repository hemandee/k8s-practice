<template>

    <v-card fluid>
        <v-progress-linear
                height="30"
                indeterminate


        >
            <strong>{{ logState }}</strong>
        </v-progress-linear>

        <!--    <v-col cols=12>-->
        <div v-if="previousState" class="text-right pt-8">
            <v-btn @click="btnResumeAttempt" color="accent">Resume Previous Attempt</v-btn>
        </div>


        <v-simple-table>
            <thead>
            <tr>
                <th class="text-left">Practice Settings</th>
                <th class="text-left"></th>
            </tr>
            </thead>

            <tbody>
            <tr>
                <td>Randomize Questions</td>
                <td>
                    <v-switch color="accent" v-model="randomQuestion"
                    >

                    </v-switch>
                </td>
            </tr>
            <tr>
                <td>Time Management</td>
                <td>
                    <v-select :value="timeManagementCurrentValue" :items="timeManagementAvailValues"
                              label="Clock" @input="updateTimeManagement">

                    </v-select>
                </td>
            </tr>
            <tr v-if="timeManagementCurrentValue === 'stopwatch'">
                <td>Timer Warning At</td>
                <td>
                    <v-text-field
                            :value="stopwatchCustomWarningTime"
                            type="number"
                            style="width: 60px"
                            hint="Minutes"
                            :rules="[numberValidate]"
                            @change="updateStopwatchCustomWarningTime"
                    ></v-text-field>
                </td>
            </tr>
            <tr v-if="timeManagementCurrentValue === 'countdown'">
                <td>CountDown Time From</td>
                <td>
                    <v-text-field
                            :value="countDownTimeUp"
                            type="number"
                            style="width: 60px"
                            hint="Minutes"
                            :rules="[numberValidate]"
                            @change="updateCountDownCustomTimeUp"
                    ></v-text-field>
                </td>
            </tr>
            <tr>
                <td>View Question Tags</td>
                <v-switch
                        hint="Tags shown per Question"
                        persistent-hint
                        :input-value="viewTags"
                        @change="updateViewTags"
                ></v-switch>
            </tr>
            </tbody>

        </v-simple-table>


        <div class="text-right">
            <v-btn color="primary" @click="btnStartAttempt">Start New Attempt</v-btn>
        </div>
        <v-snackbar v-model="updateQuestionMsg">
            Updated Question Bank Start New Attempt
            <v-btn
                color="accent"
                text
                @click="updateQuestionMsg = false"
            >Close</v-btn>
        </v-snackbar>

    </v-card>
</template>

<script>
    import mxins from "../mxins";
    import qbase from "../assets/qbase.json";
    import mixinsettings from "../mixinsettings";
    import {mapState} from 'vuex'

    export default {
        name: 'QuestionSet',
        mixins: [mxins, mixinsettings],
        methods: {
            changeViewLog(txt) {
                this.logState = txt;
                // return txt;
            },
            numberValidate(v) {
                return /^[1-9][0-9]?$/.test(v) || 'Must be a number between 1-99'
            },
            btnResumeAttempt() {
                console.log('resume');
                try {
                    this.$router.push(this.initQNextPath()).catch(err => this.log('ERROR', 'Unable to Navigate ' + err));
                } catch (e) {
                    this.log('ERROR', e)
                }
            },
            btnStartAttempt() {
                try {
                    this.$store.dispatch('actionResetAttempt');

                    let qSet = this.qBaseRestruct(qbase);
                    if (this.randomQuestion) {

                        qSet = this.shuffleQuestions(this.qBaseRestruct(qbase));
                    }
                    this.$store.dispatch('actionQNav', {
                        random: this.randomQuestion,
                        currentPos: 0,
                        qSet: qSet
                    });

                    // console.log(this.initQNextPath());
                    this.$router.push({
                        name: 'Question',
                        params: {
                            question: this.$store.state.qNav.qSet[0].question_no,
                            category: this.$store.state.qNav.qSet[0].category
                        }

                    }).catch(err => this.log('ERROR', 'Unable to Navigate ' + err))

                } catch (e) {
                    this.log('ERROR', e)
                }
            },
            // updateRandomQuestions(input){
            // console.log('Updating Random Q;s ',input)
            // this.$store.dispatch('actionUpdateRandomQNav',input)
            // }

        },
        mounted() {
            // console.log(qbase)
            // let random = false;
            this.log('INFO', 'Loading Question Set');
            this.changeViewLog("Loading Question Set");
            if (Object.keys(this.$store.state.progress.question_set).length > 0) {
                this.log("INFO", "Existing Progress Found Loading");
                this.changeViewLog("Existing Progress Found Loading");
                this.previousState = true;
                this.changeViewLog('Waiting on User Input')
                if (this.qNavLength !== qbase['qLength']){
                    console.log('Updated Questions')
                    this.updateQuestionMsg = true;
                }
            } else {
                this.log("INFO", "No Saved Progress Start New");
                this.changeViewLog("No Saved Progress Start New Attempt");


            }


        },
        computed: mapState({


            timeManagementCurrentValue: state => state.settings.options.timeManagement,
            viewTags: state => state.settings.options.viewTags,
            stopwatchCustomWarningTime: state => state.settings.options.stopwatch.customWarningTime,
            countDownTimeUp: state => state.settings.options.countdown.customTimeUp,
            questionTimeStamp: state => state.progress.date,
            qNavLength: state => state.qNav.qSet.length

        })
        ,
        data: function () {
            return {
                logState: 'Loading...',
                previousState: false,
                randomQuestion: false,
                timeManagementAvailValues: ['stopwatch', 'countdown', 'disable'],
                updateQuestionMsg:false

            }
        },
    }
</script>

<style>
    html {
        overflow-y: hidden
    }
</style>