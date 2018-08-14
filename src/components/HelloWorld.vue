<template>
    <b-container fluid>
        <b-row>
            <b-col cols="2">

                <b-form-radio-group id="btnradios1" buttons v-model="selectedLang" :options="langs"
                                    name="radiosBtnDefault">
                </b-form-radio-group>
            </b-col>
            <b-col cols="4">
                <b-form-radio-group id="btnradios1" buttons v-model="selectedGroup" :options="groups"
                                    name="radiosBtnDefault">
                </b-form-radio-group>
            </b-col>
            <b-col cols="3">
                <b-form-select v-model="selectedCourse" :options="courses" class="mb-3"/>
            </b-col>
        </b-row>
        <br>
        <b-row>
            <!--{{students[selectedGroup-1]}}-->


                <!--<div v-for="course in students[0].course[0]">-->
                <!--<datatable class="b-table b-table-bordered" :columns="table_columns" :data="course.students"></datatable>-->
            <b-col v-if="students[selectedGroup-1]">
                Total number of Students: {{students[selectedGroup-1].size}}<br>
                Total number of Students: {{students[selectedGroup-1].course[selectedCourse-1].students.length}}<br>
            </b-col>
                <!--<b-table bordered striped hover :items="students[0].course[selectedCourse-1].students"-->
                <b-table bordered striped hover :items="dataFilter"
                         :fields="table_columns">
                    <template slot="index" slot-scope="data">
                        {{data.index + 1}}
                    </template>
                    <template slot="name" slot-scope="data">
                        {{data.value.first}} {{data.value.last}}
                    </template>
                </b-table>
                <!--</div>-->
                <!--{{students[0].course[selectedCourse].students}}-->
                <!--</b-col>-->
        </b-row>

    </b-container>
</template>

<script>
    import axios from "axios";
    import math from "mathjs";
    // import datatable from "DatatableFactory"
    export default {
        name: "HelloWorld",
        data() {
            return {
                table_columns: [
                    'index',
                    {label: 'F.I.O', key: 'fio'},
                    {label: 'Ball', key: 'ball'}
                ],
                langs: [{text: 'Рус', value: 'РУС'}, {text: 'УЗБ', value: ''}],
                selectedLang: '',
                selectedCourse: 1,
                groups: [
                    {text: 'Guruh-1', value: '1'},
                    {text: 'Guruh-1', value: '2'},
                    {text: 'Guruh-2', value: '3'},
                    {text: 'Guruh-3', value: '4'},
                ],
                selectedGroup: 1,
                courses:
                    [
                        {
                            value: "1",
                            text: "Давлат-хуқуқий фаолият",
                            weight: 0.3,
                            students: []
                        },
                        {
                            value: "2",
                            text: "Халқаро-хуқуқий фаолият",
                            weight: 0.2,
                            students: []
                        },
                        {
                            value: "3",
                            text: "Фуқоролик-хуқуқий фаолият",
                            weight: 0.2,
                            students: []
                        },
                        {
                            value: "4",
                            text: "Жиноий-хуқуқий фаолият",
                            weight: 0.15,
                            students: []
                        },
                        {
                            value: "5",
                            text: "Тадбиркорлик -хуқуқий фаолият",
                            weight: 0.15,
                            students: []
                        }
                    ],
                students:[],
                studentsTemplate: [
                    {"data": [], size: 0, course: {}},
                    {"data": [], size: 0, course: {}},
                    {"data": [], size: 0, course: {}},
                    {"data": [], size: 0, course: {}}
                ],
                tempData: '',
                msg: "Welcome to Your Vue.js App"
            }
        },
        created() {
            axios.get("http://176.58.120.4/api/students.php").then(response => {

                // sort and get Uzbek group students

                if(response.data.length>0) this.tempData = response.data

            }).catch(error=>{
                console.log(error)
            });
        },
        computed: {
            dataFilter: function () {
                if (this.tempData) {
                    let data = this.tempData.sort(function (a, b) {
                        return b.ball - a.ball;
                    }).filter(student => student.lang == this.selectedLang);

                    // get Quntile borders
                    let quantiles = this.quartileBounds(
                        data.map(student => student.ball)
                    )

                    //spit into 4 groups by quantile
                    var i = 4;
                    this.students = JSON.parse(JSON.stringify(this.studentsTemplate))

                    for (var index in data) {
                        if (data[index].ball == quantiles[i - 1]) i--;
                        this.students[i].data.push(data[index]);
                        this.students[i].size += 1
                    }


                    // set course length
                    this.students = this.students.map(student => {
                        student.course = this.courses.map(obj => {
                            var rObj = JSON.parse(JSON.stringify(obj))
                            rObj.weight = Math.round(rObj.weight * student.size)
                            return rObj
                        })
                        return student
                    })

                    this.students.map(group => {
                        var rGroup = {}
                        Object.assign(rGroup, group)

                        rGroup.data.map(student => {
                            if (rGroup.course[student.ch1 - 1].weight > rGroup.course[student.ch1 - 1].students.length)
                                rGroup.course[student.ch1 - 1].students.push(student)
                            else if (rGroup.course[student.ch2 - 1].weight > rGroup.course[student.ch2 - 1].students.length)
                                rGroup.course[student.ch2 - 1].students.push(student)
                            else if (rGroup.course[student.ch3 - 1].weight > rGroup.course[student.ch3 - 1].students.length)
                                rGroup.course[student.ch3 - 1].students.push(student)
                            else if (rGroup.course[student.ch4 - 1].weight > rGroup.course[student.ch4 - 1].students.length)
                                rGroup.course[student.ch4 - 1].students.push(student)
                            else if (rGroup.course[student.ch5 - 1].weight > rGroup.course[student.ch5 - 1].students.length)
                                rGroup.course[student.ch5 - 1].students.push(student)
                            else {
                                // console.log(student)
                            }
                        })
                    })
                    // console.log(this.students)

                    return this.students[this.selectedGroup - 1].course[this.selectedCourse - 1].students
                }
            }
        },
        watch: {},
        methods: {
            quartileBounds(_sample) {
                // find the median as you did
                var _median = math.median(_sample);

                // split the data by the median
                var _firstHalf = _sample.filter(function (f) {
                    return f < _median;
                });
                var _secondHalf = _sample.filter(function (f) {
                    return f >= _median;
                });

                // find the medians for each split
                var _25percent = math.median(_firstHalf);
                var _75percent = math.median(_secondHalf);

                var _50percent = _median;
                var _100percent = math.max(_secondHalf);

                // this will be the upper bounds for each quartile
                return [_25percent, _50percent, _75percent, _100percent];
            }
        }
    };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
