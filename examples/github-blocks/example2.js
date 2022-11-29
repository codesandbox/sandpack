import _ from "lodash";

const compact = _.compact([0, 1, false, 2, "", 3]);
console.log(compact);
