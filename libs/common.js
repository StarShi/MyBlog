/**
 * Created by Administrator on 2017/11/27.
 */
const crypto = require("crypto");

module.exports ={
    MD5_SUFFIX:"haskjdl234aHSAHK2342324362LDJK&#%^&Ljlsha543yhdio#@%$jhfds@?43@12342353",
    md5: function (str) {
        var obj = crypto.createHash("md5");
        obj.update(str);
        return obj.digest("hex");
    }
}