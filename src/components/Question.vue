<template>

    <v-card
            class="mx-auto"

    >

        <v-card-text>
            <DigiClock ref="digiClock" v-if="timeManagement !== 'disable'" />
            <QuestionToolbar ref="questionToolbar"/>
    <transition-group
        v-bind:name="slide"
        >
                <div :key="question_no + question"
                     :class="[timeManagement === 'disable' ? 'scroll-target-no-clock' : 'scroll-target']">
                    <div><h2>Question No {{question_no}}</h2></div>
                    <div>
                    <h3>Author:
                        <label v-for="username in author" v-bind:key="username">{{username}} </label>
                    </h3>
                    </div>
                    <div v-if="viewTags">
                        <h3>Tags: <v-chip small v-for="chip in tags" :key="chip">{{chip}}</v-chip></h3>
                    </div>
                    <div class="text-left pa-2">
                        <h2 class="display-1 text--primary">
                            {{question}}
                        </h2>
                    </div>

                    <v-expansion-panels
                            v-model="expand"
                            multiple


                    >
                        <v-expansion-panel

                        >
                            <v-expansion-panel-header>Answer</v-expansion-panel-header>

                            <v-expansion-panel-content
                                   >

                                <div>


                                    <div v-for="code in  parseAnswer(answer)" v-bind:key="code.uuid">
                                        <prism v-if="code.code !== 'markdown'" v-bind:language="code.code">{{code.text}}
                                        </prism>
                                        <div v-else>
                                            {{code.text}}
                                        </div>

                                    </div>

                                </div>
                            </v-expansion-panel-content>


                        </v-expansion-panel>
                        <v-expansion-panel
                                v-if="reference.length > 0"
                        >

                            <div>
                                <v-expansion-panel-header>References</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <div class="pre-formatted">
                                        <ul>
                                            <li v-for="item in reference" v-bind:key="item.linkText">
                                                <a v-bind:href="item.link" target="_blank">{{item.linkText}}</a>
                                            </li>
                                        </ul>

                                    </div>
                                </v-expansion-panel-content>
                            </div>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <div>
                        <v-row class="text-left">
                            <v-col>
                                <v-btn v-if="condition !== 'flag'" @click="updateCondition('flag')" color="accent"
                                       id="flag">Flag
                                </v-btn>
                                <v-btn v-if="condition === 'flag'" @click="updateCondition('unmarked')" color="green">
                                    UnFlag
                                </v-btn>

                            </v-col>

                            <v-col class="text-right">


                                <v-btn v-if="condition !== 'completed'" @click="updateCondition('completed')" id="mark"
                                       class="" color="primary">
                                    Mark as Completed
                                </v-btn>
                                <v-btn v-if="condition === 'completed'" @click="updateCondition('unmarked')" id="unmark"
                                       class="" color="green">
                                    UnMark as Completed
                                </v-btn>

                            </v-col>
                        </v-row>
                    </div>
                </div>
    </transition-group>
        </v-card-text>

    </v-card>

</template>

<script>
    import mxins from "../mxins";
    import qbase from "../assets/qbase"

    import Prism from "vue-prism-component"
    import DigiClock from "./DigiClock";
    import QuestionToolbar from "./QuestionToolBar";
    import {mapState} from "vuex";

    export default {
        name: 'Question',
        mixins: [mxins],
        components: {QuestionToolbar, DigiClock, Prism},
        methods: {
            parseReferences(reference) {
                // converting markdown to hyperlinks
                let parsedText = [];
                const regexLinkHeader = /\[(.*?)\]/;
                const regexLink = /\(([^)]+)\)/;

                for (let item in reference) {
                    try {
                        let linkText = reference[item].match(regexLinkHeader)[0]
                            .replace(/[[\]']+/g, '');

                        let link = reference[item].match(regexLink)[0]
                            .replace(/[()']+/g, '');

                        parsedText.push({
                            linkText: linkText,
                            link: link
                        })
                    } catch (e) {
                        this.log('ERROR',e)

                    }
                }

                return parsedText
            },
            updateCondition(btn) {
                try {
                    let input = 'unmarked';
                    switch (btn) {
                        case 'completed':
                            input = 'completed';
                            break;
                        case 'flag':
                            input = 'flag';
                            break;
                        case 'unmarked':
                            input = 'unmarked';
                            break;
                        default:
                            this.log('ERROR', 'Unknown Question Condition Reset: ', btn)

                    }

                    this.$store.dispatch('actionUpdateQuestionCondition', {

                        condition: input,
                        category: this.category,
                        question_no: this.question_no,


                    });
                    this.condition = input;

                } catch (e) {
                    this.log('ERROR', e);
                    this.condition = 'unmarked';

                }
            },


        },
        mounted() {

            try {
                this.$store.dispatch('actionUpdateCurrentPosQNav', this.setQNavCurrent(this.$route));

            }catch (e){
                this.log('ERROR',e)
            }


        },
        beforeDestroy() {

        },
        computed: {

            question_no: function() {return qbase['question_set'][this.$route.params.category][this.$route.params.question - 1].question_no},
            question: function() {return qbase['question_set'][this.$route.params.category][this.$route.params.question - 1].question},
            author: function() {return qbase['question_set'][this.$route.params.category][this.$route.params.question - 1].author},
            reference: function() {return this.parseReferences(qbase['question_set'][this.$route.params.category][this.$route.params.question - 1].reference)},
            category: function() {return this.$route.params.category},
            answer: function() { return qbase['question_set'][this.$route.params.category][this.$route.params.question - 1].answer},
            tags: function () {return qbase['question_set'][this.$route.params.category][this.$route.params.question - 1].tags},
            ...mapState({
                viewTags: state => state.settings.options.viewTags,
                timeManagement: state =>state.settings.options.timeManagement
            })



        },

        data: function () {
            return {
                expand: [],
                slide: 'slide-right',
                condition: this.$store.state.progress.question_set[this.$route.params.category]['no' + this.$route.params.question].condition
            }
        },
        watch: {
            '$route'(to) {
                this.expand = [];
                this.slide = this.$refs.questionToolbar.slide;

                //refresh Condition on next question
                this.condition = this.$store.state.progress.question_set[to.params.category]['no' + to.params.question].condition;
                // Reset Clock for next Q

                if (this.timeManagement !== 'disable') {
                    clearInterval(this.$refs.digiClock.$options.interval);

                    this.$refs.digiClock.resetClock();
                    this.$refs.digiClock.running = true;
                    this.$refs.digiClock.initClock();
                    // Set currentPost in $store
                }
                try {
                    this.$store.dispatch('actionUpdateCurrentPosQNav', this.setQNavCurrent(to));
                }catch (e) {
                    this.log('ERROR','Unable updateCurrent Nav ',e)
                }



            },

        }
    }
</script>

<style>
    .scroll-target {
        height: calc(100vh - 290px);
        overflow-y: auto;

    }

    .scroll-target-no-clock {
        height: calc(100vh - 240px);
        overflow-y: auto;
        overflow-x: hidden;

    }

    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
         {
        transform: translateX(10px);
        opacity: 0;
    }


</style>