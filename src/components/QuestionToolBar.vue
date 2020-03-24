<template>


        <v-row
                no-gutters
                class="pb-12"
        >

            <v-col>

            </v-col>
            <v-col>
                <v-pagination
                        v-model="currPage"
                        class="my-4"
                        :length="dataLength"
                        color="warning"
                        next-icon="navigate_next"
                        prev-icon="navigate_before"
                        @input="pageClick"

                ></v-pagination>
            </v-col>
            <v-col>
            <div class="text-right pt-6" v-if="currPage >= dataLength">
                <v-btn color="accent" :to="{name: 'Report'}">Complete</v-btn>
            </div>
            </v-col>

        </v-row>


</template>

<script>
    import mxins from "../mxins";
    import {mapGetters} from "vuex";

    export default {
        name: 'QuestionToolbar',
        props: ['appName'],
        mixins: [mxins],
        methods: {
            getSlide(){
              return this.slide;
            },
            pageClick(index){
                // console.log(this.pagValue);
                // console.log(index);
                let changePath = {
                    name: 'Practice Questions',
                    params: {
                        question: '' ,
                        category: ''
                    }
                };
                try{
                    // index -1 since pagination starts at 1
                    let newQNav = this.$store.state.qNav.qSet[index - 1];

                    let currQNavPost = this.$store.getters.getCurrentPosition;
                    // console.log(index-1);
                    // console.log(currQNavPost);
                    if ((index-1) <= currQNavPost){
                        this.slide = 'slide-left'
                    }else{
                        this.slide = 'slide-right'
                    }
                    changePath = {
                        name: 'Question',
                        params: {
                            question: newQNav.question_no ,
                            category: newQNav.category
                        }
                    };

                }catch (e) {
                    this.log('ERROR','Unable to move Nav to index',e)
                }
                try{
                    this.$router.push(changePath).catch(err => this.log('INFO', 'Unable to Navigate ' + err));
                }catch (e){
                    console.log(e)
                }

            }
        },
        mounted() {

            // this.log('INFO', 'Loaded Question Toolbar')
            // this.btnBack();
            // this.btnNext();

        },
        beforeDestroy() {

        },
        computed : {


            ...mapGetters({
                currentPage : 'getCurrentPage'
            }),
            currPage: {
                set(value){
                    this.pageClick(value)
                },
                get(){
                    return parseInt(this.currentPage)
                }
            }

        },
        watch: {
            // '$route' () {
                // this.btnBack();
                // this.btnNext();
            // }
        },
        data() {
            return {
                next: '',
                back: '',
                dataLength: this.$store.state.qNav.qSet.length,
                currentIndex: this.$store.state.qNav.currentPos +1,
                pagValue: 0,
                slide: 'slide-right'
            }
        },
    }
</script>
<style>


</style>