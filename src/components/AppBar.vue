<template>
    <v-container>
        <v-row

        >
            <v-toolbar-title
                    id="app-bar-title"
            >
                {{currentRouteName}}
            </v-toolbar-title>

            <v-spacer></v-spacer>


            <v-menu>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>dots-vertical</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item
                            v-for="n in 5"
                            :key="n"
                            @click="() => {}"
                    >
                        <v-list-item-title>Option {{ n }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'AppBar',
        props: ['appName'],
        computed: {

            currentRouteName (){
                // let name = this.$route.name;
                // if (name === 'Question'){
                //     name = name + " - "
                // }
                // return name;
                return this.$route.name
            }
        },
        methods: {

        },
        data() {
            return {}
        },
    }
</script>
<style>
    #app-bar-title {
        line-height: 2.5;
    }
</style>
