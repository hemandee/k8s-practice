<!--suppress JSCheckFunctionSignatures -->
<template>
    <v-hover v-slot:default="{ hover }">
        <v-card
                class="text-right"

        >


            <v-card-text
                    v-if="timeManagement !== 'disable'"
            >


                <v-row
                        justify="end"
                >
                    <v-btn @click="debugAddTime">Add Time</v-btn>
                    <div class="clock">
                        <span class="clockMinutes" v-text="minutes"></span>
                        <span class="clockBreaker">:</span>
                        <span class="clockSeconds" v-text="padSec(seconds)"></span>

                    </div>

                    <transition
                            name="slide-fade"

                    >
                        <div v-if="hover">
<!--                                                    <div v-if="!hover || hover">-->
                            <v-icon large class="pl-5" v-if="running" @click="player">pause</v-icon>
                            <v-icon large class="pl-5" v-if="!running" @click="player">play_arrow</v-icon>
                            <v-icon large class="pl-5" @click="resetClock">update</v-icon>
                        </div>
                    </transition>
                </v-row>
                <v-alert

                        dense
                        type="warning"
                        v-if="alert"
                        dismissible


                >
                    Stopwatch Warning every {{stopwatchCustomWarningTime}} min <v-icon @click="function(){alert = false}">close</v-icon>
                </v-alert>

            </v-card-text>
        </v-card>
    </v-hover>


</template>

<script>
    import mxins from "../mxins";

    export default {
        name: 'DigiClock',
        props: ['appName'],
        mixins: [mxins],
        methods: {
           
            getTimeRemaining() {
                let t = Date.parse(this.currTimeStamp) - Date.parse(new Date());
                let seconds = Math.floor((t / 1000) % 60);
                let minutes = Math.floor((t / 1000 / 60) % 60);

                this.seconds = seconds;
                this.minutes = minutes;
                if (this.minutes === 0 && parseInt(this.seconds) === 0) {
                    clearInterval(this.$options.interval)

                }

            },
            stopwatch() {
                this.stopwatchSeconds++;
                let minutes = Math.floor(this.stopwatchSeconds / 60);
                let seconds = this.stopwatchSeconds - (minutes * 60);

                this.minutes = minutes;
                this.seconds = seconds;
                // Show alert every configured time, special case if set to 1min
                let reminder = this.minutes % this.stopwatchCustomWarningTime;
                if ((reminder === 0 || this.stopwatchCustomWarningTime === 1) && this.seconds === 0) {

                    this.alert = true;
                }


            },
            padSec(value) {
                if (value < 10) {
                    return "0" + value
                } else {
                    return value
                }
            },
            player() {
                this.running = !this.running;
                if (this.running === false) {
                    clearInterval(this.$options.interval)
                } else {
                    if (this.timeManagement === 'countdown') {
                        this.currTimeStamp = this.addMinutesToDate(new Date(), (this.minutes * 60) + this.seconds);
                        this.getTimeRemaining();
                        this.$options.interval = setInterval(this.getTimeRemaining, 1000)
                    }else{
                        this.stopwatch();
                        this.$options.interval = setInterval(this.stopwatch, 1000)
                    }
                }


            },
            resetClock(){
              if (this.timeManagement === 'countdown'){
                  this.currTimeStamp = this.addMinutesToDate(new Date(), this.$store.state.settings.options.countdown.customTimeUp * 60);
                  this.minutes = this.countDownTimeUp;
                  this.seconds =0

              } else{
                  this.stopwatchSeconds = 0;
                  this.minutes =0;
                  this.seconds =0
              }
            },
            debugAddTime(){
                    this.stopwatchSeconds += 55

            },
            initClock(){
                switch (this.timeManagement) {
                    case 'disable':

                        break;
                    case 'countdown':
                        this.getTimeRemaining();
                        this.$options.interval = setInterval(this.getTimeRemaining, 1000);
                        break;
                    case 'stopwatch':
                        this.stopwatch();
                        this.$options.interval = setInterval(this.stopwatch, 1000);
                        break;
                    default:
                        this.stopwatch();
                        this.$options.interval = setInterval(this.stopwatch, 1000)
                }
            },
        },
        watch: {
            // '$route'() {
            //     this.log('INFO','Start Clock')
            //     clearInterval(this.$options.interval)
            //     this.resetClock();
            //     this.running = true;
            //     this.initClock();
            //
            // }
        },
        mounted() {

                this.initClock()

        },
        beforeDestroy() {
            clearInterval(this.$options.interval)

        },
        data() {
            return {

                timeManagement: this.$store.state.settings.options.timeManagement,
                countDownTimeUp: this.$store.state.settings.options.countdown.customTimeUp,
                stopwatchCustomWarningTime: this.$store.state.settings.options.stopwatch.customWarningTime,
                currTimeStamp: this.addMinutesToDate(new Date(), this.$store.state.settings.options.countdown.customTimeUp * 60),
                // currTimeStamp: this.addMinutesToDate(new Date(), 5),
                running: true,
                minutes: 0,
                seconds: 0,
                stopwatchSeconds: 0,
                alert: false


            }
        },
    }
</script>
<style>

    .clock {

        margin: 0.2em;
        font-size: x-large;
        font-family: Righteous,serif;


    }
</style>