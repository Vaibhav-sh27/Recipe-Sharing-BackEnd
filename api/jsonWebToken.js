const jwt = require('jsonwebtoken');
let genrateToken = function (data) {
    let finalData = JSON.stringify(data);
    let token = jwt.sign(finalData, "VAIBHAV");
    return token;
}
module.exports=genrateToken;