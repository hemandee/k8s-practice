<template>
    <v-container>
        <div class="clear-btn">
            <v-btn
                    color="accent"
                    @click="onClearLogs"
                    small>
                Clear Logs</v-btn>
        </div>
        <v-spacer></v-spacer>
        <div class="text-center">

            <v-sheet
                    id="log-target"
            >
                <v-list-item
                        v-for="item in logValues"
                        :key="item.timestamp"
                        link

                >
                    {{ item.timestamp }} - {{item.loglevel}} - {{item.msg}}
                </v-list-item>
            </v-sheet>

        </div>
    </v-container>
</template>

<script>
    export default {
        methods: {
            onClearLogs() {
                try {
                    this.$store.dispatch("actionClearLogs");
                    this.logValues = this.$store.state.logs
                }catch (e){
                    this.log('ERROR','Unable to clear logs ',e)
                }
            }
        },
        computed: {
            // logValues() {
            //     return this.$store.state.logs
            // }
        },
        data: function() {
            return   {logValues: this.$store.state.logs}
        }
    }
</script>
<style>
    #log-target {
        height: calc(100vh - 260px);
        overflow-y: auto;
    }
</style>
