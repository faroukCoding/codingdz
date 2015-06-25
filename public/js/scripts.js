var ScrollContainerType=ScrollContainerType||{};ScrollContainerType.SCROLL="scroll",ScrollContainerType.SLIDER="slider",define("ScrollContainer",["Gesture","messageBus"],function(a,b){var c=function(c,d,e,f,g){function h(){y.interactive=!0,y.mousedown=y.touchstart=j,y.mouseup=y.touchend=k,b.addEventListener("renderer:mouseleave",i)}function i(a){k()}function j(a){b.emit("searchBar:blur"),v=a,T=!0,x=r.update(e),TweenLite.killTweensOf(this),y.dispatchEvent({type:"down"})}function k(){if(T=!1,y.dispatchEvent({type:"up"}),setTimeout(function(){E||b.emit("ScrollContainer:StopMoving")},100),F==ScrollContainerType.SLIDER){var a=v.getLocalPosition(z),c=x.x-a.x,d=c>0?1:-1;u.x>10||Math.abs(c)>w.width*R&&0>d?this._prev(!0):u.x<-10||Math.abs(c)>w.width*R&&d>0?this._next(!0):this._goto(P,Q,!0)}}var l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A=.4,B=.95,C=.7,D=.25,E=!1,F=c,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=.5,R=1.5,S={},T=!1;PIXI.DisplayObjectContainer.call(this),PIXI.EventTarget.call(this),z=d,o=e,w=f||new PIXI.Rectangle,y=this,l=g,m=e?e.width:0,n=e?e.height:0,G=0,q=new PIXI.Graphics,q.beginFill(16711680,0),q.drawRect(0,0,1,1),q.endFill(),y.addChild(q),F==ScrollContainerType.SLIDER&&(this._slides=function(a){N=a},this._next=function(a){O<N.length-2?O++:O=N.length-1,this._goto(O,Q,a)},this._prev=function(a){O>0?O--:O=0,this._goto(O,Q,a)},this._goto=function(a,b,c){(P!==a||c)&&(p=-N[a].x+(w.width>>1),P=O=a,TweenLite.to(this,b||Q,{x:p,onCompleteParams:[P],onComplete:function(a){t&&t(a)}}),s&&s(P))},this._viewPort=function(a){w=a,this._goto(P,.25,!0)}),this._viewRect=function(a){q.scale.x=m=a.width,q.scale.y=n=a.height,F==ScrollContainerType.SLIDER&&this._goto(P,.25,!0)},this._update=function(a){return p=r.update(a),L+=(p.y-this._lastMouseDownPoint.y)*A,M+=(p.x-this._lastMouseDownPoint.x)*A,this._lastMouseDownPoint=p,L*=C,M*=C,F===ScrollContainerType.SLIDER&&(u=MathUtils.getMovement(S,v.getLocalPosition(z))),p},this._back=function(){H=this.position.y,I=this.position.x,J=0,K=0,o&&(H>G||n<=w.height?J=-H*D:H+n<w.height&&(J=(w.height-n-H)*D),I>G||m<=w.width?K=-I*D:I+m<w.width&&(K=(w.width-m-I)*D)),Math.abs(L)<=.2&&(L=0),Math.abs(M)<=.2&&(M=0),L*=B,M*=B,"y"!=l&&(this.position.y+=Math.round(L+J)),"x"!=l&&(this.position.x+=Math.round(M+K)),0===Math.abs(M)&&0===Math.abs(L)||E!==!1||(b.emit("ScrollContainer:StartMoving"),E=!0),Math.abs(M)<=0&&Math.abs(L)<=0&&E===!0&&(b.emit("ScrollContainer:StopMoving"),E=!1)},this._onChange=function(a){s=a},this._onAfterChange=function(a){t=a},this.isDown=function(){return T},this.type=function(){return F},this._currentID=function(){return P},this._transitionTime=function(a){Q=a},this._touchable=function(a){y.interactive=a,r.drag(z,this)},this._margeToSlide=function(a){R=a},this.progress=function(){var a=-(this.position.y/(n-w.height));a=0>=a?0:a>=1?1:a,this.progressCallBack&&this.progressCallBack(a)},r=new a(l),r.drag(z,this),this.position.x=0,this.position.y=0,h()};return c.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),c.prototype.onChange=function(a){this._onChange(a)},c.prototype.onAfterChange=function(a){this._onAfterChange(a)},c.prototype.next=function(){this._next()},c.prototype.prev=function(){this._prev()},c.prototype.goTo=function(a){this._goto(a)},c.prototype.setSlides=function(a){this._slides(a)},c.prototype.viewRect=function(a){this._viewRect(a)},c.prototype.viewPort=function(a){this._viewPort(a)},c.prototype.setTransitionTime=function(a){this._transitionTime(a)},c.prototype.touchable=function(a){this._touchable(a)},c.prototype.setMargeToSlide=function(a){this._margeToSlide(a)},c.prototype.upDate=function(a){return this._update(a)},c.prototype.back=function(){this._back()},c.prototype.scroll=function(a){this.isDown()?this.upDate(a):this.type()==ScrollContainerType.SCROLL&&this.back(),this.progressCallBack&&(_oldY!==this.position.y&&this.progress(),_oldY=this.position.y)},c.prototype.progress=function(){this.progress()},c.prototype.onProgress=function(a){this.progressCallBack=a},c.prototype.dispose=function(){this._dispose()},c}),define("autocomplete",["components/services"],function(a){var b=new a,c=function(a){var c=this;this.el=a,this.$el=$(this.el),this.$el.typeahead({minLength:3,items:5,highlighter:function(a){var b="";return b+="<span class='typeahead-item'>",b+="<span class='typeahead-picture'>",b+="<img src='"+a.face.picture+"' alt='' />",b+="</span>",b+="<span class='typeahead-label-wrapper'>",b+="<span class='typeahead-label'>"+a.toString(),b+="</span>",b+="<br />",b+="<span class='typeahead-number'>Face number : "+a.face.number+"</span>",b+="</span>",b+="</span>"},afterSelect:function(){c.$el.closest("form").submit()},source:function(a,c){return console.log("autocomplete","source",arguments),b.searchFaces(a,function(a,b){var d=[];return _.each(a,function(a){var b=new String(a.accountname);b.face=a,d.push(b)}),c(d)})}})};return c}),define("btnSocial",function(){var a=function(a,b,c,d,e,f){PIXI.DisplayObjectContainer.call(this);var g,h;this.isHide=!1,f=f||60,g=new PIXI.Graphics,g.beginFill(16711680,0),g.drawRect(0,0,d||30,e||30),g.endFill(),g.interactive=!0,g.buttonMode=!0,g.tap=g.click=c,h=new PIXI.Text(a,{font:f+"px fontello",fill:b||"#FFFFFF"}),h.x=g.width/2-h.width/2,h.y=g.height/2-h.width/2,h.pivot.x=h.pivot.y=-h.width/2,h.scale.x=h.scale.y=.5,this._btn=g,this._text=h,this.addChild(g),this.addChild(h)};return a.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),a.constructor=a.prototype.constructor,a.prototype.enable=function(a,b){var a,b;a=a||.25,b=b||0,this._btn.interactive=this._btn.buttonMode=!0,TweenLite.to(this,a,{alpha:1,delay:b})},a.prototype.hideElement=function(){this.visible=!1,this.isHide=!0},a.prototype.showElement=function(){this.visible=!0,this.isHide=!1},a.prototype.disable=function(a,b){var a,b;a=a||.25,b=b||0,this._btn.interactive=this._btn.buttonMode=!1,TweenLite.to(this,a,{alpha:.1,delay:b})},a}),define("cacheControl",function(){_cached={};var a=function(){};return a.prototype.checkFromCache=function(a){return a in _cached},a.prototype.getFromCache=function(a){return _cached[a]},a.prototype.cache=function(a,b){_cached[a]=b},a}),define("colorMapping",function(){_mapping={0:5592405};var a=function(){};return a.prototype.getColorByBoxNumber=function(a){var b=5592405;for(var c in _mapping)a>1*c&&(b=_mapping[c]);return b},new a}),define("fontIcons",function(){var a=function(a,b){var c=document.createElement("div");c.style.fontFamily=a,c.innerHTML=b,document.body.appendChild(c),setTimeout(function(){document.body.removeChild(c)},100)},b={};return b.load=function(){a(b.FONT_NAME,b.FACEBOOK)},b.FONT_NAME="fontello",b.FACEBOOK=Tools.hexDecode("e802"),b.FACEBOOK_1=Tools.hexDecode("e809"),b.FACEBOOK_SQUARED=Tools.hexDecode("e800"),b.FACEBOOK_CIRCLED=Tools.hexDecode("e801"),b.TWITTER=Tools.hexDecode("e803"),b.TWITTER_1=Tools.hexDecode("e806"),b.TWITTER_2=Tools.hexDecode("e807"),b.TWITTER_SQUARED=Tools.hexDecode("e804"),b.TWITTER_CIRCLED=Tools.hexDecode("e805"),b.TWITTER_RECT=Tools.hexDecode("e808"),b.HOME=Tools.hexDecode("e80a"),b.MAIL=Tools.hexDecode("e80c"),b.MAIL_ALT=Tools.hexDecode("e80b"),b.MAIL_1=Tools.hexDecode("e80d"),b.MAIL_2=Tools.hexDecode("e80e"),b.RIGHT_OPEN_BIG=Tools.hexDecode("e80f"),b.LEFT_OPEN_BIG=Tools.hexDecode("e810"),b.UP_OPEN_BIG=Tools.hexDecode("e811"),b.DOWN_OPEN_BIG=Tools.hexDecode("e812"),b.RIGHT_OPEN=Tools.hexDecode("e815"),b.LEFT_OPEN=Tools.hexDecode("e814"),b.UP_OPEN=Tools.hexDecode("e816"),b.DOWN_OPEN=Tools.hexDecode("e813"),b.RIGHT=Tools.hexDecode("e819"),b.LEFT=Tools.hexDecode("e818"),b.UP=Tools.hexDecode("e81a"),b.DOWN=Tools.hexDecode("e817"),b.RIGHT_CIRCLE=Tools.hexDecode("e81d"),b.LEFT_CIRCLE=Tools.hexDecode("e81c"),b.UP_CIRCLE=Tools.hexDecode("e81e"),b.DOWN_CIRCLE=Tools.hexDecode("e81b"),b.RIGHT_CIRCLE_1=Tools.hexDecode("e821"),b.LEFT_CIRCLE_1=Tools.hexDecode("e820"),b.UP_CIRCLE_1=Tools.hexDecode("e822"),b.DOWN_CIRCLE_1=Tools.hexDecode("e81f"),b.SEARCH=Tools.hexDecode("e823"),b.SEARCH_1=Tools.hexDecode("e824"),b.SEARCH_2=Tools.hexDecode("e825"),b.SEARCH_3=Tools.hexDecode("e827"),b.SEARCH_4=Tools.hexDecode("e828"),b.SEARCH_OUTLINE=Tools.hexDecode("e826"),b.FOOD=Tools.hexDecode("e829"),b.OK_SQUARED=Tools.hexDecode("e82a"),b.CANCEL_SQUARED=Tools.hexDecode("e82b"),b.MAP=Tools.hexDecode("e82c"),b.MAP_1=Tools.hexDecode("e82d"),b.LOCATION=Tools.hexDecode("e82e"),b.LOCATION_CIRCLED=Tools.hexDecode("e82f"),b.load(),b}),define("Gesture",[],function(){function a(a,b){return{x:b.x-a.x>=0?b.x-a.x:b.x-a.x,y:b.y-a.y>=0?b.y-a.y:b.y-a.y}}var b=function(a){var b=this;b._constraintAxe=a,b._isDown=!1,b._target=null,b._domElement=null,b._inc={x:0,y:0},b._pos={x:0,y:0},_move={x:0,y:0},_mouse={x:0,y:0},b.onMove=function(a){_mouse=a.getLocalPosition(this),b._pos=_mouse},b.onDown=function(a){_mouse=a.getLocalPosition(this),b.initPosItem(),b._isDown=!0},b.onUp=function(a){_mouse=a.getLocalPosition(this),b._isDown=!1,this._target&&(b._target.oldx=b._target.position.x,b._target.oldy=b._target.position.y)},b.initPosItem=function(){this._target&&(b._pos=_mouse,b._target.oldPos.x=b._target.position.x,b._target.oldPos.y=b._target.position.y,b._target.startPoint.x=b._pos.x,b._target.startPoint.y=b._pos.y,b._target._lastMouseDownPoint=b._pos)}};return b.prototype.drag=function(a,b,c){a.mousedown=a.touchstart=this.onDown,a.mouseup=a.touchend=this.onUp,a.mousemove=a.touchmove=this.onMove,this._target=b,this._moveCallBack=c,this._target&&(this._target.oldPos={x:this._target.position.x,y:this._target.position.y},this._target.startPoint={x:0,y:0},this.initPosItem(),this._isDown=!0)},b.prototype.update=function(b){if(this._target){if(this._isDown){this._inc.x=this._pos.x,this._inc.y=this._pos.y,_move=a(this._target.startPoint,this._inc);var c=Math.round(_move.x+this._target.oldPos.x);"x"!=this._constraintAxe&&(b?0>=c?this._target.position.y=0:c>=b.width-this._target.width?this._target.position.x=b.width-this._target.width:this._target.position.x=c:this._target.position.x=c,this._moveCallBack&&this._moveCallBack(),this._oldx=this._target.position.x);var d=Math.round(_move.y+this._target.oldPos.y);"y"!=this._constraintAxe&&(b?0>=d?this._target.position.y=0:d>=b.height-this._target.height?this._target.position.y=b.height-this._target.height:this._target.position.y=d:this._target.position.y=d,this._moveCallBack&&this._moveCallBack(),this._oldy=this._target.position.y)}return this._pos}},b}),define("mapCursor",function(){var a=function(){PIXI.DisplayObjectContainer.call(this),this.number=new PIXI.DisplayObjectContainer,this.cursor=new PIXI.DisplayObjectContainer,this.numberText=new PIXI.Text("1",{font:"40px Proxima",fill:"#000000"}),this.numberText.scale.x=this.numberText.scale.y=.5,this.numberBackground=new PIXI.Graphics,this.numberBackground.clear(),this.numberBackground.beginFill(16776960,1),this.numberBackground.drawRect(0,0,100,30),this.numberBackground.endFill(),this.cursorIcon=new PIXI.Graphics,this.cursorIcon.clear(),this.cursorIcon.beginFill(65535,1),this.cursorIcon.drawRect(0,0,30,50),this.cursorIcon.endFill(),this.cursorIcon.interactive=this.cursorIcon.buttonMode=!0,this.cursorShadow=new PIXI.Graphics,this.cursorShadow.clear(),this.cursorShadow.beginFill(0,1),this.cursorShadow.drawCircle(0,0,30),this.cursorShadow.endFill(),this.cursorShadow.position.x=15,this.cursorShadow.position.y=60,this.pivot.y=90,this.numberBackground.pivot.x=50,this.cursor.pivot.x=15,this.unDragging(),this.addChild(this.number),this.addChild(this.cursor),this.cursor.addChild(this.cursorShadow),this.cursor.addChild(this.cursorIcon),this.number.addChild(this.numberBackground),this.number.addChild(this.numberText)};return a.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),a.constructor=a.prototype.constructor,a.prototype.dragging=function(){TweenLite.to(this.cursorShadow.scale,.25,{x:1,y:.5}),TweenLite.to(this.cursorShadow,.25,{opacity:.2}),TweenLite.to(this.number,.25,{alpha:1}),TweenLite.to(this.number.position,.25,{y:-40}),TweenLite.to(this.cursor.position,.25,{y:-10})},a.prototype.unDragging=function(){TweenLite.to(this.cursorShadow.scale,.25,{x:.3,y:.15}),TweenLite.to(this.cursorShadow,.25,{opacity:.5}),TweenLite.to(this.number,.25,{alpha:0}),TweenLite.to(this.number.position,.25,{y:-30}),TweenLite.to(this.cursor.position,.25,{y:-0})},a.prototype.setNumber=function(a){this.numberFace=a,this.numberText.setText(this.numberFace),this.numberText.pivot.x=this.numberText.width/2},a}),define("messageBus",function(){var a={};return PIXI.EventTarget.call(a),a}),define("pagination",["messageBus"],function(a){var b=function(a){var b=this;this.$el=$(a),this.$label=this.$el.find(".search-pagination-label"),this.$buttonPrev=this.$el.find(".search-pagination-button-prev"),this.$buttonNext=this.$el.find(".search-pagination-button-next"),this.data=[],this.current=0,this.length=0,this.setData(),this.$buttonPrev.on("mousedown",function(a){a.preventDefault(),b.previous()}),this.$buttonNext.on("mousedown",function(a){a.preventDefault(),b.next()})};return b.prototype.reset=function(){this.setData([])},b.prototype.setData=function(a){return this.data=a||[],this.length=this.data.length,this.current=0,this.el={},this.update()},b.prototype.next=function(){return this.setNextIndex(),this.update()},b.prototype.previous=function(){return this.setPrevIndex(),this.update()},b.prototype.getCurrent=function(){return this.el},b.prototype.update=function(){return this.el=this.data[this.current],this.el&&(Backbone.history.navigate("number/"+this.el.number,{trigger:!1}),a.emit("map:gotoFaceNumber",{number:this.el.number,directly:!1})),this.updatePaginationButtons(),this.el},b.prototype.setPrevIndex=function(){return this.current--,this.current<0&&(this.current=this.length-1),this.current},b.prototype.setNextIndex=function(){return this.current++,this.current>=this.length&&(this.current=0),this.current},b.prototype.updatePaginationButtons=function(){this.setPaginationLabel(this.current),this.length>1?this.showPaginationButtons():this.hidePaginationButtons()},b.prototype.setPaginationLabel=function(){this.length>0?this.$label.text(this.current+1+"/"+this.length):this.$label.text("")},b.prototype.showPaginationButtons=function(){this.$buttonPrev.addClass("is-active"),this.$buttonNext.addClass("is-active")},b.prototype.hidePaginationButtons=function(){this.$buttonPrev.removeClass("is-active"),this.$buttonNext.removeClass("is-active")},b}),define("searchBar",["messageBus","components/services","pagination","autocomplete"],function(a,b,c,d){var e=new b,f="",g=function(b){var e=this;this.pagination=new c("#search-field-pagination"),this.autocomplete=new d("#search-field"),this.$field=$("#search-field"),this.$form=$("#form-search"),this.$reset=this.$form.find(".search-reset"),this.$buttonSubmit=this.$form.find(".search-submit"),this.$field.on("keyup change blur focus",function(a){var b=e.$field.val();""!==b?e.enableReset():e.disableReset()}),this.$buttonSubmit.on("click",function(){e.$form.submit()}),a.on("searchBar:blur",function(){e.$field.blur()}),this.$form.on("submit",function(a){a.preventDefault();var c=e.$field.val();return f!==c||1*c>=0?(b.blurAfterSubmit===!0&&e.$field.blur(),e.submit(a,c),e._submitCallback&&e._submitCallback(a,c),void(f=c)):void e.pagination.next()}),this.$reset.on("mousedown",function(){e.reset()})};return g.prototype.enableReset=function(){this.$reset.addClass("is-active"),this.$form.addClass("extended")},g.prototype.disableReset=function(){this.$reset.removeClass("is-active"),this.$form.removeClass("extended")},g.prototype.reset=function(a){this.$field.val(""),this.disableReset(),this.pagination.reset(),f=""},g.prototype.submit=function(b,c){var d=this;1*c>=0?(Backbone.history.navigate("number/"+1*c,{trigger:!1}),a.emit("map:gotoFaceNumber",{number:1*c,directly:!1}),d.pagination.reset()):c.length>2&&e.searchFaces(c,function(a,b){d.pagination.setData(a),console.log("SEARCH RESULTS",a)})},g.prototype.onSubmit=function(a){this._submitCallback=a},g}),define("components/services",["cacheControl","messageBus"],function(a,b){var c=new a,d=function(){this.getFacesByRange=function(a,d){var e,f="/api/faces_by_range/"+a.toString();c.checkFromCache(f)?d(c.getFromCache(f)):e=$.getJSON(f).done(function(a){d(a),c.cache(f,a),b.emit("main:hideLoader")}).fail(function(a,c,d){var e=c+", "+d;console.log("Request Failed: "+e),b.emit("main:hideLoader")})},this.getFaces=function(a,b,d){var e="/api/faces_by_number/"+a;c.checkFromCache(e)?b(c.getFromCache(e),d,a):$.getJSON(e,{id:d}).done(function(f){b(f,d,a),c.cache(e,f)}).fail(function(a,b,c){var d=b+", "+c;console.log("Request Failed: "+d)})},this.searchFaces=function(a,b){var d="/api/faces/search/"+a;c.checkFromCache(d)?(console.log("from cache",c.getFromCache(d)),b(c.getFromCache(d),a)):$.getJSON(d).done(function(e){b(e,a),c.cache(d,e)}).fail(function(a,b,c){var d=b+", "+c;console.log("Request Failed: "+d)})}};return d}),define("bloc",["blocIthem"],function(a){var b=function(b,c,d,e){function f(){for(var d=0,e=0,f=0;j>f;f++){for(var k=0;i>k;k++)h=new a(b,c),h.x=d,h.y=e,g.addChild(h),n[m]=h,m++,d+=b;d=0,e+=c}}PIXI.DisplayObjectContainer.call(this),PIXI.EventTarget.call(this);var g,h,i=d,j=e,k=i*b,l=j*c,m=0,n=[];g=this,g._width=k,g._height=l,f(),this.setValue=function(a){for(var b=0;b<a.length;b++)if(a[b].number>=0&&n[b]){var c=a[b].number,d=main.martixRange[c];n[b].update(d),n[b].updateImage(d.picture)}},this.process=function(){},this.resize=function(a,b){}};return b.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),b.prototype.process=function(){this.process()},b.prototype.resize=function(a,b){this.resize(a,b)},b}),define("blocIthem",["fontIcons","btnSocial","messageBus","colorMapping"],function(a,b,c,d){var e=function(e,f){function g(){u=new PIXI.DisplayObjectContainer,E=new PIXI.Graphics,q(0),v=new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture)),v.x=Math.round((e-J)/2),v.y=Math.round((f-K)/2),w=new PIXI.Text("#",{font:"11px Proxima",fill:"#aaaaaa"}),w.rotation=90*Math.PI/180,w.x=e+1,w.y=10,y=new b(a.FACEBOOK_SQUARED,"#3a5795",j,null,null,40),y.x=10,y.y=f-10-y.height,z=new b(a.TWITTER_SQUARED,"#55acee",i,null,null,40),z.x=e-10-z.width,z.y=f-10-z.height,A=new b(a.HOME,"#00FFFF",h),A.x=e/2-15,A.y=(f+30)/2-15,B=new b(a.OK_SQUARED,"#00EE00",r),B.x=e/2-35,B.y=(f+30)/2-15,C=new b(a.CANCEL_SQUARED,"#EE0000",s),C.x=e/2+5,C.y=(f+30)/2-15,c.addEventListener("ScrollContainer:StartMoving",function(){z.disable(.25,0),y.disable(.25,0),B.disable(.25,0),C.disable(.25,0)}),c.addEventListener("ScrollContainer:StopMoving",function(){var a=Math.random()/3;z.enable(.25,a),y.enable(.25,a),B.enable(.25,a),C.enable(.25,a)}),c.on("blocItem:setUnselected",n),c.on("blocItem:setSelected",o),c.on("ScrollContainer:StartMoving",m),H=l(),t.mousedown=t.touchstart=k,t.addChild(E),t.addChild(u),t.addChild(w),u.addChild(v),u.addChild(y),u.addChild(z),u.addChild(A),u.addChild(B),u.addChild(C)}function h(a){Backbone.history.navigate("/share/"+D,{trigger:!0})}function i(a){parent.location="/auth/twitter/register/"+D}function j(a){parent.location="/auth/facebook/register/"+D}function k(){m(),I=setTimeout(function(){G&&(Backbone.history.navigate("profile/"+F.accountname,{trigger:!0}),o(F.number),c.emit("map:gotoFaceNumber",{number:F.number,directly:!1}))},L)}function l(){var a=new TimelineLite;return a.to(u,.5,{alpha:.3}),a.to(u.scale,.5,{x:.5,y:.5},0),a.to(u.position,.5,{x:J/4,y:J/4},0),a.pause(),a}function m(){clearTimeout(I),c.emit("blocItem:setUnselected")}function n(){H.reverse()}function o(a){var b=a;"object"==typeof a&&(b=a.data.number),b===F.number&&H.play()}function p(a){a=""+a;var b="000000";return b.substring(0,b.length-a.length)+a}function q(a){var b=d.getColorByBoxNumber(a);E.clear(),E.beginFill(b,1),E.drawRect(0,0,e,f),E.endFill()}function r(a){parent.location="/auth/twitter/claim/"+F.accountname}function s(a){parent.location="/auth/twitter/decline/"+F.accountname}var t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J=e-20,K=f-20,L=500;PIXI.DisplayObjectContainer.call(this),t=this,g(),this.process=function(){},this.resize=function(a,b){},this.hideSocials=function(){y.hideElement(),z.hideElement()},this.showSocials=function(){y.showElement(),z.showElement()},this.hideShare=function(){A.hideElement()},this.showShare=function(){A.showElement()},this.hideClaims=function(){B.hideElement(),C.hideElement()},this.showClaims=function(){B.showElement(),C.showElement()},this.setInteractive=function(a){G=a,t.interactive=a,t.buttonMode=a},this.setShare=function(a){this[a?"showShare":"hideShare"]()},this.setSocials=function(a){this[a?"showSocials":"hideSocials"]()},this.setClaim=function(a){this[a?"showClaims":"hideClaims"]()},this.update=function(a){F=a,D=x=F.number,this.setInteractive(F.accountname&&!(F.claim===!1&&!main.currentUser)),this.setSocials("undefined"==typeof F.claim&&!main.currentUser),this.setClaim(F.claim===!1&&!main.currentUser),this.setShare(main.currentUser&&!F.accountname),q(D),w.setText(p(1*x)),v.texture.destroy(),v.texture=new PIXI.Texture(new PIXI.BaseTexture)},this.updateImage=function(a){var b=new PIXI.ImageLoader(a);b.onLoaded=function(){var b=new PIXI.Texture(PIXI.Texture.fromImage(a));v.texture.destroy(),v.setTexture(b),v.width=J,v.height=K},b.load()}};return e.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),e.prototype.process=function(){this.process()},e.prototype.resize=function(a,b){this.resize(a,b)},e});var main=main||{};define("main",["map","messageBus","searchBar"],function(a,b,c){var d=function(d){function e(){w=new PIXI.Stage(0),x={view:M,transparent:!1,resolution:window.devicePixelRatio||1},y=PIXI.autoDetectRecommendedRenderer(0,0,x),M||document.body.appendChild(y.view),h(),b.on("main:hideLoader",f),b.on("main:showLoader",g),y.view.addEventListener("mouseleave",function(a){b.emit("renderer:mouseleave")})}function f(){O||TweenLite.to(P,.25,{opacity:0,delay:1,onComplete:function(){TweenLite.set(P,{display:"none"}),O=!0}})}function g(){O&&TweenLite.fromTo(P,.25,{display:"block",opacity:0},{opacity:1,onComplete:function(){O=!1}})}function h(){i(),Tools.loadFont(["Proxima"],l)}function i(){u=new PIXI.DisplayObjectContainer,w.addChild(u)}function j(){console.log("INIT PAGES"),main.stage=w,main.view=y.view,main.resolution=window.devicePixelRatio||1,main.textResolution=2,main.fonts={Proxima:"Proxima"},main.martixRange=[],z=new a,u.addChild(z)}function k(){console.log("INIT EVENTS"),window.addEventListener("resize",main.onResize),main.onResize(null)}function l(){new c({blurAfterSubmit:!1}),console.log("<< start >>"),console.log("DATA:",N),j(),k(),requestAnimFrame(o),N.editedFace&&editFace(),m(),n(),G&&p()}function m(){}function n(){var a=Backbone.Router.extend({routes:{"edit/":"edit","success/":"success","share/:number":"share","number/:number":"number","login/":"login"},edit:function(a){console.log("BACKBONE EDIT",a),s()},success:function(a){console.log("BACKBONE EDIT",a),t()},login:function(a){console.log("BACKBONE LOGIN",a),q()},share:function(a){console.log("BACKBONE SHARE",a),r(a)},logout:function(a){console.log("BACKBONE EDIT",a)},number:function(a){console.log("BACKBONE NUMBER",a),b.emit("map:gotoFaceNumber",{number:a,directly:!1})}}),c=new a;$(".modal").on("hide.bs.modal",function(a){c.navigate("",{trigger:!1,replace:!0})}),console.log("ROUTER START",Backbone.history.start),Backbone.history.start({pushState:!1})}function o(){requestAnimFrame(o),y.render(w),z&&z.process&&z.process(),G&&v.update()}function p(){v=new Stats,v.domElement.style.position="absolute",v.domElement.style.top="0px",v.domElement.style.left="0px",v.domElement.style.opacity="0.5",document.body.appendChild(v.domElement)}function q(){$(".modal-login").modal("show")}function r(a){$(".js-share-url").val("http://stark-plateau-2977.herokuapp.com/number/"+a),$(".js-share-iframe").attr("src","/share/"+a),$(".modal-share").modal("show")}function s(){$(".modal-edit").modal("show")}function t(){$("#edit-user").data("register","true"),$(".modal-edit").modal("show")}console.log("<< Kamal::main >>");var u,v,w,x,y,z,A,B,C,D,E,F,G=!0,H=!1,I=1280,J=800,K=2048,L=1536,M=d[0],N=d[1],O=!1,P=$(".loading-container").get(0);main.currentUser=N.currentUser,main.onResize=function(){C=window.innerHeight,D=window.innerWidth,H&&"desktop"==Tools.getDevice()&&(D>=I&&(D=I),C>=J&&(C=J),E=window.innerWidth-D>>1,F=window.innerHeight-C>>1),A=D/K,B=C/L,z&&z.resize&&z.resize(D,C,A,B,E,F),y.resize(D,C),y.view.style.width=D+"px",y.view.style.height=C+"px",window.scrollTo(0,0)},e()};return d}),define("map",["ScrollContainer","bloc","components/services","messageBus","minimap"],function(a,b,c,d,e){var f=function(){function f(){var c,f;for(c=0;Q>c;c++)for(f=0;R>f;f++){for(var j=[],l=0;S>l;l++)j.push({number:$,picture:"img/"+parseInt(MathUtils.randomMinMax(1,10))+".jpg"}),main.martixRange[$]={number:$,picture:"/img/"+parseInt(MathUtils.randomMinMax(1,10))+".jpg"},$++;Z[f+","+c]=j}x=new a(ScrollContainerType.SCROLL,main.stage),y=new e(X,Y,D,E,V,W),x.addEventListener("down",g),x.addEventListener("up",i),v.addChild(x),v.addChild(y),h();var m=0,o=0,r=[];for(c=0;K>c;c++){for(f=0;J>f;f++)w=new b(D,E,U,T),B[L]=w,w.idX=w.initidX=f,w.idY=w.initidY=c,w.lock0=w.lock1=!0,r.push({blocId:L,range:p(f,c)}),w.x=m,w.y=o,x.addChild(w),m+=w._width,m>=M&&(M=m),L++;m=0,o+=B[L-1]._height,o>N&&(N=o)}O=w._width,P=w._height,k(),q(r),d.on("map:gotoFaceNumber",n)}function g(a){k(),clearTimeout(aa),aa=setTimeout(function(){d.emit("ScrollContainer:StartMoving")},250)}function h(){var a,b;a=20,b=window.innerHeight-Y-20,y.position.x=a,y.position.y=b}function i(){clearTimeout(aa)}function j(){for(var a,b,c=!1,d=[],e=0;e<B.length;e++)a=x.y+B[e].y,a>A?(B[e].y-=N,B[e].idY>=K?B[e].idY-=K:B[e].idY=Q+B[e].initidY-K,d.push({blocId:e,range:p(B[e].idX,B[e].idY)}),c=!0):-P>a&&x.y+(B[e].y+N)<=A&&(B[e].y+=N,B[e].idY<=Q-1-K?B[e].idY+=K:B[e].idY=B[e].initidY,d.push({blocId:e,range:p(B[e].idX,B[e].idY)}),c=!0),b=x.x+B[e].x,b>z?(B[e].x-=M,B[e].idX>=J?B[e].idX-=J:B[e].idX=R+B[e].initidX-J,d.push({blocId:e,range:p(B[e].idX,B[e].idY)}),c=!0):-O>b&&x.x+(B[e].x+M)<=z&&(B[e].x+=M,B[e].idX<=R-1-J?B[e].idX+=J:B[e].idX=B[e].initidX,d.push({blocId:e,range:p(B[e].idX,B[e].idY)}),c=!0);c&&q(d),ca&&da()}function k(){for(var a=0;a<B.length;a++)B[a].oldPos={x:B[a].position.x,y:B[a].position.y}}function l(a,b,c){var d,e,f,g,h,i={x:0,y:0},j=Math.round(-window.innerWidth/2)+Math.round(D/2),k=Math.round(-window.innerHeight/2)+Math.round(E/2);a=a*-D-j,b=b*-E-k,c===!0?e=0:(f=m(a,b),d=MathUtils.distance(x,f),e=Math.max(F,Math.min(G,d/1e3))),g=e===G,g?(i.x=.05*(f.x-x.position.x),i.y=.05*(f.y-x.position.y),h=new TimelineLite,h.to(x,.5,{alpha:0},0).to(x.position,1,{x:"+="+i.x,y:"+="+i.y,ease:Cubic.easeOut},0).to(x,0,{x:f.x-i.x,y:f.y-i.y,ease:Cubic.easeOut}).to(x,2,{x:f.x,y:f.y,delay:1,ease:Cubic.easeOut}).to(x,.5,{alpha:1},"-=1")):TweenLite.to(x,e,{x:f.x,y:f.y,ease:Cubic.easeOut})}function m(a,b){var c={x:{n:0},y:{n:0}};c.x.n=Math[a>=0?"floor":"ceil"](a/V),c.y.n=Math[b>=0?"floor":"ceil"](a/V);var d=Math.min(a+c.x.n*V-V,a+c.x.n*V,a+(c.x.n+1)*V),e=Math.min(b+c.y.n*W-W,b+c.y.n*W,b+(c.y.n+1)*W);return d=Math.abs(a+(c.x.n-1)*V)<Math.abs(a+c.x.n*V)?a+(c.x.n-1)*V:Math.abs(a+c.x.n*V)<Math.abs(a+(c.x.n+1)*V)?a+c.x.n*V:a+(c.x.n+1)*V,e=Math.abs(b+(c.y.n-1)*W)<Math.abs(b+c.y.n*W)?b+(c.y.n-1)*W:Math.abs(b+c.y.n*W)<Math.abs(b+(c.y.n+1)*W)?b+c.y.n*W:b+(c.y.n+1)*W,{x:d,y:e}}function n(a){var b=!1,c=a;"object"==typeof a&&(c=a.data.number,b=a.data.directly);var d,e;c=Math.max(H,Math.min(I,c)),d=Math.round(c%1e3),e=Math.floor(c/1e3),l(d,e,o(c)?!1:b)}function o(a){var b=!1;return _.each(B,function(c){var d=p(c.idX,c.idY);_.each(d,function(c){c.number===a&&(b=!0)})}),b}function p(a,b){return Z[a+","+b]}function q(a){var b,c,d,e,f,g,h=[];if(a.length){for(b=0,c=a.length;c>b;b++)for(g=a[b].blocId,f=a[b].range,d=0,e=f.length;e>d;d++)h.push(f[d].number);h.length&&(ea(),ba.getFacesByRange(h,s))}}function r(){var a,b=Math.round(window.innerWidth/D/2),c=Math.round(window.innerHeight/E/2),d=V/D,e=W/E,f=Math.round(Math.abs(x.position.x%V/D)),g=Math.round(Math.abs(x.position.y%W/E));return f=x.position.x>0?d-f:f,g=x.position.y>0?e-g:g,f+=b,g+=c,f=f>=d?f-d:f,g=g>=e?g-e:g,a=g*e+f}function s(a){u(a),t()}function t(){_.each(B,function(a){a.setValue(p(a.idX,a.idY))})}function u(a){for(var b=0;b<a.length;b++)a[b].picture&&(main.martixRange[a[b].number]=a[b])}var v,w,x,y,z,A,B=[],C=window.screen.width>1600?.5:"desktop"==Tools.getDevice()?1:2,D="desktop"===Tools.getDevice()?180:190,E="desktop"===Tools.getDevice()?180:190,F=1,G=13,H=0,I=1e6-1,J=2,K=window.screen.width>1600?8:window.screen.width>1024?5:4,L=0,M=0,N=0,O=0,P=0,Q=1e3,R=100*C,S=10/C,T=1,U=10/C,V=R*S*D,W=Q*E,X=D,Y=E,Z=[],$=0,aa=null,ba=new c,ca=!1,da=_.throttle(function(){y.updateCursorPosition(r())},1e3),ea=_.throttle(function(){t()},1e3);d.on("ScrollContainer:StartMoving",function(){ca=!0}),d.on("ScrollContainer:StopMoving",function(){ca=!1}),PIXI.DisplayObjectContainer.call(this),v=this,f(),this.process=function(){x&&(x.scroll(),y.process(),j())},this.resize=function(a,b){h(),z=a,A=b}};return f.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),f.prototype.process=function(){this.process()},f.prototype.resize=function(a,b){this.resize(a,b)},f}),define("minimap",["fontIcons","messageBus","btnSocial","mapCursor"],function(a,b,c,d){var e,f,g,h,i,j,k,l,m=function(b,k,l,m,n,o){PIXI.DisplayObjectContainer.call(this),e=b,f=k,g=n,h=o,i=l,j=m,this.mapDisplayed=!1,this.isDragging=!1,this.canDrag=!0,this.dragTimer=null,this.button=new PIXI.DisplayObjectContainer,this.map=new PIXI.DisplayObjectContainer,this.cursor=new d,this.button.x=0,this.button.y=f-40,this.map.x=0,this.map.y=m-40,this.map.pivot.y=m,this.bgIcon=new PIXI.Graphics,this.bgIcon.clear(),this.bgIcon.beginFill(255,1),this.bgIcon.drawRect(0,0,40,40),this.bgIcon.endFill(),this.icon=new c(a.MAP_1,"#FFFFFF",_.bind(this.toggleMap,this)),this.icon.x=5,this.icon.y=5,this.background=new PIXI.Graphics,this.background.clear(),this.background.beginFill(65280,1),this.background.drawRect(0,0,e,f),this.background.endFill(),this.map.interactive=!0,this.cursor.cursorIcon.interactive=this.cursor.cursorIcon.buttonMode=!0,this.cursor.cursorIcon.mousedown=this.cursor.cursorIcon.touchstart=_.bind(this.onDown,this),window.addEventListener("mouseup",_.bind(this.onUp,this)),window.addEventListener("touchend",_.bind(this.onUp,this)),window.addEventListener("mouseleave",_.bind(this.onUp,this)),this.hideMap(),this.cursor.position.x=0,this.cursor.position.y=0,this.addChild(this.button),this.addChild(this.map),this.addChild(this.cursor),this.button.addChild(this.bgIcon),this.button.addChild(this.icon),this.map.addChild(this.background)};return m.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),m.constructor=m.prototype.constructor,m.prototype.updateCursorPosition=function(a){this.canDrag&&(l!==a&&(this.cursor.setNumber(a),this.setCursorPositionByNumber(a)),l=a)},m.prototype.onDown=function(a){k=a,this.isDragging=!0,this.cursor.dragging()},m.prototype.onUp=function(a){this.isDragging&&(this.isDragging=!1,this.canDrag=!1,this.cursor.unDragging(),clearTimeout(this.dragTimer),this.dragTimer=setTimeout(_.bind(function(){this.canDrag=!0},this),5e3),b.emit("map:gotoFaceNumber",{number:this.cursor.numberFace,directly:!1}))},m.prototype.onMove=function(a){if(this.isDragging){var b=a.getLocalPosition(this.background);this.cursor.position.x=Math.min(e,Math.max(0,b.x)),this.cursor.position.y=Math.min(f,Math.max(0,b.y)),b=this.cursor.position;var c=b.x/e,d=b.y/f,k=Math.round(g/i*c)-1,l=Math.round(h/j*d),m=l>0?l*(h/j)+k-h/j:k;this.cursor.setNumber(Math.max(0,m))}},m.prototype.setCursorPositionByNumber=function(a){var b={x:0,y:0},c=g/i,d=g/i,h=Math.round(a/c),j=Math.round(a%d);b.x=j/c*e,b.y=h/d*f,this.cursor.position.x=b.x,this.cursor.position.y=b.y},m.prototype.displayMap=function(){this.mapDisplayed=!0,TweenLite.to(this.map.scale,.25,{x:1,y:1}),TweenLite.to(this.map,.25,{alpha:1}),TweenLite.to(this.cursor,.25,{alpha:1,delay:.15})},m.prototype.hideMap=function(){this.mapDisplayed=!1,TweenLite.to(this.map.scale,.25,{x:0,y:0,delay:.15}),TweenLite.to(this.map,.25,{alpha:0,delay:.15}),TweenLite.to(this.cursor,.25,{
alpha:0})},m.prototype.toggleMap=function(){this[this.mapDisplayed?"hideMap":"displayMap"]()},m.prototype.process=function(){this.onMove(k)},m.prototype.resize=function(){},m});
//# sourceMappingURL=scripts.js.map