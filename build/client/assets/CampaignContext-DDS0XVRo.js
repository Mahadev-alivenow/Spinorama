import{j as le}from"./jsx-runtime-DlxonYWr.js";import{r as l}from"./index-DL0tHwE6.js";import{u as de}from"./PlanContext-CABF9B4g.js";let pe={data:""},ue=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||pe,me=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,fe=/\/\*[^]*?\*\/|  +/g,U=/\n+/g,E=(e,a)=>{let i="",u="",f="";for(let o in e){let m=e[o];o[0]=="@"?o[1]=="i"?i=o+" "+m+";":u+=o[1]=="f"?E(m,o):o+"{"+E(m,o[1]=="k"?"":a)+"}":typeof m=="object"?u+=E(m,a?a.replace(/([^,])+/g,d=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,h=>/&/.test(h)?h.replace(/&/g,d):d?d+" "+h:h)):o):m!=null&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),f+=E.p?E.p(o,m):o+":"+m+";")}return i+(a&&f?a+"{"+f+"}":f)+u},x={},z=e=>{if(typeof e=="object"){let a="";for(let i in e)a+=i+z(e[i]);return a}return e},he=(e,a,i,u,f)=>{let o=z(e),m=x[o]||(x[o]=(h=>{let p=0,y=11;for(;p<h.length;)y=101*y+h.charCodeAt(p++)>>>0;return"go"+y})(o));if(!x[m]){let h=o!==e?e:(p=>{let y,w,v=[{}];for(;y=me.exec(p.replace(fe,""));)y[4]?v.shift():y[3]?(w=y[3].replace(U," ").trim(),v.unshift(v[0][w]=v[0][w]||{})):v[0][y[1]]=y[2].replace(U," ").trim();return v[0]})(e);x[m]=E(f?{["@keyframes "+m]:h}:h,i?"":"."+m)}let d=i&&x.g?x.g:null;return i&&(x.g=x[m]),((h,p,y,w)=>{w?p.data=p.data.replace(w,h):p.data.indexOf(h)===-1&&(p.data=y?h+p.data:p.data+h)})(x[m],a,u,d),m},ge=(e,a,i)=>e.reduce((u,f,o)=>{let m=a[o];if(m&&m.call){let d=m(i),h=d&&d.props&&d.props.className||/^go/.test(d)&&d;m=h?"."+h:d&&typeof d=="object"?d.props?"":E(d,""):d===!1?"":d}return u+f+(m??"")},"");function D(e){let a=this||{},i=e.call?e(a.p):e;return he(i.unshift?i.raw?ge(i,[].slice.call(arguments,1),a.p):i.reduce((u,f)=>Object.assign(u,f&&f.call?f(a.p):f),{}):i,ue(a.target),a.g,a.o,a.k)}let J,L,F;D.bind({g:1});let k=D.bind({k:1});function ye(e,a,i,u){E.p=a,J=e,L=i,F=u}function $(e,a){let i=this||{};return function(){let u=arguments;function f(o,m){let d=Object.assign({},o),h=d.className||f.className;i.p=Object.assign({theme:L&&L()},d),i.o=/ *go\d+/.test(h),d.className=D.apply(i,u)+(h?" "+h:"");let p=e;return e[0]&&(p=d.as||e,delete d.as),F&&p[0]&&F(d),J(p,d)}return f}}var be=e=>typeof e=="function",R=(e,a)=>be(e)?e(a):e,we=(()=>{let e=0;return()=>(++e).toString()})(),H=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let a=matchMedia("(prefers-reduced-motion: reduce)");e=!a||a.matches}return e}})(),Ce=20,q=(e,a)=>{switch(a.type){case 0:return{...e,toasts:[a.toast,...e.toasts].slice(0,Ce)};case 1:return{...e,toasts:e.toasts.map(o=>o.id===a.toast.id?{...o,...a.toast}:o)};case 2:let{toast:i}=a;return q(e,{type:e.toasts.find(o=>o.id===i.id)?1:0,toast:i});case 3:let{toastId:u}=a;return{...e,toasts:e.toasts.map(o=>o.id===u||u===void 0?{...o,dismissed:!0,visible:!1}:o)};case 4:return a.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(o=>o.id!==a.toastId)};case 5:return{...e,pausedAt:a.time};case 6:let f=a.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(o=>({...o,pauseDuration:o.pauseDuration+f}))}}},_=[],P={toasts:[],pausedAt:void 0},N=e=>{P=q(P,e),_.forEach(a=>{a(P)})},ve={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},xe=(e={})=>{let[a,i]=l.useState(P),u=l.useRef(P);l.useEffect(()=>(u.current!==P&&i(P),_.push(i),()=>{let o=_.indexOf(i);o>-1&&_.splice(o,1)}),[]);let f=a.toasts.map(o=>{var m,d,h;return{...e,...e[o.type],...o,removeDelay:o.removeDelay||((m=e[o.type])==null?void 0:m.removeDelay)||(e==null?void 0:e.removeDelay),duration:o.duration||((d=e[o.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||ve[o.type],style:{...e.style,...(h=e[o.type])==null?void 0:h.style,...o.style}}});return{...a,toasts:f}},ke=(e,a="blank",i)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:a,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...i,id:(i==null?void 0:i.id)||we()}),j=e=>(a,i)=>{let u=ke(a,e,i);return N({type:2,toast:u}),u.id},g=(e,a)=>j("blank")(e,a);g.error=j("error");g.success=j("success");g.loading=j("loading");g.custom=j("custom");g.dismiss=e=>{N({type:3,toastId:e})};g.remove=e=>N({type:4,toastId:e});g.promise=(e,a,i)=>{let u=g.loading(a.loading,{...i,...i==null?void 0:i.loading});return typeof e=="function"&&(e=e()),e.then(f=>{let o=a.success?R(a.success,f):void 0;return o?g.success(o,{id:u,...i,...i==null?void 0:i.success}):g.dismiss(u),f}).catch(f=>{let o=a.error?R(a.error,f):void 0;o?g.error(o,{id:u,...i,...i==null?void 0:i.error}):g.dismiss(u)}),e};var Se=(e,a)=>{N({type:1,toast:{id:e,height:a}})},Ee=()=>{N({type:5,time:Date.now()})},O=new Map,$e=1e3,Pe=(e,a=$e)=>{if(O.has(e))return;let i=setTimeout(()=>{O.delete(e),N({type:4,toastId:e})},a);O.set(e,i)},Ne=e=>{let{toasts:a,pausedAt:i}=xe(e);l.useEffect(()=>{if(i)return;let o=Date.now(),m=a.map(d=>{if(d.duration===1/0)return;let h=(d.duration||0)+d.pauseDuration-(o-d.createdAt);if(h<0){d.visible&&g.dismiss(d.id);return}return setTimeout(()=>g.dismiss(d.id),h)});return()=>{m.forEach(d=>d&&clearTimeout(d))}},[a,i]);let u=l.useCallback(()=>{i&&N({type:6,time:Date.now()})},[i]),f=l.useCallback((o,m)=>{let{reverseOrder:d=!1,gutter:h=8,defaultPosition:p}=m||{},y=a.filter(C=>(C.position||p)===(o.position||p)&&C.height),w=y.findIndex(C=>C.id===o.id),v=y.filter((C,S)=>S<w&&C.visible).length;return y.filter(C=>C.visible).slice(...d?[v+1]:[0,v]).reduce((C,S)=>C+(S.height||0)+h,0)},[a]);return l.useEffect(()=>{a.forEach(o=>{if(o.dismissed)Pe(o.id,o.removeDelay);else{let m=O.get(o.id);m&&(clearTimeout(m),O.delete(o.id))}})},[a]),{toasts:a,handlers:{updateHeight:Se,startPause:Ee,endPause:u,calculateOffset:f}}},Te=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Oe=k`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,je=k`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ae=$("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Te} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Oe} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${je} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Ie=k`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,_e=$("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Ie} 1s linear infinite;
`,Re=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,De=k`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Le=$("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Re} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${De} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Fe=$("div")`
  position: absolute;
`,Me=$("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Ue=k`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ze=$("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ue} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Je=({toast:e})=>{let{icon:a,type:i,iconTheme:u}=e;return a!==void 0?typeof a=="string"?l.createElement(ze,null,a):a:i==="blank"?null:l.createElement(Me,null,l.createElement(_e,{...u}),i!=="loading"&&l.createElement(Fe,null,i==="error"?l.createElement(Ae,{...u}):l.createElement(Le,{...u})))},He=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,qe=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Ge="0%{opacity:0;} 100%{opacity:1;}",Ve="0%{opacity:1;} 100%{opacity:0;}",We=$("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Ye=$("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ze=(e,a)=>{let i=e.includes("top")?1:-1,[u,f]=H()?[Ge,Ve]:[He(i),qe(i)];return{animation:a?`${k(u)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${k(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Be=l.memo(({toast:e,position:a,style:i,children:u})=>{let f=e.height?Ze(e.position||a||"top-center",e.visible):{opacity:0},o=l.createElement(Je,{toast:e}),m=l.createElement(Ye,{...e.ariaProps},R(e.message,e));return l.createElement(We,{className:e.className,style:{...f,...i,...e.style}},typeof u=="function"?u({icon:o,message:m}):l.createElement(l.Fragment,null,o,m))});ye(l.createElement);var Ke=({id:e,className:a,style:i,onHeightUpdate:u,children:f})=>{let o=l.useCallback(m=>{if(m){let d=()=>{let h=m.getBoundingClientRect().height;u(e,h)};d(),new MutationObserver(d).observe(m,{subtree:!0,childList:!0,characterData:!0})}},[e,u]);return l.createElement("div",{ref:o,className:a,style:i},f)},Xe=(e,a)=>{let i=e.includes("top"),u=i?{top:0}:{bottom:0},f=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:H()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${a*(i?1:-1)}px)`,...u,...f}},Qe=D`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,I=16,rt=({reverseOrder:e,position:a="top-center",toastOptions:i,gutter:u,children:f,containerStyle:o,containerClassName:m})=>{let{toasts:d,handlers:h}=Ne(i);return l.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:I,left:I,right:I,bottom:I,pointerEvents:"none",...o},className:m,onMouseEnter:h.startPause,onMouseLeave:h.endPause},d.map(p=>{let y=p.position||a,w=h.calculateOffset(p,{reverseOrder:e,gutter:u,defaultPosition:a}),v=Xe(y,w);return l.createElement(Ke,{id:p.id,key:p.id,onHeightUpdate:h.updateHeight,className:p.visible?Qe:"",style:v},p.type==="custom"?R(p.message,p):f?f(p):l.createElement(Be,{toast:p,position:y}))}))};const G=l.createContext(null),et=[],tt={appearingRules:{exitIntent:{enabled:!1,device:"desktop"},timeDelay:{enabled:!1,seconds:5},pageScroll:{enabled:!1,percentage:20},pageCount:{enabled:!1,pages:2},clicksCount:{enabled:!1,clicks:2},inactivity:{enabled:!1,seconds:30}},pageTargeting:{enabled:!0,url:"www.yourdomain.com",urls:[]},popupAgain:{enabled:!0,timer:{minutes:10,seconds:0}},displayFrequency:{enabled:!0,frequency:"once_a_day",visitorType:"everyone"}};function nt({children:e}){const{currentPlan:a}=de(),[i,u]=l.useState({connected:!1,checking:!0}),[f,o]=l.useState({name:"wheel-of-wonders",formatted:"wheel-of-wonders"}),[m,d]=l.useState(!1),[h,p]=l.useState({name:"Campaign Name",step:1,look:"custom",color:"singleTone",primaryColor:"#fe5300",secondaryColor:"#767676",tertiaryColor:"#444444",completionPercentage:25,rules:tt,shop:"wheel-of-wonders"}),[y,w]=l.useState(et),[v,C]=l.useState(!0),S=async n=>{const t=n.headers.get("content-type");if(!t||!t.includes("application/json"))return null;try{return await n.json()}catch{return null}},M=()=>{try{let t=new URLSearchParams(window.location.search).get("shop");if(t)return t;try{const r=window.location.hash;if(r&&(t=new URLSearchParams(r.substring(1)).get("shop"),t))return t}catch{}try{if(t=localStorage.getItem("shopify_shop_domain"),t)return t}catch{}if(window.shopOrigin)return t=window.shopOrigin,t;try{if(window.shopify&&window.shopify.config&&window.shopify.config.shop)return t=window.shopify.config.shop,t}catch{}const s=window.location.hostname;if(s.includes(".myshopify.com"))return t=s,t;try{const r=document.referrer;if(r&&r.includes(".myshopify.com")){const c=new URL(r);if(c.hostname.includes(".myshopify.com"))return t=c.hostname,t}}catch{}return null}catch{return null}};l.useEffect(()=>{(async()=>{try{const t=M();if(t){const s=t.replace(/\.myshopify\.com$/i,"");o({name:t,formatted:s});try{localStorage.setItem("shopify_shop_domain",t)}catch{}p(r=>({...r,shop:t}))}try{const s=await fetch("/",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"},credentials:"same-origin"});if(s.ok){const r=await S(s);if(r&&r.shop){const c=r.shop,b=c.replace(/\.myshopify\.com$/i,"");o({name:c,formatted:b});try{localStorage.setItem("shopify_shop_domain",c)}catch{}p(T=>({...T,shop:c})),d(!1);return}}else s.status}catch{}try{const s=await fetch("/api/db-status",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}});if(s.ok){const r=await S(s);if(r&&r.shop){const c=r.shop,b=c.replace(/\.myshopify\.com$/i,"");o({name:c,formatted:b});try{localStorage.setItem("shopify_shop_domain",c)}catch{}p(T=>({...T,shop:c})),d(!1);return}}}catch{}d(!t)}catch{const s=M();if(s){const r=s.replace(/\.myshopify\.com$/i,"");o({name:s,formatted:r}),p(c=>({...c,shop:s})),d(!1)}else d(!0)}})()},[]),l.useEffect(()=>{(async()=>{try{const t=await fetch("/api/db-status",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP error! Status: ${t.status}`);const s=await S(t);if(!s)throw new Error("Invalid JSON response from db-status");if(u({connected:s.connected,checking:!1,error:s.error,dbName:s.dbName,shop:s.shop}),s.shop){const r=s.shop.replace(/\.myshopify\.com$/i,"");o({name:s.shop,formatted:r});try{localStorage.setItem("shopify_shop_domain",s.shop)}catch{}p(c=>({...c,shop:s.shop}))}}catch(t){u({connected:!1,checking:!1,error:t.message})}})()},[]),l.useEffect(()=>{(async()=>{if(i.checking||!i.connected){C(!1);return}try{C(!0);const t=await fetch("/api/campaigns",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP error! Status: ${t.status}`);const s=await S(t);if(!s)throw new Error("Invalid JSON response from campaigns API");const r=s.campaigns||s;if(Array.isArray(r)&&r.length>0&&(w(r),s.shop)){const c=s.shop.replace(/\.myshopify\.com$/i,"");o({name:s.shop,formatted:c})}}catch{}finally{C(!1)}})()},[i]);const V=l.useCallback(n=>{p(t=>({...t,...n}))},[]),W=l.useCallback(n=>{p(t=>({...t,name:n||"Campaign Name"})),g.success("Campaign name updated!")},[]),Y=l.useCallback(n=>{p(t=>({...t,look:n})),g.success(`Look updated to ${n}!`)},[]),Z=l.useCallback(n=>{p(t=>({...t,color:n})),g.success(`Color type updated to ${n}!`)},[]),B=l.useCallback((n,t)=>{p(s=>{const r={...s};return n==="primary"?r.primaryColor=t:n==="secondary"?r.secondaryColor=t:n==="tertiary"&&(r.tertiaryColor=t),r}),g.success(`${n} color updated!`)},[]),K=l.useCallback((n,t)=>{p(s=>{const r=s.rules||{},c=r[n]?{...r[n]}:{},b={...r,[n]:{...c,...t}};return{...s,rules:b}})},[]),X=l.useCallback((n,t=null)=>{p(r=>{const c={...r.rules};return t?c[n]={...c[n],[t]:{...c[n][t],enabled:!c[n][t].enabled}}:c[n]={...c[n],enabled:!c[n].enabled},{...r,rules:c}});const s=t||n;g.success(`${s.charAt(0).toUpperCase()+s.slice(1)} ${t?"rule":""} toggled!`)},[]),Q=l.useCallback((n,t,s,r)=>{p(c=>{const b={...c.rules};return b[n]={...b[n],[t]:{...b[n][t],[s]:r}},{...c,rules:b}})},[]),ee=l.useCallback(n=>{n&&(p(t=>{if(t.rules.pageTargeting.urls.includes(n))return t;const s={...t.rules.pageTargeting,urls:[...t.rules.pageTargeting.urls,n]};return{...t,rules:{...t.rules,pageTargeting:s}}}),g.success(`URL "${n}" added to page targeting!`))},[]),te=l.useCallback(n=>{p(t=>{const s=t.rules.pageTargeting.urls.filter(r=>r!==n);return{...t,rules:{...t.rules,pageTargeting:{...t.rules.pageTargeting,urls:s}}}}),g.success(`URL "${n}" removed from page targeting!`)},[]),ae=l.useCallback(()=>{p(n=>{const t=Math.min(4,n.step+1),s=Math.min(100,t/4*100);return{...n,step:t,completionPercentage:s}}),g.success("Moving to next step!")},[]),se=l.useCallback(()=>{p(n=>{const t=Math.max(1,n.step-1),s=Math.max(25,t/4*100);return{...n,step:t,completionPercentage:s}}),g.success("Moving to previous step!")},[]),oe=l.useCallback(()=>y.length<a.campaignLimit,[y.length,a.campaignLimit]),A=l.useCallback(async n=>{const t=y.filter(s=>s.id!==n&&s.status==="active");if(t.length!==0){if(i.connected)for(const s of t)try{await fetch(`/api/campaigns/${s.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({...s,status:"draft"})})}catch{}w(s=>s.map(r=>r.id!==n&&r.status==="active"?{...r,status:"draft"}:r)),t.length>0&&g.success(`Deactivated ${t.length} other campaign(s)`)}},[y,i.connected]),re=l.useCallback(async n=>{let t;try{if(t={...n,id:n.id||`campaign-${Date.now()}`,name:n.name||"Campaign Name",createdAt:n.createdAt||new Date().toISOString(),status:n.status||"draft",primaryColor:n.primaryColor||"#fe5300",secondaryColor:n.secondaryColor||"#767676",tertiaryColor:n.tertiaryColor||"#444444",look:n.look||"custom",color:n.color||"singleTone",rules:n.rules||h.rules||{appearingRules:{exitIntent:{enabled:!0,device:"desktop"},timeDelay:{enabled:!0,seconds:5},pageScroll:{enabled:!0,percentage:20},pageCount:{enabled:!1,pages:2},clicksCount:{enabled:!1,clicks:2},inactivity:{enabled:!1,seconds:30}},pageTargeting:{enabled:!0,url:"www.yourdomain.com",urls:[]},popupAgain:{enabled:!0,timer:{minutes:10,seconds:0}},displayFrequency:{enabled:!0,frequency:"once_a_day",visitorType:"everyone"}},shop:f.name||n.shop||"wheel-of-wonders.myshopify.com"},t.status==="active"&&await A(t.id),i.connected)if(y.findIndex(r=>r.id===t.id)>=0){const r=await fetch(`/api/campaigns/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!r.ok)throw new Error(`Failed to update campaign: ${r.statusText}`);const c=await r.json();if(c.shop){const b=c.shop.replace(/\.myshopify\.com$/i,"");o({name:c.shop,formatted:b})}}else{const r=await fetch("/api/campaigns",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!r.ok)throw new Error(`Failed to create campaign: ${r.statusText}`);const c=await r.json();if(c.shop){const b=c.shop.replace(/\.myshopify\.com$/i,"");o({name:c.shop,formatted:b})}}if(w(s=>s.findIndex(c=>c.id===t.id)>=0?s.map(c=>c.id===t.id?t:c):[...s,t]),p(s=>({...s,...t})),t.status==="active")try{(await fetch("/api/sync-campaign-metafields",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({campaignId:t.id})})).ok?g.success("Campaign saved and synced to storefront!"):g.success("Campaign saved! Sync to storefront may take a moment.")}catch{g.success("Campaign saved! Sync to storefront may take a moment.")}else g.success("Campaign saved successfully!");return t}catch(s){g.error(`Failed to save campaign: ${s.message}`);const r=y.findIndex(c=>c.id===t.id);return w(c=>r>=0?c.map(b=>b.id===t.id?t:b):[...c,t]),t}},[y,h.rules,i.connected,f.name,A]),ne=l.useCallback(async n=>{try{if(i.connected){const t=await fetch(`/api/campaigns/${n}`,{method:"DELETE"});if(!t.ok)throw new Error(`Failed to delete campaign: ${t.statusText}`)}return w(t=>t.filter(s=>s.id!==n)),g.success("Campaign deleted successfully!"),{success:!0}}catch(t){return g.error(`Failed to delete campaign: ${t.message}`),w(s=>s.filter(r=>r.id!==n)),{success:!0}}},[i.connected]),ie=l.useCallback(async n=>{try{const t=y.find(r=>r.id===n);if(!t)throw new Error("Campaign not found");const s=t.status==="active"?"draft":"active";if(s==="active"&&await A(n),i.connected){const r=new FormData;r.append("status",s),r.append("shop",f.name||"");const c=await fetch(`/api/campaigns/status/${n}`,{method:"POST",body:r});if(!c.ok)throw new Error(`Failed to toggle campaign status: ${c.statusText}`)}if(w(r=>r.map(c=>c.id===n?{...c,status:s}:c)),s==="active")try{(await fetch("/api/sync-campaign-metafields",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({campaignId:n})})).ok?g.success("Campaign activated and synced to storefront!"):g.success("Campaign activated! Sync to storefront may take a moment.")}catch{g.success("Campaign activated! Sync to storefront may take a moment.")}else try{(await fetch("/api/sync-campaign-metafields",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({campaignId:null,clear:!0})})).ok?g.success("Campaign deactivated and removed from storefront!"):g.success("Campaign deactivated!")}catch{g.success("Campaign deactivated!")}return{success:!0,status:s}}catch(t){g.error(`Failed to toggle campaign status: ${t.message}`);const s=y.find(r=>r.id===n);if(s){const r=s.status==="active"?"draft":"active";return w(r==="active"?c=>c.map(b=>b.id===n?{...b,status:r}:b.status==="active"?{...b,status:"draft"}:b):c=>c.map(b=>b.id===n?{...b,status:r}:b)),{success:!0,status:r}}return{success:!1}}},[y,i.connected,A,f.name]),ce=l.useCallback(()=>y.find(n=>n.status==="active")||null,[y]);return le.jsx(G.Provider,{value:{campaignData:h,allCampaigns:y,isLoading:v,dbStatus:i,shopInfo:f,isOfflineMode:m,updateCampaignData:V,updateCampaignName:W,updateLook:Y,updateColor:Z,updateColorValues:B,updateCampaignRules:K,toggleRuleEnabled:X,updateRuleValue:Q,addPageTargetingUrl:ee,removePageTargetingUrl:te,nextStep:ae,prevStep:se,saveCampaign:re,deleteCampaign:ne,toggleCampaignStatus:ie,checkCanCreateCampaign:oe,getActiveCampaign:ce},children:e})}function it(){const e=l.useContext(G);if(!e)throw new Error("useCampaign must be used within a CampaignProvider");return e}export{nt as C,rt as O,g as c,it as u};
