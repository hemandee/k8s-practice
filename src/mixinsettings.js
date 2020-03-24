export default {


    methods: {

        updateSettingsTheme(value){
            try {
                this.$store.dispatch("actionUpdateSettingsTheme", value)
            } catch (e) {
                this.log('ERROR','Unable to update Theme'+ e)
            }
        },
        updateTimeManagement(value){

            try {
                this.$store.dispatch("actionUpdateTimeManagement", value)
            } catch (e) {
                this.log('ERROR','Unable to update Time Mangment '+ e)
            }
        },
        updateActivityLogs(value){
            try {
                this.$store.dispatch("actionUpdateActivityLogs", Boolean(value))
            } catch (e) {
                this.log('ERROR','Unable to update Activity Log '+ e)
            }
        },
        updateCountDownCustomTimeUp(value){
            try {
                this.$store.dispatch("actionUpdateCountDownCustomTimeUp", value)
            } catch (e) {
                this.log('ERROR','Unable to update CountDown Time '+ e)
            }
        },
        updateStopwatchCustomWarningTime( value) {

            try {
                this.$store.dispatch("actionUpdateStopwatchCustomWarningTime", value)
            } catch (e) {
                this.log('ERROR','Unable to update Stopwatch Time '+ e)
            }
        },
        btnReset(){
            try {
                this.$store.dispatch('actionReset')
            } catch (e) {
                this.log('ERROR','Unable to reset '+ e)
            }
        },
        btnClearAttempt(){
            try {
                this.$store.dispatch('actionResetAttempt')
            } catch (e) {
                this.log('ERROR','Unable to Clear '+ e)
            }
        },
        updateViewTags(val){

            try {
                this.$store.dispatch('actionUpdateViewTags', Boolean(val))
            } catch (e) {
                this.log('ERROR','Unable to update Tags '+ e)
            }
        }

    }
}