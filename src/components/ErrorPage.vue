<template>
    <v-container
            class="text-center"
            fill-height

    >
        <v-row align="top-center">
            <v-col>
                <h1 class="display-2 primary--text">Whoops, 404</h1>

                <p>The page you were looking for does not exist</p>

                <v-btn
                        :to="`/`"
                        color="primary"

                >
                    Go Home!
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import mxins from "../mxins";

    export default {
        name: "ErrorPage",
        mixins: [mxins],
        mounted() {
            this.log('ERROR', this.errormsg)
        },
        data: function () {
            return {
                errormsg: '404 Page Not Found'
            }
        }
    }
</script>

<style scoped>

</style>