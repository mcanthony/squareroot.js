var Key=function(){var a={};a.SPACE=" ";var c=0;document.addEventListener("keydown",function(a){c=a.keyCode});document.addEventListener("keyup",function(){c=0});a.down=function(a,c){document.addEventListener("keydown",function(d){d.keyCode==a.charCodeAt(0)&&c()})};a.up=function(){};a.isDown=function(a){return c==a.charCodeAt(0)};return a}();var Menu=function(){for(var a,c,f,g=document.querySelector(".menu"),d=document.querySelector(".menu-button"),b=document.querySelector(".menu .close"),h=document.querySelectorAll(".effects li"),i=document.querySelector(".mic"),e=document.querySelector(".track"),m=function(a,b){a.style.webkitTransform="translateX("+b+"px)";a.style.msTransform="translateX("+b+"px)";a.style.MozTransform="translateX("+b+"px)";a.style.transform="translateX("+b+"px)"},n=0;n<h.length;n++)h[n].addEventListener("click",function(b){b=
b.target;for(var i=parseInt(b.getAttribute("data-index")),e=0;e<h.length;e++){var d=h[e];b==d?d.setAttribute("class","selected"):d.setAttribute("class","");a&&a(i)}});d.addEventListener("click",function(){d.style.opacity=0;g.style.opacity=1;m(g,0)});b.addEventListener("click",function(){d.style.opacity=1;g.style.opacity=0;m(g,-30)});i.addEventListener("click",function(){i.setAttribute("class","selected");e.setAttribute("class","");c&&c()});e.addEventListener("click",function(){i.setAttribute("class",
"");e.setAttribute("class","selected");f&&f()});b={};b.onEffect=function(b){a=b};b.onMic=function(a){c=a};b.onTrack=function(a){f=a};e.setAttribute("class","selected");h[0].setAttribute("class","selected");d.style.opacity=0;return b}();var LeapWrapper=function(a){a=a||{};var c=this;this.ease=0.15;var f=new SQR.V3(0,1,0),g=new SQR.V3,d=0,b=0;this.handOpen=0;this.isActive=!1;this.position=new SQR.V3;this.rotation=new SQR.V3;this.velocity=new SQR.V3;var h=!1;this.tick=function(){var a=this.ease;b+=(d-b)*a;this.handOpen=1+b;this.hand&&(this.position.x+=(this.hand.palmPosition[0]-this.position.x)*a,this.position.y+=(this.hand.palmPosition[1]-this.position.y)*a,this.position.z+=(this.hand.palmPosition[2]-this.position.z)*a,this.velocity.x+=
(this.hand.palmVelocity[0]-this.velocity.x)*a,this.velocity.y+=(this.hand.palmVelocity[1]-this.velocity.y)*a,this.velocity.z+=(this.hand.palmVelocity[2]-this.velocity.z)*a,this.rotation.x+=(this.hand.pitch()-this.rotation.x)*a,this.rotation.y+=(this.hand.yaw()-this.rotation.y)*a,this.rotation.z+=(this.hand.roll()-this.rotation.z)*a)};Leap.loop(function(b){d=0;for(var e=b.fingers.length,m=0;m<e;m++){var n=b.fingers[0].direction;g.set(n[0],n[1],n[2]).norm();d+=SQR.V3.dot(f,g)}d+=-1*(5-e);d/=5;c.frame=
b;c.isActive=b.hands.length>0;c.hand=b.hands[0];c.isActive!=h&&a.toggleCallback&&a.toggleCallback(c.isActive);h=c.isActive})};var SoundAnalyser=function(){var a={};a.levelsCount=8;a.waveCount=32;a.waveDataRaw=[];a.waveData=[];a.levelsData=[];a.level=0;var c=!1,f=!1,g=!1,d=!1,b,h,i,e,m,n,j,k=0,p,o=0;a.setVolume=function(a){m.gain.value=a};a.setSesitivity=function(a){volumeGainNode.gain.value=a};a.connectMic=function(){if(!f){c&&(source.disconnect(volumeGainNode),source.stop());if(d)e.connect(volumeGainNode);else{navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;
if(!navigator.getUserMedia)throw"No User Media detected";navigator.getUserMedia({audio:!0},function(a){e=b.createMediaStreamSource(a);e.connect(volumeGainNode);beatStart=(new Date).getTime()})}f=!0;c=!1;d=!0;return a}};a.connectTrack=function(d){console.log("connectTrack",c,f);if(!c)f&&e.disconnect(volumeGainNode),f=!1,g?(source=b.createBufferSource(),source.buffer=h,source.loop=!0,source.start(),source.connect(volumeGainNode),g=c=!0,beatStart=(new Date).getTime()):a.load(d)};a.load=function(e){var d=
new XMLHttpRequest;d.open("GET",e,!0);d.responseType="arraybuffer";d.onload=function(){h=b.createBuffer(d.response,!1);source=b.createBufferSource();source.buffer=h;source.loop=!0;source.start();source.connect(volumeGainNode);g=c=!0;beatStart=(new Date).getTime()};d.send();return a};a.update=function(){i.getByteFrequencyData(n);i.getByteTimeDomainData(j);for(var b=0;b<a.binCount;b++)a.waveDataRaw[b]=(j[b]-128)/128;for(b=0;b<a.waveCount;b++){for(var d=0,e=0;e<a.waveBins;e++)d+=a.waveDataRaw[b*a.waveBins+
e];d/=a.waveBins;a.waveData[b]=d}var c=0;for(b=0;b<a.levelsCount;b++){for(e=d=0;e<a.levelBins;e++)d+=n[b*a.levelBins+e];d=d/a.levelBins/256;a.levelsData[b]=d;c+=d}a.level=c/a.levelsCount;o=a.level;if(o>k){if(a.onBeat)a.onBeat();k=o*1.05;p=0}else p<=10?p++:(k*=0.99,k=Math.max(k,0.15))};b=new window.webkitAudioContext;i=b.createAnalyser();i.smoothingTimeConstant=0;i.fftSize=1024;m=b.createGainNode();volumeGainNode=b.createGainNode();m.connect(b.destination);i.connect(m);volumeGainNode.connect(i);a.binCount=
i.frequencyBinCount;a.waveBins=Math.floor(a.binCount/a.waveCount);a.levelBins=Math.floor(a.binCount/a.levelsCount);n=new Uint8Array(a.binCount);j=new Uint8Array(a.binCount);return a};var SoundVisualizer=function(a,c,f){var g=a.width=c,d=a.height=f,b=0,h=a.getContext("2d");a={};a.draw=function(a){h.clearRect(0,0,g,d);var e=a.level,c=g/10;h.fillStyle="rgba("+b+", 100, "+b+", 1.0)";h.fillRect(g-c-1,d,c-1,e*-d);b=b*0.8|0;e=a.levelsCount;c=a.levelsData;var f=g/e;h.fillStyle="rgba(255, 0, 0, 0.9)";for(var j=0;j<e;j++)h.fillRect(j*f,d,f-1,c[j]*-d);e=a.waveCount;a=a.waveData;h.strokeStyle="#fff";h.beginPath();for(c=0;c<e;c++)h.lineTo(c/e*g,a[c]*d/2+d/2);h.stroke()};a.onBeat=function(){b=
255};return a};var VisualizerCollection=function(a){var c={},f;this.add=function(a,d){c[a]=d;return this};this.update=function(a,d,b){f.update(a,d,b)};this.onBeat=function(a){f.onBeat(a)};this.use=function(g,d,b){f&&(a.remove(f.object),f.dispose(d,b));a.add(c[g].object);f=c[g];f.use(d,b)}};var EffectCollection=function(){var a={},c;this.add=function(c,g){a[c]=g;return this};this.onBeat=function(){c.onBeat()};this.render=function(a,g,d,b){c.render(a,g,d,b)};this.use=function(f){c=a[f];c.use()}};var Vignette=function(a){var c=new SQR.PostEffect("glsl/Vignette.glsl");this.use=function(){a.setClearColor(0,0,0,1)};var f=0,g=0;this.onBeat=function(){f=1};this.render=function(d,b,h,i){b=i.isActive?0.3:1;g+=(f-g)*0.2;f*=0.8;c.renderer.u.uTime=SQR.Time.time;c.renderer.u.uBeat=g*b;c.setSource(d);a.render(c,null)}};var Blur=function(a){var c=0,f=a.createFrameBuffer(),g=a.createFrameBuffer(),d=a.createFrameBuffer();a.createFrameBuffer();var b=new SQR.PostEffect("glsl/Blur.glsl"),h=new SQR.PostEffect("glsl/PassThru.glsl"),i=a.createShader();i.load("glsl/Depth.glsl");var e=new SQR.PostEffect("glsl/DepthOfField.glsl");e.renderer.u.uBlurTexture=g.texture;e.renderer.u.uDepthTexture=d.texture;this.use=function(){a.setClearColor(0,0,0,1)};this.onBeat=function(){c=1};this.render=function(m,n,j){i.u.near=50+(1-c)*30;
i.u.far=60+(1-c)*50;c*=0.9;b.renderer.u.delta=[0,0.05];b.setSource(m);a.render(b,null,{target:f});b.setSource(f);b.renderer.u.delta=[0.05,0];a.render(b,null,{target:g});a.render(n,j,{target:d,replacementShader:i});h.setSource(d);e.setSource(m);a.render(e,null)}};var GlowChromaticDist=function(a){var c=0,f=a.createFrameBuffer(),g=a.createFrameBuffer(),d=new SQR.PostEffect("glsl/StrongBlur.glsl");d.renderer.u.uMult=1.5;var b=new SQR.PostEffect("glsl/GlowChroma.glsl");this.use=function(){a.setClearColor(0,0,0,1)};this.onBeat=function(){};this.render=function(h){c+=0.0030;var i=Math.sin(c)*0.5+0.5;i=Math.max(0,i);i=Math.min(1,i);i*=0.015;d.renderer.u.delta=[0,i];d.setSource(h);a.render(d,null,{target:f});d.setSource(f);d.renderer.u.delta=[i,0];a.render(d,null,
{target:g});b.setSource(h);b.renderer.u.uBlurTexture=g.texture;a.render(b,null);b.renderer.u.uBeat=0}};var ScanLines=function(a){var c=0,f=0;this.use=function(){a.setClearColor(0.1,0.2,0.3,1)};a.createFrameBuffer();a.createFrameBuffer();var g=a.createFrameBuffer();a.createFrameBuffer();var d=a.createShader();d.load("glsl/Depth.glsl");d.u.far=100;d.u.near=60;var b=new SQR.PostEffect("glsl/ScanLines.glsl");b.renderer.u.uDepthTexture=g.texture;new SQR.RenderRegion(50,50,window.innerWidth/5,window.innerHeight/5);this.onBeat=function(){f=1};this.render=function(h,i,e){b.renderer.u.uTime=SQR.Time.time;b.renderer.u.uWidth=
c;f*=0.9;c+=(f-c)*0.2;a.render(i,e,{target:g,replacementShader:d});b.setSource(h);a.render(b,null)}};var NoEffect=function(a){this.use=function(){a.setClearColor(0,0,0,1)};this.onBeat=function(){};this.render=function(c,f,g){a.render(f,g)}};var StrechingCube=function(a){var c=a.createShader();c.load("glsl/Normal2color.glsl");var f=0,g=0,d=0,b=new SQR.Transform;b.geometry=(new SQR.Cube).create(35,35,35);b.renderer=a.createRenderer(c);b.renderer.u.uColor=[0,0.5,0,1];b.geometry.cornersOrig={};b.rotation.x=Math.PI*0.25;b.rotation.y=Math.PI*0.25;for(var h in b.geometry.corners)b.geometry.cornersOrig[h]=b.geometry.corners[h].clone(),b.geometry.corners[h].value=0,b.geometry.corners[h].speed=0.0010+Math.random()*0.0010,b.geometry.corners[h].phase=
Math.PI*Math.random();this.use=function(){};this.dispose=function(){};this.onBeat=function(){if(d<0)d=1,f=b.rotation.x,g=b.rotation.y};this.update=function(a){if(d>0)b.rotation.x=f+Math.PI*0.5*SQR.Interpolation.smoothStep(0,1,1-d),b.rotation.y=g+Math.PI*0.5*SQR.Interpolation.smoothStep(0,1,1-d);d-=0.04;var e=0,c;for(c in b.geometry.corners){var h=b.geometry.corners[c];h.value=Math.max(a.levelsData[e%a.levelsCount],h.value);h.copyFrom(b.geometry.cornersOrig[c]);h.mul(1.4+Math.sin(h.phase)*0.6);h.phase+=
h.speed+h.value/3;h.value*=0.92;e++}b.geometry.refresh()};this.object=b};var LineSphere=function(a){var c=0,f=0,g=0,d=1,b=1,h=0,i=a.createShader();i.load("glsl/LineSphere.glsl");var e=new SQR.Transform;e.geometry=(new LineSphereGeometry).create(3E3,20,2);e.renderer=a.createRenderer(i);e.renderer.renderMode=SQR.GL.LINES;e.renderer.lineWidth=2;e.renderer.transparent=!0;this.onBeat=function(){f=-0.3;g=0.05};this.use=function(){};this.dispose=function(){};new SQR.V3;new SQR.V3(0,1,0);this.update=function(a,i,j){b=(i=j.isActive)?j.handOpen:1;j=g*Math.min(1,d);e.rotation.x+=
0.0023+j*0.35;e.rotation.y+=0.0027+j*0.35;e.lookInDirection(null);e.geometry.refresh(a.levelsData,d);e.renderer.u.uTime=SQR.Time.time*3;a=(1+c)*(0.6+0.4*Math.max(0,d));e.scale.set(a,a,a);c+=(f-c)*0.1;g*=0.9;f*=0.9;i?d+=(b-d)*0.1:(h+=(d-b)*-0.15,h*=0.85,d+=h)};this.object=e};var SkyscraperLane=function(a){var c=0,f=a.createShader();f.load("glsl/Skyscraper.glsl");var g=a.createShader();g.load("glsl/Horizon.glsl");var d=a.createShader();d.load("glsl/Traffic.glsl");var b=a.createShader();b.load("glsl/CityStreet.glsl");var h=0,i=0,e=0,m=0,n=0,j=0,k=[],p=new SQR.Transform;p.renderer=a.createRenderer(b);p.renderer.u.uColor=[0,0,0];p.geometry=(new SQR.Cylinder({vertical:!1,perVertextNormals:!1,noCaps:!0})).create(200,300,200);p.position.set(0,-330,50);var o=[];for(b=1;b<=6;b++){var l=
new SQR.Transform;l.renderer=a.createRenderer(d);l.renderer.u.uNightColor=b<=3?[1,0.75,0.25]:[1,0.25,0];l.renderer.u.uDayColor=b<=3?[0.2,0.2,0.2]:[0.2,0.05,0];l.renderer.renderMode=SQR.GL.POINTS;l.geometry=(new Freeway).create(500,300.1,0.3);l.speed=b<=3?-2.0E-4*b*2:0.0020+0.0010*(3-Math.floor(b-3));l.position.x=(b-3)*4;p.add(l);o.push(l)}d=new SQR.Transform;d.add(p);var q=new SQR.Transform;q.renderer=a.createRenderer(g);q.geometry=(new SQR.Plane({zUp:!0,quads:!1})).create(6E3,2100);q.position.z=
-1800;q.rotation.x=Math.PI;g=function(b,d){for(var e=b.clone(),c=0;c<d;c++){var i=new SQR.Transform;i.geometry=(new SQR.Cube).create(10+Math.random()*20,10+Math.random()*20,1,0,0,0.5);i.renderer=a.createRenderer(f);i.buildingHeight=0;i.buildingBaseHeight=60+Math.random()*40;i.buildingHeightTarget=0;i.maxHeight=10+Math.random()*15;i.rotation.z=Math.random();i.renderer.u.uWindowColor=[0.5+0.5*(0.3+Math.random()*0.7),0.5,0.1];var h=c/d*SQR.twoPI;k.push(i);var g=new SQR.Transform;g.lookInDirection(e);
g.position.set(0,Math.sin(h)*300,Math.cos(h)*300).appendVec(b);p.add(g);g.add(i)}};g(new SQR.V3(-35,0,0),50);g(new SQR.V3(35,0,0),50);g(new SQR.V3(-65,0,0),30);g(new SQR.V3(65,0,0),30);this.use=function(a,b){b.ease=0.1;a.add(q)};this.dispose=function(a){a.remove(q)};this.onBeat=function(){n=m=1;j=Math.random()>0.5?-0.8:0.8};var r=0,u=0,x=0,v=0;document.addEventListener("mousemove",function(a){r=a.pageX/window.innerWidth*2-1;x=a.pageY/window.innerHeight});this.update=function(a,b,d){c+=0.0030;var f=
Math.sin(c)*0.5+0.5;f=Math.max(0,f);f=Math.min(1,f);q.renderer.u.uDayTime=f;p.renderer.u.uDayTime=f;for(var g=0;g<k.length;g++){var t=k[g];t.buildingHeightTarget=a.levelsData[g%a.levelsCount]*t.maxHeight;t.buildingHeight+=(t.buildingHeightTarget-t.buildingHeight)*0.2;var l=t.buildingBaseHeight+t.buildingHeight*20;t.scale.set(1,1,l);t.renderer.u.uBuildingHeight=l*0.33;t.renderer.u.uDayTime=f;t.renderer.u.uBeat=e;t.buildingHeightTarget*=0.9}m*=0.9;e+=(m-e)*0.3;n*=0.975;a=Math.sin(i)*0.2;d.isActive?
(g=SQR.Mathx.clamp(d.position.x/4,-15,15),a=SQR.Mathx.clamp((d.position.y-165)/2,-30,30),g-=b.position.x,a-=b.position.y,b.position.x+=g*0.2,b.position.y+=a*0.2,b.rotation.z+=(g*0.1-b.rotation.z)*0.2,b.rotation.x+=(a*-0.02-b.rotation.x)*0.2):(b.position.x*=0.97,b.position.y*=0.97,b.rotation.z*=0.97,b.rotation.x*=0.97+a);p.rotation.x-=d.isActive?0.0025:0.0015;for(g=0;g<6;g++)o[g].rotation.x+=o[g].speed,o[g].renderer.u.uDayTime=f,o[g].renderer.u.uBeat=n;u+=(r-u)*0.2;v+=(x-v)*0.2;h+=0.02;i+=j;j*=0.95};
this.object=d};var SpaceRing=function(){var a=new SQR.Geometry;a.attr("aParticleParam",4);for(var c=[],f=0;f<3E4;f++)c.push(Math.random()*SQR.twoPI,Math.random()*0.3,Math.random(),Math.random());a.data("aParticleParam",c);return a},Gems=function(a){var c=new SQR.Transform,f=new SQR.Color,g=1,d=0,b=0,h=0,i=0,e=new SQR.Transform;c.add(e);e=a.createCubemap({left:"assets/skybox-blur/left.jpg",right:"assets/skybox-blur/right.jpg",up:"assets/skybox-blur/up.jpg",down:"assets/skybox-blur/down.jpg",back:"assets/skybox-blur/back.jpg",
front:"assets/skybox-blur/front.jpg"});var m=a.createShader();m.load("glsl/DiscoBall.glsl");var n=a.createShader();n.load("glsl/SpaceRing.glsl");var j=new SQR.Transform;j.geometry=(new SQR.Icosphere({perVertextNormals:!1})).create(90);j.geometry.subdivide();j.geometry.subdivide();j.renderer=a.createRenderer(m);j.renderer.u.uCubemap=e;c.position.set(0,0,-400);j.useQuaternion=!0;j.displace=function(a){return function(d,e,c){for(var i=a.geometry.vectors,g=i.length,h=0;h<g;h++){var f=i[h];if(!f.phase)f.phase=
Math.PI*Math.random()*2;if(!f.max)f.max=20;if(!f.original)f.original=f.clone();if(!f.normalized)f.normalized=f.clone().norm();if(!f.beat)f.beat=0;var j=(Math.sin(f.phase)*0.5+0.5)*f.max*(1+b*3);c&&(j*=0.5);f.beat=Math.max(f.beat,d[[h%e]]);f.set().appendVec(f.normalized).mul(j).appendVec(f.original);f.phase+=0.1+b*0.1;f.beat*=0.9}a.geometry.refresh()}}(j);c.add(j);var k=new SQR.Transform;k.geometry=new SpaceRing;k.renderer=a.createRenderer(n);k.renderer.renderMode=SQR.GL.POINTS;this.onBeat=function(){d=
1;k.renderer.u.uBeat=SQR.Time.time};this.use=function(){};this.dispose=function(){};var p=new SQR.Quaternion,o=new SQR.V3(1,0,0),l=new SQR.V3(0,0,1),q=0,r=0,u=new SQR.V3;this.update=function(a,e,c){b+=(d-b)*0.1;d*=0.9;i+=(h-i)*0.1;h*=0.8;j.displace(a.levelsData,a.levelsCount,c.isActive);j.renderer.u.uEyePosition=e.position;j.renderer.u.uBeat=b;g+=0.0080;f.hsl(Math.sin(g)*0.5+0.5,1,0.5).hslToRgb();j.renderer.u.uColor=f;j.renderer.u.uTime=SQR.Time.time*2;k.renderer.u.uTime=SQR.Time.time;c.isActive?
(h=1,u.copyFrom(c.velocity)):u.mul(0.98);q=u.z/-5E3;r=u.x/5E3;p.fromAngleAxis(q,o.x,o.y,o.z);j.rotationQ.mul(p);p.fromAngleAxis(r,l.x,l.y,l.z);j.rotationQ.mul(p);k.renderer.u.uDamp=1-i;e.position.set(0,0,0)};this.object=c};var Pyramids=function(a){var c=new SQR.Transform,f=Math.sqrt(2),g=a.createShader();g.load("glsl/PyramidAO.glsl");for(var d=[],b=Math.ceil(13/window.innerHeight*window.innerWidth),h=Math.sqrt(200)*2,i=0,e=0,m=0,n=0,j=0,k=0,p=Array(50),o=0;o<50;o++)p[o]=0;o=function(b){var e=new SQR.Transform;e.geometry=(new SQR.Pyramid({noCap:!0})).create(20,0,0,4,0);e.renderer=a.createRenderer(g);e.renderer.u.uColor=b;c.add(e);d.push(e);return e};for(var l=new SQR.V2(0.5,0.5),q=0;q<b;q++)for(var r=0;r<13;r++){var u=
h*(b-1)/2,x=h*12/2,v=new SQR.V2(q/(b-1),r/12);v.sub(v,l);var w=v.mag()*2/f,s=1-w;s=(new SQR.Color).rgb(s*0.2+0.8,0,0);s=o(s);s.data={};s.data.centerDistance=Math.min(1,w);s.data.force=1-w;s.data.index=Math.floor(w*49);s.data.phase=0;s.data.speed=0.1;s.data.distanceVector=v;s.data.handDistTarget=0;s.data.handDist=0;s.data.multTarget=0;s.data.mult=0;s.position.x=q*h-u;s.position.z=r*h-x}this.onBeat=function(){m=1;n=0};this.use=function(){camera.position.z=0;camera.position.y=445;camera.rotation.x=SQR.halfPI};
this.dispose=function(){};var y=new SQR.V2,z=new SQR.V2;this.update=function(b,c,g){g.isActive?(k*=0.9,e*=0.9,y.set(g.position.x/200,g.position.z/200)):(e+=(m-e)*0.2,j=b.level,k+=(j-k)*0.02,i+=b.level*0.2,n+=0.05);m*=0.9;p.pop();p.unshift(Math.sin(i)*(k+e+0.1));b=d.length;for(var h=0;h<b;h++){var o=d[h],l=o.data;z.sub(y,l.distanceVector);if(g.isActive){var q=z.mag()/f;q=Math.pow(1-q,4);q*=1.4;l.handDistTarget=Math.max(q,l.handDistTarget)}l.handDistTarget*=0.94;l.handDist+=(l.handDistTarget-l.handDist)*
0.9;q=Math.abs(p[l.index])+l.handDist;l=20+q*200*l.force;o.geometry.peak.y=l;o.geometry.refresh();o.renderer.u.uHeight=l;o.renderer.u.uColor.blue(q)}a.render(root,c)};this.object=c};var LineSphereGeometry=function(){var a=[],c=(new SQR.Geometry).quickSetup("v3n3t2"),f=this,g,d,b,h=[];c.create=function(f,e,h){g=f;d=e;b=h;for(f=0;f<g;f++)e=(new SQR.V3).random().norm().mul(d),h=e.clone().norm().mul(b).appendVec(e),e.bump=0,e.anitDump=1-Math.pow(Math.random(),2),e.phase=Math.PI*Math.random(),a.push([e,h]);return c};c.refresh=function(d,e){h.length=0;for(var m=d.length,n=0;n<g;n++){var j=a[n][0];j.bump=Math.max(j.bump,d[n%m]);j.bump*=0.95;j.phase+=0.2;var k=1+(b+(1+Math.sin(j.phase))*
20*j.bump)*e;k=j.clone().norm().mul(k).appendVec(j);a[n][1]=k}for(n=0;n<g;n++)m=a[n],h.push(m[0].x,m[0].y,m[0].z,m[1].x,m[1].y,m[1].z);c.data(SQR.Geometry.VERTEX,h);b+=j.bump/200;f.dirty=!0;return c};return c};SQR.Skyscraper=function(){b=b||{};b.offset=b.offset||new SQR.V3;var a=[],c=[],f=[],g=[],d=(new SQR.Geometry).quickSetup("v3n3t2"),b;d.create=function(b,c,e,f,g,j){a.length=0;var k=new SQR.V3(f||0,g||0,j||0);f=(new SQR.V3(b*-0.5,c*0.5,e*0.5)).appendVec(k);g=(new SQR.V3(b*0.5,c*0.5,e*0.5)).appendVec(k);j=(new SQR.V3(b*-0.5,c*-0.5,e*0.5)).appendVec(k);var p=(new SQR.V3(b*0.5,c*-0.5,e*0.5)).appendVec(k),o=(new SQR.V3(b*-0.5,c*0.5,e*-0.5)).appendVec(k),l=(new SQR.V3(b*0.5,c*0.5,e*-0.5)).appendVec(k),q=
(new SQR.V3(b*-0.5,c*-0.5,e*-0.5)).appendVec(k);b=(new SQR.V3(b*0.5,c*-0.5,e*-0.5)).appendVec(k);c=new SQR.V2(0,0);e=new SQR.V2(1,0);k=new SQR.V2(0,1);var r=new SQR.V2(1,1);a.push((new SQR.Triangle(f,g,p)).setUV(k,r,e));a.push((new SQR.Triangle(f,p,j)).setUV(k,e,c));a.push((new SQR.Triangle(o,b,l)).setUV(r,c,k));a.push((new SQR.Triangle(o,q,b)).setUV(r,e,c));a.push((new SQR.Triangle(f,j,o)).setUV(r,e,k));a.push((new SQR.Triangle(j,q,o)).setUV(e,c,k));a.push((new SQR.Triangle(g,l,p)).setUV(k,r,c));
a.push((new SQR.Triangle(p,l,b)).setUV(c,r,e));a.push((new SQR.Triangle(f,o,g)).setUV(c,k,e));a.push((new SQR.Triangle(o,l,g)).setUV(k,r,e));a.push((new SQR.Triangle(j,p,q)).setUV(k,r,c));a.push((new SQR.Triangle(q,p,b)).setUV(c,r,e));d.refresh();return d};d.refresh=function(){var b=a.length;c.length=0;f.length=0;for(var i=g.length=0;i<b;i++)a[i].calculateNormal();for(i=0;i<b;i++)a[i].toArray(c,f,g);d.data(SQR.Geometry.VERTEX,c);d.data(SQR.Geometry.NORMAL,f);d.data(SQR.Geometry.TEXCOORD,g);return d};
return d};var Freeway=function(){var a=[],c=[],f=(new SQR.Geometry).quickSetup("v3");f.attr("aCarParam",3);f.create=function(g,d,b){for(var h=0;h<g;h++)if(!(Math.random()>b)){var i=h/g*SQR.twoPI,e=Math.sin(i)*d;i=Math.cos(i)*d;a.push(-0.6,i,e);a.push(0.6,i,e);e=new SQR.V3;e.x=Math.random();e.y=Math.random();e.z=Math.random();c.push(e.x,e.y,e.z,e.x,e.y,e.z)}return f.refresh()};f.refresh=function(){f.data(SQR.Geometry.VERTEX,a);f.data("aCarParam",c);f.dirty=!0;return f};return f};var DEBUG=!1,USEMIC=!1,sound=new SoundAnalyser,volume,sensitivity,useMic=function(){volume=0;sensitivity=1;sound.setVolume(volume);sound.setSesitivity(sensitivity);sound.connectMic()},useTrack=function(){sensitivity=volume=1;sound.setVolume(volume);sound.setSesitivity(sensitivity);sound.connectTrack("assets/hideseek.mp3")};USEMIC?useMic():useTrack();var debugViz=new SoundVisualizer(document.querySelector("#viz-canvas"),128,64),root=new SQR.Transform,stats=new Stats;
stats.domElement.setAttribute("class","stats");DEBUG&&document.body.appendChild(stats.domElement);var engine=new SQR.SquarerootGL(document.getElementById("gl-canvas"));engine.setSize(window.innerWidth,window.innerHeight);var target=engine.createFrameBuffer(),projection=new SQR.ProjectionMatrix;projection.perspective(45,window.innerWidth/window.innerHeight,1,1E4);engine.setProjection(projection);var camera=new SQR.Transform;root.add(camera);
var resetCamera=function(){camera.position.set(0,0,100);camera.rotation.set(0,0,0);camera.lookAt(null)};resetCamera();var nextTimeout,vizTTL=45E3,interactionIdleTTL=2E4,leap=new LeapWrapper,visualizer=new VisualizerCollection(root);visualizer.add("gems",new Gems(engine));visualizer.add("linesphere",new LineSphere(engine));visualizer.add("strechcube",new StrechingCube(engine));visualizer.add("skyscraper",new SkyscraperLane(engine));visualizer.add("pyramids",new Pyramids(engine));var effect=new EffectCollection;
effect.add("vignette",new Vignette(engine));effect.add("glow",new GlowChromaticDist(engine));effect.add("scanlines",new ScanLines(engine));effect.add("blur",new Blur(engine));effect.add("none",new NoEffect(engine));var compositions=[["gems","vignette"],["skyscraper","glow"],["linesphere","blur"],["pyramids","none"],["strechcube","scanlines"]],compositionIndex=-1,setEffect=function(a){resetCamera();visualizer.use(compositions[a][0],camera,leap);effect.use(compositions[a][1])};Menu.onEffect(setEffect);
Menu.onMic(useMic);Menu.onTrack(useTrack);sound.onBeat=function(){if(DEBUG)debugViz.onBeat();visualizer.onBeat(camera);effect.onBeat()};var loop=function(){stats.begin();requestAnimFrame(loop);SQR.Time.tick();leap.tick();sound.update();DEBUG&&debugViz.draw(sound);visualizer.update(sound,camera,leap);engine.render(root,camera,{target:target});effect.render(target,root,camera,leap);stats.end()};setEffect(0);loop();
