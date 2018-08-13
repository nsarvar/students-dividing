<template>
    <b-container>

    </b-container>
</template>

<script>
    import axios from "axios"
    import math from "mathjs"

    export default {
        name: 'HelloWorld',
        data() {
            return {
                students: [],
                quantiles: [],
                msg: 'Welcome to Your Vue.js App'
            }
        },
        created() {
            axios.get('http://localhost/students/api.php').then(response => {
                this.students = response.data.sort(function (a, b) {
                    return b.ball - a.ball
                }).filter(student => student.lang == '')
                this.quantiles = this.quartileBounds(this.students.map(student => student.ball))
            })
        },
        watch: {
            students: function () {

            }
        },
        methods: {
            quartileBounds(_sample) {
                // find the median as you did
                var _median = math.median(_sample)

                // split the data by the median
                var _firstHalf = _sample.filter(function (f) {
                    return f < _median
                })
                var _secondHalf = _sample.filter(function (f) {
                    return f >= _median
                })

                // find the medians for each split
                var _25percent = math.median(_firstHalf);
                var _75percent = math.median(_secondHalf);

                var _50percent = _median;
                var _100percent = math.max(_secondHalf);

                // this will be the upper bounds for each quartile
                return [_25percent, _50percent, _75percent, _100percent];
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
