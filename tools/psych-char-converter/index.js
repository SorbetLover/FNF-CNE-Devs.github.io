(()=>{var a=document.getElementById("input"),r=document.getElementById("output"),t=document.getElementById("dropzone"),e=document.getElementById("file"),n=document.getElementById("save"),o=document.getElementById("file-name");function i(e){e.preventDefault(),e.stopPropagation()}n.addEventListener("click",function(e){var t,n;e.preventDefault(),""==a.value.trim()?alert("Please paste your character data first!"):(e="character.xml",null!=s&&(e=s.name.replace(/\.json$/,".xml")),t=r.value,e=e,t=new Blob([t],{type:"text/plain;charset=utf-8"}),(n=document.createElement("a")).href=URL.createObjectURL(t),n.download=e,document.body.appendChild(n),n.click(),document.body.removeChild(n))}),["dragenter","dragover","dragleave","drop"].forEach(e=>{t.addEventListener(e,i,!1),document.body.addEventListener(e,i,!1)}),["dragenter","dragover"].forEach(e=>{t.addEventListener(e,c,!1)}),["dragleave","drop","dragend"].forEach(e=>{t.addEventListener(e,d,!1)}),t.addEventListener("drop",function(e){m(e.dataTransfer.files)},!1);var l=null;function c(){t.classList.add("highlight"),clearTimeout(l),l=setTimeout(()=>{d()},1e3)}function d(){t.classList.remove("highlight")}var s=null;function m(e){var t=Array.from(e);0<t.length&&0<(e=t.filter(e=>e.type.startsWith("application/json"))).length?(t=e[0],o.textContent=t.name,s=t,(e=new FileReader).onload=function(e){a.value=e.target.result;e=f(a.value);r.value=e},e.readAsText(t)):o.textContent="No file chosen"}e.addEventListener("change",()=>{m(e.files)},!1);var u=document.getElementById("convert-folder");function h(e,t){for(var n=e.toString(16);n.length<t;)n="0"+n;return n}function f(e){var t,e=JSON.parse(e),a="<!DOCTYPE codename-engine-character>\n\x3c!-- Made with WizardMantis's Character Converter on https://codename-engine.com/ --\x3e\n<character",r=(e.no_antialiasing&&(a+=' antialiasing="false"'),null!=e.image&&(e.image.startsWith("characters/")&&(e.image=e.image.replace("characters/","")),a+=` sprite="${e.image}"`),0!==e.position[0]&&(a+=` x="${e.position[0]}"`),0!==e.position[1]&&(a+=` y="${e.position[1]}"`),null!=e.healthicon&&(a+=` icon="${e.healthicon}"`),e.flip_x&&(a+=' flipX="true"'),null!=e.healthbar_colors&&(a+=` color="${t=e.healthbar_colors,"#"+h(255&t[0],2)+h(255&t[1],2)+h(255&t[2],2)}"`),0!==e.camera_position[0]&&(a+=` camx="${e.camera_position[0]}"`),0!==e.camera_position[1]&&(a+=` camy="${e.camera_position[1]}"`),4!==e.sing_duration&&(a+=` holdTime="${e.sing_duration}"`),1!==e.scale&&(a+=` scale="${e.scale}"`),e.scale);return a+=">\n",e.animations.forEach(function(e){a+=`	<anim name="${e.anim}" anim="${e.name}"`;var t=e.offsets[0]/r,n=e.offsets[1]/r;0==t&&0==n||(a+=` x="${t}" y="${n}"`),24!==e.fps&&(a+=` fps="${e.fps}"`),e.loop&&(a+=' loop="true"'),0!==e.indices.length&&(a+=` indices="${((e,t=",")=>{if(0===e.length)return"";for(var n=[],a=0;a<e.length;){var r=e[a],o=r,i=0;if(a+1<e.length&&(e[a+1]===o+1?i=1:e[a+1]===o-1&&(i=-1)),0!==i)for(;a+1<e.length&&e[a+1]===o+i;)o=e[a+1],a++;n.push(r===o?""+r:r+i===o?r+","+o:r+".."+o),a++}return n.join(t)})(e.indices)}"`),a+="/>\n"}),a+="</character>"}u.addEventListener("change",function(){var e=u.files,t=[];var r=new JSZip,n=new Date,n=new Date(n.getTime()-6e4*n.getTimezoneOffset());JSZip.defaults.date=n;for(var a=0;a<e.length;a++){var o=e[a];o.name.includes(".json")&&t.push((a=>new Promise((t,e)=>{var n=new FileReader;n.onload=function(e){r.file(a.name.replace(".json",".xml"),f(e.target.result)),t("wiz really likes furries")},n.readAsText(a)}))(o))}Promise.all(t).then(e=>{r.generateAsync({type:"blob"}).then(function(e){var t,n;t=e,n="characters.zip",t=new Blob([e],{type:"application/octet-stream"}),(e=document.createElement("a")).href=URL.createObjectURL(t),e.download=n,document.body.appendChild(e),e.click(),document.body.removeChild(e)})})})})();