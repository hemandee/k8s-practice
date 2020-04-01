<template>

    <v-container
            fluid
    >
        <v-container
                class="text-center"
                fill-height
                v-if="errorState"

        >
            <v-row>
                <v-col>
                    <h1 class="display-2 primary--text">Whoops</h1>

                    <p>{{errorMsg}}</p>

                    <v-btn
                            :to="`/questions`"
                            color="primary"

                    >
                        Start!
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
        <div v-if="!errorState">

            <v-expansion-panels v-model="panelValue" focusable class="scroll-target">

                <v-expansion-panel disabled>
                    <v-expansion-panel-header>
                        <v-row no-gutters>
                            <v-col cols="1">
                                Q No.
                            </v-col>
                            <v-col cols="2">
                                Category
                            </v-col>
                            <v-col cols="3">
                                Question
                            </v-col>
                            <v-col cols="1" class="pl-3">
                                Attempt
                            </v-col>
                            <v-col>
                                {{panelValue}}
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col>
                                Completion Time
                            </v-col>

                        </v-row>
                    </v-expansion-panel-header>
                </v-expansion-panel>
                <v-expansion-panel
                        v-for="(item,index) in qNav" :key="index"
                >


                    <v-expansion-panel-header v-slot="{ open }">
                        <v-row>
                            <v-col cols="1">
                                <div class="">{{index +1 }}</div>
                            </v-col>
                            <v-col cols="2">
                                {{item.category.replace(/[_]/g, ' ').toUpperCase()}}
                            </v-col>
                            <v-col cols="3">

                                <div>
                                    <v-fade-transition hide-on-leave>
                <span
                        v-if="open"
                        key="0"
                >

                </span>
                                        <span
                                                v-else
                                                key="1"
                                                class="limit-text"
                                        >
                                    {{retrieveQuestion(item.category,item.question_no)}}
                 </span>
                                    </v-fade-transition>
                                </div>
                            </v-col>
                            <v-col cols="1">

                                <p :class="tileColor(item.category,item.question_no)">
                                    {{retrieveCondition(item.category,item.question_no).toUpperCase().trim()}}</p>

                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col >
                                <p v-if="retrieveCondition(item.category,item.question_no) === 'completed'">
                                    {{retrieveCompletionTime(item.category,item.question_no)}}</p>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row no-gutters>
                            <v-col class="text-right">
                                <v-btn
                                        text
                                        color="warning"
                                        :to="generatePath(item.category,item.question_no)"
                                        class="pa-3"
                                        large
                                        outlined
                                >Go
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <h2 class="text-primary pa-2">
                                {{retrieveQuestion(item.category,item.question_no)}}
                            </h2>
                        </v-row>
                        <v-row>
                            <div class="pa-2">
                                <div v-for="code in  parseAnswer(retrieveAnswer(item.category,item.question_no))"
                                     v-bind:key="code.uuid">
                                    <prism v-if="code.code !== 'markdown'" v-bind:language="code.code">
                                        {{code.text}}
                                    </prism>
                                    <div v-else>
                                        {{code.text}}
                                    </div>
                                </div>

                            </div>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </v-container>
</template>

<script>

    import {mapState} from "vuex";
    import mxins from "../mxins";
    import Prism from "vue-prism-component";
    import qbase from "../assets/qbase";


    export default {
        name: "Report",
        mixins: [mxins],
        components: {Prism},
        computed: {
            ...mapState({
                progressReport: state => state.progress
            }),

        },
        mounted() {

            if (this.progressReport.savedQLength >= 0 && this.progress.savedQLength !== undefined) {
                this.errorState = true;
                this.errorMsg = 'No Attempts Recorded';
            }


        },

        methods: {
            //
            retrieveQuestion(cat, q) {

                return this.$store.state.progress.question_set[cat]['no' + q].preview || 'Error';
            },
            retrieveCondition(cat, q) {

                return this.$store.state.progress.question_set[cat]['no' + q].condition || 'Error'
            },
            retrieveCompletionTime(cat, q) {
                try{
                    let time = this.$store.state.progress.question_set[cat]['no' + q].completionTime;
                    let minutes = Math.floor(time / 60);
                    let seconds = time - minutes * 60;

                    minutes = this.padSec(minutes);
                    seconds = this.padSec(seconds);

                    return minutes + ":" + seconds

                }catch (e) {
                    this.log('ERROR','Unable to convert completion Time',e)
                    return '';
                }

            },
            retrieveAnswer(cat, q) {

                try {
                    return qbase['question_set'][cat][q - 1].answer || 'ERROR';
                } catch (e) {
                    this.log('ERROR', e)
                }
            },

            generatePath(cat, q) {
                return {
                    name: 'Question',
                    params: {
                        question: q,
                        category: cat
                    }
                }
            },
            tileColor(cat, q) {

                let val = this.retrieveCondition(cat, q);
                switch (val) {
                    case 'flag':
                        return 'accent--text';

                    case 'completed':
                        return 'green--text';
                    default:
                        return ''

                }
            },
            highlightCode(){
                console.log('Highliten code');
                Prism.highlightAll()
            }
        },

        data: function () {
            return {
                errorMsg: false,
                progress: this.$store.state.progress.question_set,
                qNav: this.$store.state.qNav.qSet,
                errorState: false,



            }
        },
        watch: {
            panelValue : function(elm){
                console.log(elm)
                this.highlightCode()
            }
        }
    }
</script>

<style scoped>
    .limit-text {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .scroll-target {
        height: calc(100vh - 150px);
        overflow-y: auto;

    }

    .font-increase {
        font-size: 120%
    }
    pre {
        overflow: auto;

    }
</style>