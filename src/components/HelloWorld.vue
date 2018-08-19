<template>
    <b-container fluid>
        <circle8 size="60" v-show="dataLoading"></circle8>
        <b-row>
            <b-col md="2" sm="12">

                <b-form-radio-group id="btnradios1" buttons v-model="selectedLang" :options="langs"
                                    name="radiosBtnDefault">
                </b-form-radio-group>
            </b-col>
            <b-col md="5" sm="12">
                <b-form-radio-group id="btnradios1" buttons v-model="selectedGroup" :options="groups"
                                    name="radiosBtnDefault">
                </b-form-radio-group>
            </b-col>
            <b-col md="3" sm="12">
                <b-form-select v-model="selectedCourse" :options="courses" class="mb-3"/>
            </b-col>
            <b-col md="1" sm="12">
                <download-excel v-if="dataFilter" :data="dataFilter">
                    <b-button variant="success">Export to Excel</b-button>
                </download-excel>
            </b-col>
        </b-row>
        <br>
        <b-row>
            <b-col cols="12" v-if="selectedGroup && students[selectedGroup-1]">
                Guruhdagi talabalar soni: {{students[selectedGroup-1].size}}<br>
                Kursdagi talabalar soni (<strong>{{courses[selectedCourse-1].text}}</strong>): {{students[selectedGroup-1].course[selectedCourse-1].students.length}}<br>
            </b-col>
            <b-col cols="12" v-if="selectedGroup==0">
                Kursdagi jami talabalar soni (<strong>{{courses[selectedCourse-1].text}} </strong>): {{ dataFilter.length }}
            </b-col>
            <b-col cols="12">
                <b-table v-if="dataFilter" bordered striped hover :items="dataFilter"
                         :sort-by.sync="sortBy"
                         :sort-desc.sync="sortDesc"
                         :fields="table_columns">
                    <template slot="index" slot-scope="data">
                        {{data.index + 1}}
                    </template>
                    <template slot="choice" slot-scope="data">
                        <span v-if="selectedCourse == data.item.ch1">1</span>
                        <span v-if="selectedCourse == data.item.ch2">2</span>
                        <span v-if="selectedCourse == data.item.ch3">3</span>
                        <span v-if="selectedCourse == data.item.ch4">4</span>
                        <span v-if="selectedCourse == data.item.ch5">5</span>
                    </template>
                </b-table>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
    import Api from "../api/index"
    import math from "mathjs";

    export default {
        name: "HelloWorld",
        data() {
            return {
                dataLoading: true,
                sortBy: 'ball',
                sortDesc: true,
                table_columns: [
                    {label: '#', key: 'index'},
                    {label: 'F.I.O', key: 'fio', sortable: true},
                    {label: 'Tanlov', key: 'choice'},
                    {label: 'Ball', key: 'ball', sortable: true}
                ],
                langs: [
                    {text: 'РУС', value: 'РУС'},
                    {text: 'УЗБ', value: ''}
                ],
                selectedLang: '',
                selectedCourse: 1,
                groups: [
                    {text: 'Barchasi', value: '0'},
                    {text: 'Guruh-1', value: '1'},
                    {text: 'Guruh-2', value: '2'},
                    {text: 'Guruh-3', value: '3'},
                    {text: 'Guruh-4', value: '4'},
                ],
                selectedGroup: 1,
                courses:
                    [
                        {
                            value: "1",
                            text: "Жиноий-хуқуқий фаолият",
                            weight: 0.30,
                            students: []
                        },
                        {
                            value: "2",
                            text: "Давлат-хуқуқий фаолият",
                            weight: 0.20,
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
                            text: "Тадбиркорлик -хуқуқий фаолият",
                            weight: 0.15,
                            students: []
                        },
                        {
                            value: "3",
                            text: "Халқаро-хуқуқий фаолият",
                            weight: 0.15,
                            students: []
                        }
                    ],
                students: [],
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
            Api.get("api.php").then(response => {
                this.dataLoading = false

                // sort and get Uzbek group students
                if (response.data.length > 0) {
                    this.courses = response.data[0]
                    this.tempData = response.data[1]
                }

            }).catch(error => {
                console.log(error)
            });
        },
        computed: {
            dataFilter: function () {
                if (this.tempData) {
                    let data = this.tempData.sort(function (a, b) {
                        return parseFloat(b.ball) - parseFloat(a.ball);
                    }).filter(student => student.lang == this.selectedLang);

                    // get Quntile borders
                    let quantiles = this.quartileBounds(
                        data.map(student => student.ball)
                    )

                    //spit into 4 groups by quantile
                    this.students = JSON.parse(JSON.stringify(this.studentsTemplate))

                    for (var index in data) {
                        if(data[index].ball <= parseFloat(quantiles[3]) && data[index].ball >= parseFloat(quantiles[2])){
                            this.students[0].data.push(data[index])
                            this.students[0].size += 1
                        }
                        else if(data[index].ball < parseFloat(quantiles[2]) && data[index].ball >= parseFloat(quantiles[1])){
                            this.students[1].data.push(data[index])
                            this.students[1].size += 1
                        }
                        else if(data[index].ball < parseFloat(quantiles[1]) && data[index].ball >= parseFloat(quantiles[0])){
                            this.students[2].data.push(data[index])
                            this.students[2].size += 1
                        }
                        else{
                            this.students[3].data.push(data[index]);
                            this.students[3].size += 1
                        }
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

                    // add students to the right courses
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

                    if (this.selectedGroup > 0)
                        return this.students[this.selectedGroup - 1].course[this.selectedCourse - 1].students
                    else {
                        let courses = []
                        this.students.map(function (student) {
                            student.course.map(function (course, index) {
                                if (!courses[index]) {
                                    courses[index] = []
                                    courses[index] = course
                                }
                                else {
                                    if (courses[index].students)
                                        courses[index].students = courses[index].students.concat(course.students)
                                }
                            })
                        })
                        return courses[this.selectedCourse - 1].students
                    }

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
.spinner{
    position: absolute;
    top: 50%;
    left: 50%;
}
</style>
