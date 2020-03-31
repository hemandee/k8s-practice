<!--suppress ALL -->
<template>

    <v-container>
       <h2>Welcome to K8-Practice!</h2>
        <p>Let's get started press Start! </p>
        <div class="my-2">
            <v-btn
                    left
                    small
                    color="accent"
                    @click="onClickStart"
            >Start</v-btn>
        </div>

    </v-container>

</template>

<script>
    import mxins from "../mxins";

    export default {
        name: 'Home',
        mixins: [mxins],
        methods: {
            onClickStart(){
                try {
                    this.$router.push({name: 'Practice Questions'}).catch(err=> this.log('ERROR','Unable to navigate' + err))
                }catch (e){
                    console.log('Unable to navigate to Questions', e)
                }
            }
        },
        data: () => ({
            kubeconfigFile: null,
        }),
    }
</script>

<style>
    html {
        overflow-y: hidden
    }
</style>