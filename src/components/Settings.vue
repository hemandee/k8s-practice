<template>
    <v-card>
        <div class="text-right">
            <v-btn class="text-right" color="accent" @click="btnReset"> Reset Settings</v-btn>
        </div>
    <v-simple-table>

            <thead>
            <tr>
                <th class="text-left">Key</th>
                <th class="text-left">Value</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Theme</td>
                <td>
                    <v-select :value="theme" :items="settings.theme.availValues" label="Color"
                              @input="updateSettingsTheme"></v-select>
                </td>
            </tr>
            <tr>
                <td>Activity Log</td>
                <td>
                    <v-switch
                            hint="Logs shown on Side Navigation"
                            persistent-hint
                            :input-value="activityLogs"
                            @change="updateActivityLogs"
                    ></v-switch>
                </td>

            </tr>
            <tr>
                <td>Time Management</td>
                <td>
                    <v-select :value="timeManagementCurrentValue" :items="settings.timeManagement.availValues"
                              label="System" @input="updateTimeManagement"></v-select>
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
            <tr>
                <td>Clear Current Attempt</td>
                <td>
                    <v-btn @click="btnClearAttempt" color="primary">
                        Clear
                    </v-btn>
                </td>
            </tr>

            </tbody>
    </v-simple-table>
    </v-card>
</template>

<script>
    import mxins from "../mxins";
    import mixinsettings from "../mixinsettings";
    import {mapState} from "vuex";

    export default {
        name: "Settings",
        mixins: [mxins, mixinsettings],
        methods: {
            numberValidate(v) {
                return /^[1-9][0-9]?$/.test(v) || 'Must be a number between 1-99'
            },
        },
        computed: mapState({
            theme: state => state.settings.options.theme,
            timeManagementCurrentValue: state => state.settings.options.timeManagement,
            activityLogs: state => state.settings.options.activityLogs,
            stopwatchCustomWarningTime: state => state.settings.options.stopwatch.customWarningTime,
            countDownTimeUp: state => state.settings.options.countdown.customTimeUp,
            viewTags: state => state.settings.options.viewTags

        }),
        mounted() {
            // this.log("ERROR", "TEST ERROR MESSAGE")
            // this.log("INFO", "TEST INFO MESSAGE")
        },
        data: function () {
            return {
                search: '',
                headers: [
                    {
                        text: 'Key',
                        align: 'start',
                        sortable: false,
                        value: 'name',
                    },
                    {text: 'Value', value: 'currentValue'}

                ],
                settings:
                    {
                        theme: {
                            availValues: ['dark', 'light']
                        },
                        timeManagement: {
                            availValues: ['stopwatch', 'countdown','disable']
                        },


                    }
            }

        },
    }
</script>
<style>

</style>
