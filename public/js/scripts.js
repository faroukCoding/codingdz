var ScrollContainerType=ScrollContainerType||{};ScrollContainerType.SCROLL="scroll",ScrollContainerType.SLIDER="slider",define("ScrollContainer",["Gesture"],function(a){var b=function(b,c,d,e,f){function g(){w.interactive=!0,w.mousedown=w.touchstart=h,w.mouseup=w.touchend=i}function h(a){t=a,Q=!0,v=p.update(d),TweenLite.killTweensOf(this),w.dispatchEvent({type:"down"})}function i(){if(Q=!1,C==ScrollContainerType.SLIDER){var a=t.getLocalPosition(x),b=v.x-a.x,c=b>0?1:-1;s.x>10||Math.abs(b)>u.width*O&&0>c?this._prev(!0):s.x<-10||Math.abs(b)>u.width*O&&c>0?this._next(!0):this._goto(M,N,!0)}}var j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y=.4,z=.95,A=.7,B=.25,C=b,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=.5,O=1.5,P={},Q=!1;PIXI.DisplayObjectContainer.call(this),PIXI.EventTarget.call(this),x=c,m=d,u=e||new PIXI.Rectangle,w=this,j=f,k=d?d.width:0,l=d?d.height:0,D=0,o=new PIXI.Graphics,o.beginFill(16711680,0),o.drawRect(0,0,1,1),o.endFill(),w.addChild(o),C==ScrollContainerType.SLIDER&&(this._slides=function(a){K=a},this._next=function(a){L<K.length-2?L++:L=K.length-1,this._goto(L,N,a)},this._prev=function(a){L>0?L--:L=0,this._goto(L,N,a)},this._goto=function(a,b,c){(M!==a||c)&&(n=-K[a].x+(u.width>>1),M=L=a,TweenLite.to(this,b||N,{x:n,onCompleteParams:[M],onComplete:function(a){r&&r(a)}}),q&&q(M))},this._viewPort=function(a){u=a,this._goto(M,.25,!0)}),this._viewRect=function(a){o.scale.x=k=a.width,o.scale.y=l=a.height,C==ScrollContainerType.SLIDER&&this._goto(M,.25,!0)},this._update=function(a){return n=p.update(a),I+=(n.y-this._lastMouseDownPoint.y)*y,J+=(n.x-this._lastMouseDownPoint.x)*y,this._lastMouseDownPoint=n,I*=A,J*=A,C===ScrollContainerType.SLIDER&&(s=MathUtils.getMovement(P,t.getLocalPosition(x))),n},this._back=function(){E=this.position.y,F=this.position.x,G=0,H=0,m&&(E>D||l<=u.height?G=-E*B:E+l<u.height&&(G=(u.height-l-E)*B),F>D||k<=u.width?H=-F*B:F+k<u.width&&(H=(u.width-k-F)*B)),Math.abs(I)<=.2&&(I=0),Math.abs(J)<=.2&&(J=0),I*=z,J*=z,"y"!=j&&(this.position.y+=Math.round(I+G)),"x"!=j&&(this.position.x+=Math.round(J+H))},this._onChange=function(a){q=a},this._onAfterChange=function(a){r=a},this.isDown=function(){return Q},this.type=function(){return C},this._currentID=function(){return M},this._transitionTime=function(a){N=a},this._touchable=function(a){w.interactive=a,p.drag(x,this)},this._margeToSlide=function(a){O=a},this.progress=function(){var a=-(this.position.y/(l-u.height));a=0>=a?0:a>=1?1:a,this.progressCallBack&&this.progressCallBack(a)},p=new a(j),p.drag(x,this),this.position.x=0,this.position.y=0,g()};return b.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),b.prototype.onChange=function(a){this._onChange(a)},b.prototype.onAfterChange=function(a){this._onAfterChange(a)},b.prototype.next=function(){this._next()},b.prototype.prev=function(){this._prev()},b.prototype.goTo=function(a){this._goto(a)},b.prototype.setSlides=function(a){this._slides(a)},b.prototype.viewRect=function(a){this._viewRect(a)},b.prototype.viewPort=function(a){this._viewPort(a)},b.prototype.setTransitionTime=function(a){this._transitionTime(a)},b.prototype.touchable=function(a){this._touchable(a)},b.prototype.setMargeToSlide=function(a){this._margeToSlide(a)},b.prototype.upDate=function(a){return this._update(a)},b.prototype.back=function(){this._back()},b.prototype.scroll=function(a){this.isDown()?this.upDate(a):this.type()==ScrollContainerType.SCROLL&&this.back(),this.progressCallBack&&(_oldY!==this.position.y&&this.progress(),_oldY=this.position.y)},b.prototype.progress=function(){this.progress()},b.prototype.onProgress=function(a){this.progressCallBack=a},b.prototype.dispose=function(){this._dispose()},b}),define("Gesture",[],function(){function a(a,b){return{x:b.x-a.x>=0?b.x-a.x:b.x-a.x,y:b.y-a.y>=0?b.y-a.y:b.y-a.y}}var b=function(a){var b=this;b._constraintAxe=a,b._isDown=!1,b._target=null,b._domElement=null,b._inc={x:0,y:0},b._pos={x:0,y:0},_move={x:0,y:0},_mouse={x:0,y:0},b.onMove=function(a){_mouse=a.getLocalPosition(this),b._pos=_mouse},b.onDown=function(a){_mouse=a.getLocalPosition(this),b.initPosItem(),b._isDown=!0},b.onUp=function(a){_mouse=a.getLocalPosition(this),b._isDown=!1,this._target&&(b._target.oldx=b._target.position.x,b._target.oldy=b._target.position.y)},b.initPosItem=function(){this._target&&(b._pos=_mouse,b._target.oldPos.x=b._target.position.x,b._target.oldPos.y=b._target.position.y,b._target.startPoint.x=b._pos.x,b._target.startPoint.y=b._pos.y,b._target._lastMouseDownPoint=b._pos)}};return b.prototype.drag=function(a,b,c){a.mousedown=a.touchstart=this.onDown,a.mouseup=a.touchend=this.onUp,a.mousemove=a.touchmove=this.onMove,this._target=b,this._moveCallBack=c,this._target&&(this._target.oldPos={x:this._target.position.x,y:this._target.position.y},this._target.startPoint={x:0,y:0},this.initPosItem(),this._isDown=!0)},b.prototype.update=function(b){if(this._target){if(this._isDown){this._inc.x=this._pos.x,this._inc.y=this._pos.y,_move=a(this._target.startPoint,this._inc);var c=Math.round(_move.x+this._target.oldPos.x);"x"!=this._constraintAxe&&(b?0>=c?this._target.position.y=0:c>=b.width-this._target.width?this._target.position.x=b.width-this._target.width:this._target.position.x=c:this._target.position.x=c,this._moveCallBack&&this._moveCallBack(),this._oldx=this._target.position.x);var d=Math.round(_move.y+this._target.oldPos.y);"y"!=this._constraintAxe&&(b?0>=d?this._target.position.y=0:d>=b.height-this._target.height?this._target.position.y=b.height-this._target.height:this._target.position.y=d:this._target.position.y=d,this._moveCallBack&&this._moveCallBack(),this._oldy=this._target.position.y)}return this._pos}},b}),define("components/services",[],function(){var a=function(){this.getFaces=function(a,b,c){$.getJSON("http://localhost:3000/api/faces",{x:a,y:b}).done(function(a){c(a)}).fail(function(a,b,c){var d=b+", "+c;console.log("Request Failed: "+d)})}};return a}),define("bloc",["blocIthem"],function(a){var b=function(){function b(){for(var b=0,i=0,j=0;h>j;j++){for(var m=0;g>m;m++)d=new a,d.x=b,d.y=i,c.addChild(d),l[k]=d,k++,b+=e;b=0,i+=f}}PIXI.DisplayObjectContainer.call(this),PIXI.EventTarget.call(this);var c,d,e=256,f=256,g=4,h=3,i=g*e,j=h*f,k=0,l=[];c=this,c._width=i,c._height=j,b(),this.setValue=function(a){for(var b=0;b<a.length;b++){var c=a[b].txt,d=a[b].img+"?n="+1e6*Math.random();l[b].update("ID:"+c),l[b].updateImage(d)}},this.process=function(){},this.resize=function(a,b){}};return b.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),b.prototype.process=function(){this.process()},b.prototype.resize=function(a,b){this.resize(a,b)},b}),define("blocIthem",[],function(){var a=function(){function a(){var a=new PIXI.Graphics;a.beginFill(0,1),a.lineStyle(1,16777215),a.drawRect(2,2,e-4,f-4),a.endFill(),b.addChild(a),c=new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture)),d=new PIXI.Text("No",{font:"25px Proxima",fill:"#ffffff"}),b.addChild(c)}var b,c,d,e=256,f=256;PIXI.DisplayObjectContainer.call(this),b=this,a(),this.process=function(){},this.resize=function(a,b){},this.update=function(a){c.texture.destroy(),c.texture=new PIXI.Texture(new PIXI.BaseTexture)},this.updateImage=function(a){c.texture.destroy(),c.texture=new PIXI.Texture(PIXI.Texture.fromImage(a))}};return a.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),a.prototype.process=function(){this.process()},a.prototype.resize=function(a,b){this.resize(a,b)},a});var main=main||{};define("main",["map","components/services"],function(a,b){var c=function(c){function d(){n=new PIXI.Stage(0),o={view:D,transparent:!1,resolution:window.devicePixelRatio||1},p=PIXI.autoDetectRecommendedRenderer(0,0,o),D||document.body.appendChild(p.view),e()}function e(){f(),Tools.loadFont(["Proxima"],i);var a=new b;a.getFaces(0,0,function(a){console.log("callback",a[0])})}function f(){l=new PIXI.DisplayObjectContainer,n.addChild(l)}function g(){main.stage=n,main.view=p.view,main.resolution=window.devicePixelRatio||1,main.textResolution=2,main.fonts={Proxima:"Proxima"},q=new a,l.addChild(q)}function h(){window.addEventListener("resize",main.onResize),main.onResize(null)}function i(){console.log("<< start >>"),g(),h(),requestAnimFrame(j),x&&k()}function j(){requestAnimFrame(j),p.render(n),q&&q.process&&q.process(),x&&m.update()}function k(){m=new Stats,m.domElement.style.position="absolute",m.domElement.style.top="0px",m.domElement.style.left="0px",document.body.appendChild(m.domElement)}console.log("<< Lenoir::main >>",c);var l,m,n,o,p,q,r,s,t,u,v,w,x=!0,y=!1,z=1280,A=800,B=2048,C=1536,D=c[0];main.onResize=function(){t=window.innerHeight,u=window.innerWidth,y&&"desktop"==Tools.getDevice()&&(u>=z&&(u=z),t>=A&&(t=A),v=window.innerWidth-u>>1,w=window.innerHeight-t>>1),r=u/B,s=t/C,q&&q.resize&&q.resize(u,t,r,s,v,w),p.resize(u,t),p.view.style.width=u+"px",p.view.style.height=t+"px",window.scrollTo(0,0)},d()};return c}),define("map",["ScrollContainer","bloc"],function(a,b){var c=function(){function c(){var c,e;for(c=0;t>c;c++)for(e=0;u>e;e++){for(var j=[],k=0;v>k;k++)j.push({txt:x,img:"img/"+(0===x?"logo.jpg":parseInt(MathUtils.randomMinMax(0,15))+".jpg")}),x++;w[e+","+c]=j}i=new a(ScrollContainerType.SCROLL,main.stage),i.addEventListener("down",d),g.addChild(i);var y=0,z=0;for(c=0;n>c;c++){for(e=0;m>e;e++)h=new b,h.idX=h.initidX=e,h.idY=h.initidY=c,h.lock0=h.lock1=!0,h.setValue(w[e+","+c]),h.x=y,h.y=z,i.addChild(h),y+=h._width,l[o]=h,y>=p&&(p=y),o++;y=0,z+=l[o-1]._height,z>q&&(q=z)}r=h._width,s=h._height,f()}function d(a){f()}function e(){for(var a,b,c=0;c<l.length;c++)a=i.y+l[c].y,a>k?(l[c].y-=q,l[c].idY>=n?l[c].idY-=n:l[c].idY=t+l[c].initidY-n,l[c].setValue(w[l[c].idX+","+l[c].idY])):-s>a&&i.y+(l[c].y+q)<=k&&(l[c].y+=q,l[c].idY<=t-1-n?l[c].idY+=n:l[c].idY=l[c].initidY,l[c].setValue(w[l[c].idX+","+l[c].idY])),b=i.x+l[c].x,b>j?(l[c].x-=p,l[c].idX>=m?l[c].idX-=m:l[c].idX=u+l[c].initidX-m,l[c].setValue(w[l[c].idX+","+l[c].idY])):-r>b&&i.x+(l[c].x+p)<=j&&(l[c].x+=p,l[c].idX<=u-1-m?l[c].idX+=m:l[c].idX=l[c].initidX,l[c].setValue(w[l[c].idX+","+l[c].idY]))}function f(){for(var a=0;a<l.length;a++)l[a].oldPos={x:l[a].position.x,y:l[a].position.y}}var g,h,i,j,k,l=[],m="desktop"==Tools.getDevice()?3:2,n="desktop"==Tools.getDevice()?3:2,o=0,p=0,q=0,r=0,s=0,t=333,u=250,v=12,w=[],x=0;PIXI.DisplayObjectContainer.call(this),g=this,c(),this.process=function(){i&&(i.scroll(),e())},this.resize=function(a,b){j=a,k=b}};return c.prototype=Object.create(PIXI.DisplayObjectContainer.prototype),c.prototype.process=function(){this.process()},c.prototype.resize=function(a,b){this.resize(a,b)},c});
//# sourceMappingURL=scripts.js.map