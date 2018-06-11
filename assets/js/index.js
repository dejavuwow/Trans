(function (doc, win) {
  var docEl = doc.documentElement,
  resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  recalc = function () {
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    if(clientWidth==375){
      docEl.style.fontSize = '50px';
    }else{
      docEl.style.fontSize = 50 * (clientWidth / 375) + 'px';
    }
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
// var mySwiper = new Swiper('.swiper-container', {
//   autoplay: 5000,//可选选项，自动滑动
//   autoplayDisableOnInteraction : false,//兼容手机端滑动
//   loop:true,//让轮播滚动
//   pagination : '.swiper-pagination',
//   paginationClickable :true,
// })
