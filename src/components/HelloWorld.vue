<template>
    <b-container>

    </b-container>
</template>

<script>
import axios from "axios";
import math from "mathjs";

export default {
  name: "HelloWorld",
  data() {
    return {
      data: [
        {
          id: "1",
          value: "Давлат-хуқуқий фаолият",
          weight: 0.3,
          students: []
        },
        {
          id: "2",
          value: "Халқаро-хуқуқий фаолият",
          weight: 0.2,
          students: []
        },
        {
          id: "3",
          value: "Фуқоролик-хуқуқий фаолият",
          weight: 0.2,
          students: []
        },
        {
          id: "4",
          value: "Жиноий-хуқуқий фаолият",
          weight: 0.15,
          students: []
        },
        {
          id: "5",
          value: "Тадбиркорлик -хуқуқий фаолият",
          weight: 0.15,
          students: []
        }
      ],
      students: [],
      quantiles: [],
      msg: "Welcome to Your Vue.js App"
    };
  },
  created() {
    axios.get("http://localhost/api/api.php").then(response => {
      this.students = response.data
        .sort(function(a, b) {
          return b.ball - a.ball;
        })
        .filter(student => student.lang == "");

      this.quantiles = this.quartileBounds(
        this.students.map(student => student.ball)
      );
      var i = 4;

      for (var index in this.students) {
        if (this.students[index].ball == this.quantiles[i - 1]) i--;
        if (!this.quantiles[i][0]) this.quantiles[i] = [];
        this.quantiles[i].push(this.students[index]);
      }

      console.log(Math.round(this.quantiles[0].length));

      // console.log(Math.round(this.quantiles[0].length*0.30) + Math.round(this.quantiles[0].length*0.20)+
      //   Math.round(this.quantiles[0].length*0.20) + Math.round(this.quantiles[0].length*0.15) +
      //   Math.round(this.quantiles[0].length*0.15)
      // )
      // console.log(this.quantiles[0].length)
      for (var index in this.quantiles[0]) {
        // if (this.quantiles[0][index]["ch1"] == this.data[0]["id"])
        //   this.data[0]["id"].students.push(this.quantiles[0][index]);
        // else if (this.quantiles[0][index]["ch2"] == this.data[1]["id"])
        //   this.data[1].students.push(this.quantiles[1][index]);
        // else if (this.quantiles[0][index]["ch3"] == this.data[2]["id"])
        //   this.data[2].students.push(this.quantiles[2][index]);
        // else if (this.quantiles[0][index]["ch4"] == this.data[3]["id"])
        //   this.data[3].students.push(this.quantiles[3][index]);
        // else if (this.quantiles[0][index]["ch5"] == this.data[4]["id"])
        //   this.data[4].students.push(this.quantiles[4][index]);
      }
    });
  },
  watch: {
    students: function() {}
  },
  methods: {
    quartileBounds(_sample) {
      // find the median as you did
      var _median = math.median(_sample);

      // split the data by the median
      var _firstHalf = _sample.filter(function(f) {
        return f < _median;
      });
      var _secondHalf = _sample.filter(function(f) {
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
h1,
h2 {
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
