var beanImgUrl = "http://otsnwem87.bkt.clouddn.com/bean.png";

var request = require("request.js");

var domain = request.getDomain();

var buttonImg = domain+"/imgs/buttons.png";
var button2Img = domain+"/imgs/button.png";
module.exports = {
  beanImgUrl: beanImgUrl,
  buttonImg: buttonImg,
  button2Img: button2Img
}