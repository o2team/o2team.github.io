(function($){

  var picArr = [
      'cnt.png', 
      'cp.png', 
      'flz.png', 
      'gl.png', 
      'hfz.png', 
      'hjl.png', 
      'hl.png', 
      'hmj.png', 
      'hyy.png', 
      'lex.png', 
      'lf.png', 
      'lhm.png', 
      'lqn.png', 
      'ltt.png', 
      'lwl.png', 
      'lwt.png', 
      'lyx.png', 
      'mj.png', 
      'pxw.png', 
      'wbh.png', 
      'wcn.png', 
      'wql.png', 
      'www.png', 
      'xxl.png', 
      'ykg.png', 
      'yly.png', 
      'zhuyt.png', 
      'zmh.png', 
      'ztz.png', 
      'zyt.png', 
      'IMG_6587_cnt.png', 
      'IMG_6634_cp.png', 
      'IMG_6401_flz.png', 
      'IMG_6417_gl.png', 
      'IMG_6414_hfz.png', 
      'IMG_6549_hjl.png', 
      'IMG_6490_hl.png', 
      'IMG_6494_hl.png', 
      'IMG_6380_hmj.png', 
      'IMG_6559_hyy.png', 
      'IMG_6363_lex.png', 
      'IMG_6638_lf.png', 
      'IMG_6640_lf.png', 
      'IMG_4829_lhm.png', 
      'IMG_6405_lhm.png', 
      'IMG_6412_lqn.png', 
      'IMG_6460_ltt.png', 
      'IMG_6360_lwl.png', 
      'IMG_6581_lwt.png', 
      'IMG_6628_lyx.png', 
      'IMG_6604_mj.png', 
      'IMG_6615_pxw.png', 
      'IMG_6486_wbh.png', 
      'IMG_6573_wcn.png', 
      'IMG_6576_wcn.png', 
      'IMG_6394_wql.png', 
      'IMG_6580_www.png', 
      'IMG_6515_xxl.png', 
      'IMG_6471_ykg.png', 
      'IMG_6435_yly.png', 
      'IMG_6565_zyt.png', 
      'IMG_6569_zmh.png', 
      'IMG_6526_ztz.png', 
      'IMG_6509_zyt.png'
  ];

  var picWall = {
    doc: window.document, 
    wall: document.querySelector('#J_picWallCanvas'), 
    wallWrap: document.querySelector('#J_picWall'), 
    picArr: picArr, 
    srcPrefix: '//misc.aotu.io/o2/avatars/',
    picSize: 80, 
    navi: navigator.userAgent.toLowerCase().match(/mobile/), 

    init: function(){
      var self = this;

      self.picSize = (!!self.navi)?40:80;
      self.drawPic();
      window.addEventListener('resize', function(){
        self.drawPic();
      });
    }, 

    drawPic: function(){
      var self = this, 
        arr = [], 
        picFArr = [], 
        img = [],
        num = self.picArr.length, 
        width = window.document.documentElement.clientWidth, 
        height = self.wallWrap.offsetHeight, 
        column = Math.ceil(width / self.picSize), 
        row = Math.ceil(height/self.picSize), 
        total = column * row, 
        repeat = Math.ceil(total / num), 
        canvas = self.wall, 
        ctx = canvas.getContext('2d');

      self.wall.style.width = width + 'px';
      self.wall.style.height = height + 'px';

      self.wall.width = width;
      self.wall.height = height;

      // 生成打乱数组
      for(var re=0; re<repeat; re++){
        for(var i=0;i<num;i++){
          arr[i]=i;
        }
        arr.sort(function (){return 0.5 - Math.random()});
        for(var j=0; j<num; j++){
          var tag = arr[j];
          picFArr[num*re + j]=self.picArr[tag];
          // picFArr[num*re + j]=tag;
        }
      }

      // 将照片画上画布
      for(var r=1; r<=row; r++){
        for(var c=1; c<=column; c++){
          (function (c, r) {
            var dr = (c-1) * row + r - 1,
              posX = (c - 1) * self.picSize, 
              posY = (r - 1) * self.picSize;
            img[dr] = new Image();
            img[dr].addEventListener('load', (function(){
              img[dr].src = self.srcPrefix + picFArr[dr];
              if(!img[dr].complete){
                return function () {
                    ctx.drawImage(img[dr], posX, posY, self.picSize, self.picSize);
                  };
              }
              ctx.drawImage(img[dr], posX, posY, self.picSize, self.picSize);
            }()));
          })(c, r);
        }
      }
    }
};


picWall.init();

})(jQuery);