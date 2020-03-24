<template>

    <v-container
        fluid
    >
    <v-container
            class="text-center"
            fill-height
            v-if="errorState"

    >
        <v-row >
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
            <v-row wrap dense no-gutters class="scroll-target">
                <v-col>
                <div  v-for="(item,index) in qNav" :key="index">
                    <v-card

                            max-height="200px"
                            min-height="100px"
                            outlined

                    >
                        <v-card-text>
                            <div>Question: {{index +1 }}</div>
                            <p class="limit-text">
                                {{retrieveQuestion(item.category,item.question_no)}}
                            </p>


                        </v-card-text>
                        <v-card-actions >
                            <v-row>
                        <v-col class="pa-5">
                            <p  :class="tileColor(item.category,item.question_no)">{{retrieveCondition(item.category,item.question_no).toUpperCase()}}</p>
                        </v-col>
                            <v-col>
                            <v-btn
                                    text
                                    color="warning"
                                    :to="generatePath(item.category,item.question_no)"
                                    class="pa-3"

                            >
                                View Full
                            </v-btn>
                            </v-col>
                            </v-row>
                        </v-card-actions>
                    </v-card>
                </div>
                </v-col>
            </v-row>

</div>
    </v-container>
</template>

<script>

    import {mapState} from "vuex";

    export default {
        name: "Report",
        computed : {
            ...mapState({
                progressReport : state => state.progress
            }),

        },
        mounted() {

            if(this.progressReport.savedQLength >= 0 && this.progress.savedQLength !== undefined){
                this.errorState = true;
                this.errorMsg = 'No Attempts Recorded';
            }

        },

        methods: {
            //
            retrieveQuestion(cat, q) {

                return this.$store.state.progress.question_set[cat]['no' + q].preview || 'Error';
            },
            retrieveCondition(cat, q){

                return this.$store.state.progress.question_set[cat]['no' +q].condition || 'Error'
            },
            generatePath(cat,q){
                return {
                    name: 'Question',
                    params:{
                        question: q,
                        category: cat
                    }
                }
            },

            tileColor(cat,q){

                let val = this.retrieveCondition(cat,q);
                switch (val){
                    case 'flag':
                        return 'accent--text';

                    case 'completed':
                        return 'green--text';
                    default:
                        return ''

                }
            }
        },

        data: function () {
            return {
                errorMsg: false,
                progress: this.$store.state.progress.question_set,
                qNav: this.$store.state.qNav.qSet,
                errorState: false


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
</style>