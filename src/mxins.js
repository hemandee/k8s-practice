export default {


    methods: {


        log(lvl, msg,e='') {
            let timestamp = new Date().toISOString();
            if (lvl === 'ERROR') {
                console.log({timestamp: timestamp, loglevel: lvl, msg: msg});
            }
            if (this.$store.state.settings.options.activityLogs) {
                this.$store.dispatch('logger', {timestamp: timestamp, loglevel: lvl, msg: msg});
            }
            if (process.env.NODE_ENV !== 'production') {
                console.log({timestamp: timestamp, loglevel: lvl, msg: msg + ' ' + e})
            }

        },
        qBaseRestruct(org) {

            const returnQNav = [];
            if ('lastModified' in org) {
                this.$store.state.progress.date = org['lastModified']
            }
            if ('qLength' in org){
                this.$store.state.progress.savedQLength = org ['qLength']
            }
            // only get question_set
            org = org['question_set'];
            for (let cat in org) {



                    for (let q in org[cat]) {

                        let stateProgressCheck = true;
                        // check if question has been initialized
                        if (this.$store.state.progress['question_set'][cat] === undefined) {
                            stateProgressCheck = false;
                        } else if (this.$store.state.progress['question_set'][cat]['no' + org[cat][q].question_no] === undefined) {
                            stateProgressCheck = false;
                        }else if (parseInt(this.$store.state.progress['question_set'][cat]['no' + org[cat][q].question_no])){
                            stateProgressCheck = false;
                        }
                        // if question is already added to state
                        if (stateProgressCheck) {
                            this.log('INFO', org[cat][q].question_no + ' already defined');
                        } else {

                            try {
                                let input = {
                                    category: cat,
                                    question_no: org[cat][q].question_no,
                                    attempt: false,
                                    condition: 'unmarked',
                                    preview: org[cat][q].question
                                };
                                this.$store.dispatch('actionAddQuestionProgress', input)
                            } catch (e) {
                                this.log('ERROR', 'Unable to Add Question', e)

                            }

                        }
                        returnQNav.push({
                            question_no: org[cat][q].question_no,
                            category: cat
                        })

                    // }
                }
            }

            return returnQNav;
        },

        initQNextPath() {
            let path = {
                name: 'Question',
                params: {
                    category: this.$store.state.qNav.qSet[0].category || 'core_concepts',
                    question: this.$store.state.qNav.qSet[0].question_no || 1
                }
            };
            // let path = 'questions/' + this.$store.state.qNav.qSet[0].category + '/' + this.$store.state.qNav.qSet[0].question_no
            for (let item in this.$store.state.qNav.qSet) {
                let condition = this.$store.state.progress.question_set[this.$store.state.qNav.qSet[item].category]['no' + this.$store.state.qNav.qSet[item].question_no].condition;

                if (condition === 'unmarked') {
                    path.params.category = this.$store.state.qNav.qSet[item].category;
                    path.params.question = this.$store.state.qNav.qSet[item].question_no;
                    return path
                } else if (condition === 'flag') {
                    path.params.category = this.$store.state.qNav.qSet[item].category;
                    path.params.question = this.$store.state.qNav.qSet[item].question_no;
                }
            }
            return path
        },

        setQNavCurrent(to){

            const cat = to.params.category;
            //parseInt since mounted() passes this.$route and watcher method passes int
            const q = parseInt(to.params.question);
            let currPos = 0;
                 for (let i =0; i< this.$store.state.qNav.qSet.length;i++){
                if (this.$store.state.qNav.qSet[i].category === cat && this.$store.state.qNav.qSet[i].question_no === q){
                    currPos = i;
                    break;
                }
            }
            return currPos

        },

        shuffleQuestions(sourceArray) {
            // Fisher–Yates shuffle
            for (let i = 0; i < sourceArray.length - 1; i++) {
                let j = i + Math.floor(Math.random() * (sourceArray.length - i));

                let temp = sourceArray[j];
                sourceArray[j] = sourceArray[i];
                sourceArray[i] = temp;
            }
            return sourceArray;


        },
        parseAnswer(input) {
            let parsedInput = [];

            let parseSplit = input.split('```');
            parseSplit.forEach(function (item) {

                //uuid is for unique key for v-for loop
                if (item.startsWith('bash')) {
                    parsedInput.push({
                        code: 'bash',
                        text: item.substring(4, item.length),
                        uuid: '_' + Math.random().toString(36).substr(2, 9)
                    })
                } else if (item.startsWith('yaml')) {

                    parsedInput.push({
                        code: 'yaml',
                        text: item.substring(4, item.length),
                        uuid: '_' + Math.random().toString(36).substr(2, 9)
                    })
                } else {
                    parsedInput.push({
                        code: 'markdown',
                        text: item,
                        uuid: '_' + Math.random().toString(36).substr(2, 9)
                    })
                }


            });

            return parsedInput
        },
        addMinutesToDate(date, seconds) {
            return new Date(date.getTime() + seconds * 1000);
        },
        padSec(value) {
            if (value < 10) {
                return "0" + value
            } else {
                return value
            }
        }
    }
}