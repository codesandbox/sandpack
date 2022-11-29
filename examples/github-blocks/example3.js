import _ from "lodash";

var array = [1];
var other = _.concat(array, 2, [3], [[4]]);

console.log(other);
