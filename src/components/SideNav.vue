<template>
    <v-card
            height="400"
            width="256"

            color="primary"
    >
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    {{ appName }}
                </v-list-item-title>
                <v-list-item-subtitle>

                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list
                dense
                nav
        >
            <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    :to="item.path"
            >

                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>

                        <v-list-item-title>
                            {{ item.title }}
                        </v-list-item-title>

                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
    export default {
        name: 'SideNav',
        props: ['appName'],
        data() {
            return {
                items: [
                    {title: 'Home', icon: 'dashboard', path: '/'},
                    {title: 'Practice', icon: 'question_answer', path: '/questions'},
                    {title: 'Report', icon: 'assessment', path: '/report'},
                    {title: 'Logs', icon: 'message', path: '/logs'},
                    {title: 'Settings', icon: 'settings', path: '/settings'},
                    {title: 'About', icon: 'image', path: '/about'},

                ],
                right: true,


            }
        },
    }
</script>
