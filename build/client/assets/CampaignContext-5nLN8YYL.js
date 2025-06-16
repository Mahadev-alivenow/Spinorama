import{r as l,j as le}from"./index-Dxzwlmmu.js";import{u as de}from"./PlanContext-CgoqeIeO.js";let pe={data:""},ue=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||pe,me=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,fe=/\/\*[^]*?\*\/|  +/g,R=/\n+/g,E=(e,o)=>{let r="",p="",f="";for(let s in e){let m=e[s];s[0]=="@"?s[1]=="i"?r=s+" "+m+";":p+=s[1]=="f"?E(m,s):s+"{"+E(m,s[1]=="k"?"":o)+"}":typeof m=="object"?p+=E(m,o?o.replace(/([^,])+/g,d=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,g=>/&/.test(g)?g.replace(/&/g,d):d?d+" "+g:g)):s):m!=null&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),f+=E.p?E.p(s,m):s+":"+m+";")}return r+(o&&f?o+"{"+f+"}":f)+p},x={},U=e=>{if(typeof e=="object"){let o="";for(let r in e)o+=r+U(e[r]);return o}return e},ge=(e,o,r,p,f)=>{let s=U(e),m=x[s]||(x[s]=(g=>{let u=0,y=11;for(;u<g.length;)y=101*y+g.charCodeAt(u++)>>>0;return"go"+y})(s));if(!x[m]){let g=s!==e?e:(u=>{let y,w,v=[{}];for(;y=me.exec(u.replace(fe,""));)y[4]?v.shift():y[3]?(w=y[3].replace(R," ").trim(),v.unshift(v[0][w]=v[0][w]||{})):v[0][y[1]]=y[2].replace(R," ").trim();return v[0]})(e);x[m]=E(f?{["@keyframes "+m]:g}:g,r?"":"."+m)}let d=r&&x.g?x.g:null;return r&&(x.g=x[m]),((g,u,y,w)=>{w?u.data=u.data.replace(w,g):u.data.indexOf(g)===-1&&(u.data=y?g+u.data:u.data+g)})(x[m],o,p,d),m},he=(e,o,r)=>e.reduce((p,f,s)=>{let m=o[s];if(m&&m.call){let d=m(r),g=d&&d.props&&d.props.className||/^go/.test(d)&&d;m=g?"."+g:d&&typeof d=="object"?d.props?"":E(d,""):d===!1?"":d}return p+f+(m??"")},"");function M(e){let o=this||{},r=e.call?e(o.p):e;return ge(r.unshift?r.raw?he(r,[].slice.call(arguments,1),o.p):r.reduce((p,f)=>Object.assign(p,f&&f.call?f(o.p):f),{}):r,ue(o.target),o.g,o.o,o.k)}let J,_,L;M.bind({g:1});let k=M.bind({k:1});function ye(e,o,r,p){E.p=o,J=e,_=r,L=p}function $(e,o){let r=this||{};return function(){let p=arguments;function f(s,m){let d=Object.assign({},s),g=d.className||f.className;r.p=Object.assign({theme:_&&_()},d),r.o=/ *go\d+/.test(g),d.className=M.apply(r,p)+(g?" "+g:"");let u=e;return e[0]&&(u=d.as||e,delete d.as),L&&u[0]&&L(d),J(u,d)}return f}}var be=e=>typeof e=="function",F=(e,o)=>be(e)?e(o):e,we=(()=>{let e=0;return()=>(++e).toString()})(),G=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let o=matchMedia("(prefers-reduced-motion: reduce)");e=!o||o.matches}return e}})(),Ce=20,z=(e,o)=>{switch(o.type){case 0:return{...e,toasts:[o.toast,...e.toasts].slice(0,Ce)};case 1:return{...e,toasts:e.toasts.map(s=>s.id===o.toast.id?{...s,...o.toast}:s)};case 2:let{toast:r}=o;return z(e,{type:e.toasts.find(s=>s.id===r.id)?1:0,toast:r});case 3:let{toastId:p}=o;return{...e,toasts:e.toasts.map(s=>s.id===p||p===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return o.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(s=>s.id!==o.toastId)};case 5:return{...e,pausedAt:o.time};case 6:let f=o.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+f}))}}},I=[],N={toasts:[],pausedAt:void 0},O=e=>{N=z(N,e),I.forEach(o=>{o(N)})},ve={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},xe=(e={})=>{let[o,r]=l.useState(N),p=l.useRef(N);l.useEffect(()=>(p.current!==N&&r(N),I.push(r),()=>{let s=I.indexOf(r);s>-1&&I.splice(s,1)}),[]);let f=o.toasts.map(s=>{var m,d,g;return{...e,...e[s.type],...s,removeDelay:s.removeDelay||((m=e[s.type])==null?void 0:m.removeDelay)||(e==null?void 0:e.removeDelay),duration:s.duration||((d=e[s.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||ve[s.type],style:{...e.style,...(g=e[s.type])==null?void 0:g.style,...s.style}}});return{...o,toasts:f}},ke=(e,o="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:o,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||we()}),T=e=>(o,r)=>{let p=ke(o,e,r);return O({type:2,toast:p}),p.id},h=(e,o)=>T("blank")(e,o);h.error=T("error");h.success=T("success");h.loading=T("loading");h.custom=T("custom");h.dismiss=e=>{O({type:3,toastId:e})};h.remove=e=>O({type:4,toastId:e});h.promise=(e,o,r)=>{let p=h.loading(o.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(f=>{let s=o.success?F(o.success,f):void 0;return s?h.success(s,{id:p,...r,...r==null?void 0:r.success}):h.dismiss(p),f}).catch(f=>{let s=o.error?F(o.error,f):void 0;s?h.error(s,{id:p,...r,...r==null?void 0:r.error}):h.dismiss(p)}),e};var Se=(e,o)=>{O({type:1,toast:{id:e,height:o}})},Ee=()=>{O({type:5,time:Date.now()})},j=new Map,$e=1e3,Ne=(e,o=$e)=>{if(j.has(e))return;let r=setTimeout(()=>{j.delete(e),O({type:4,toastId:e})},o);j.set(e,r)},Oe=e=>{let{toasts:o,pausedAt:r}=xe(e);l.useEffect(()=>{if(r)return;let s=Date.now(),m=o.map(d=>{if(d.duration===1/0)return;let g=(d.duration||0)+d.pauseDuration-(s-d.createdAt);if(g<0){d.visible&&h.dismiss(d.id);return}return setTimeout(()=>h.dismiss(d.id),g)});return()=>{m.forEach(d=>d&&clearTimeout(d))}},[o,r]);let p=l.useCallback(()=>{r&&O({type:6,time:Date.now()})},[r]),f=l.useCallback((s,m)=>{let{reverseOrder:d=!1,gutter:g=8,defaultPosition:u}=m||{},y=o.filter(C=>(C.position||u)===(s.position||u)&&C.height),w=y.findIndex(C=>C.id===s.id),v=y.filter((C,S)=>S<w&&C.visible).length;return y.filter(C=>C.visible).slice(...d?[v+1]:[0,v]).reduce((C,S)=>C+(S.height||0)+g,0)},[o]);return l.useEffect(()=>{o.forEach(s=>{if(s.dismissed)Ne(s.id,s.removeDelay);else{let m=j.get(s.id);m&&(clearTimeout(m),j.delete(s.id))}})},[o]),{toasts:o,handlers:{updateHeight:Se,startPause:Ee,endPause:p,calculateOffset:f}}},Pe=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,je=k`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Te=k`
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

  animation: ${Pe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${je} 0.15s ease-out forwards;
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
    animation: ${Te} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,De=k`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ie=$("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${De} 1s linear infinite;
`,Fe=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Me=k`
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
}`,_e=$("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Fe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Me} 0.2s ease-out forwards;
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
`,Le=$("div")`
  position: absolute;
`,Re=$("div")`
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
}`,Je=$("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ue} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Ge=({toast:e})=>{let{icon:o,type:r,iconTheme:p}=e;return o!==void 0?typeof o=="string"?l.createElement(Je,null,o):o:r==="blank"?null:l.createElement(Re,null,l.createElement(Ie,{...p}),r!=="loading"&&l.createElement(Le,null,r==="error"?l.createElement(Ae,{...p}):l.createElement(_e,{...p})))},ze=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,He=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,qe="0%{opacity:0;} 100%{opacity:1;}",Be="0%{opacity:1;} 100%{opacity:0;}",Ve=$("div")`
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
`,Ke=$("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,We=(e,o)=>{let r=e.includes("top")?1:-1,[p,f]=G()?[qe,Be]:[ze(r),He(r)];return{animation:o?`${k(p)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${k(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Ye=l.memo(({toast:e,position:o,style:r,children:p})=>{let f=e.height?We(e.position||o||"top-center",e.visible):{opacity:0},s=l.createElement(Ge,{toast:e}),m=l.createElement(Ke,{...e.ariaProps},F(e.message,e));return l.createElement(Ve,{className:e.className,style:{...f,...r,...e.style}},typeof p=="function"?p({icon:s,message:m}):l.createElement(l.Fragment,null,s,m))});ye(l.createElement);var Ze=({id:e,className:o,style:r,onHeightUpdate:p,children:f})=>{let s=l.useCallback(m=>{if(m){let d=()=>{let g=m.getBoundingClientRect().height;p(e,g)};d(),new MutationObserver(d).observe(m,{subtree:!0,childList:!0,characterData:!0})}},[e,p]);return l.createElement("div",{ref:s,className:o,style:r},f)},Xe=(e,o)=>{let r=e.includes("top"),p=r?{top:0}:{bottom:0},f=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:G()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${o*(r?1:-1)}px)`,...p,...f}},Qe=M`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,D=16,st=({reverseOrder:e,position:o="top-center",toastOptions:r,gutter:p,children:f,containerStyle:s,containerClassName:m})=>{let{toasts:d,handlers:g}=Oe(r);return l.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:D,left:D,right:D,bottom:D,pointerEvents:"none",...s},className:m,onMouseEnter:g.startPause,onMouseLeave:g.endPause},d.map(u=>{let y=u.position||o,w=g.calculateOffset(u,{reverseOrder:e,gutter:p,defaultPosition:o}),v=Xe(y,w);return l.createElement(Ze,{id:u.id,key:u.id,onHeightUpdate:g.updateHeight,className:u.visible?Qe:"",style:v},u.type==="custom"?F(u.message,u):f?f(u):l.createElement(Ye,{toast:u,position:y}))}))};const H=l.createContext(null),et=[],tt={appearingRules:{exitIntent:{enabled:!1,device:"desktop"},timeDelay:{enabled:!1,seconds:5},pageScroll:{enabled:!1,percentage:20},pageCount:{enabled:!1,pages:2},clicksCount:{enabled:!1,clicks:2},inactivity:{enabled:!1,seconds:30}},pageTargeting:{enabled:!0,url:"www.yourdomain.com",urls:[]},popupAgain:{enabled:!0,timer:{minutes:10,seconds:0}},displayFrequency:{enabled:!0,frequency:"once_a_day",visitorType:"everyone"}};function nt({children:e}){const{currentPlan:o}=de(),[r,p]=l.useState({connected:!1,checking:!0}),[f,s]=l.useState({name:"wheel-of-wonders",formatted:"wheel-of-wonders"}),[m,d]=l.useState(!1),[g,u]=l.useState({name:"Campaign Name",step:1,look:"custom",color:"singleTone",primaryColor:"#fe5300",secondaryColor:"#767676",tertiaryColor:"#444444",completionPercentage:25,rules:tt,shop:"wheel-of-wonders"}),[y,w]=l.useState(et),[v,C]=l.useState(!0),S=async n=>{const t=n.headers.get("content-type");if(!t||!t.includes("application/json"))return console.warn(`Expected JSON but got ${t}`),null;try{return await n.json()}catch(a){return console.error("Failed to parse JSON:",a),null}},q=()=>{let t=new URLSearchParams(window.location.search).get("shop");if(t)return console.log("Got shop from URL params:",t),t;try{if(t=localStorage.getItem("shopify_shop_domain"),t)return console.log("Got shop from localStorage:",t),t}catch{console.warn("Could not access localStorage")}if(window.shopOrigin)return t=window.shopOrigin,console.log("Got shop from window.shopOrigin:",t),t;const a=window.location.hostname;return a.includes(".myshopify.com")?(t=a,console.log("Got shop from hostname:",t),t):null};l.useEffect(()=>{(async()=>{try{const t=q();if(t){const c=t.replace(/\.myshopify\.com$/i,"");s({name:t,formatted:c});try{localStorage.setItem("shopify_shop_domain",t)}catch{console.warn("Could not store shop in localStorage")}}console.log("Attempting to fetch shop info from /app...");const a=await fetch("/app",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}});if(!a.ok){console.warn("App route returned non-OK status:",a.status),d(!0);return}const i=await S(a);if(i&&i.shop){const c=i.shop,b=c.replace(/\.myshopify\.com$/i,"");console.log("Got shop name from /app:",c),s({name:c,formatted:b});try{localStorage.setItem("shopify_shop_domain",c)}catch{console.warn("Could not store shop in localStorage")}u(P=>({...P,shop:c})),d(!1)}else console.warn("No shop data in response from /app"),d(!0)}catch(t){console.warn("Error getting shop info from /app:",t.message),d(!0);try{console.log("Trying fallback to /api/db-status...");const a=await fetch("/api/db-status",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}});if(a.ok){const i=await S(a);if(i&&i.shop){const c=i.shop,b=c.replace(/\.myshopify\.com$/i,"");console.log("Got shop name from db-status:",c),s({name:c,formatted:b});try{localStorage.setItem("shopify_shop_domain",c)}catch{console.warn("Could not store shop in localStorage")}u(P=>({...P,shop:c})),d(!1)}}}catch(a){console.warn("Fallback to db-status also failed:",a.message)}}})()},[]),l.useEffect(()=>{(async()=>{try{console.log("Checking database connection...");const t=await fetch("/api/db-status",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP error! Status: ${t.status}`);const a=await S(t);if(!a)throw new Error("Invalid JSON response from db-status");if(p({connected:a.connected,checking:!1,error:a.error,dbName:a.dbName,shop:a.shop}),a.shop){const i=a.shop.replace(/\.myshopify\.com$/i,"");s({name:a.shop,formatted:i});try{localStorage.setItem("shopify_shop_domain",a.shop)}catch{console.warn("Could not store shop in localStorage")}u(c=>({...c,shop:a.shop}))}a.connected?console.log(`MongoDB connected successfully to database: ${a.dbName}`):console.error("MongoDB connection failed:",a.error)}catch(t){console.error("Error checking DB connection:",t),p({connected:!1,checking:!1,error:t.message})}})()},[]),l.useEffect(()=>{(async()=>{if(r.checking||!r.connected){C(!1);return}try{C(!0),console.log("Loading campaigns from API...");const t=await fetch("/api/campaigns",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP error! Status: ${t.status}`);const a=await S(t);if(!a)throw new Error("Invalid JSON response from campaigns API");const i=a.campaigns||a;if(Array.isArray(i)&&i.length>0){if(w(i),console.log(`Loaded ${i.length} campaigns from MongoDB (${r.dbName})`),a.shop){const c=a.shop.replace(/\.myshopify\.com$/i,"");s({name:a.shop,formatted:c})}}else console.log(`No campaigns found in MongoDB (${r.dbName}), using sample data`)}catch(t){console.error("Error loading campaigns:",t),h.error("Failed to load campaigns")}finally{C(!1)}})()},[r]);const B=l.useCallback(n=>{u(t=>({...t,...n}))},[]),V=l.useCallback(n=>{u(t=>({...t,name:n||"Campaign Name"})),h.success("Campaign name updated!")},[]),K=l.useCallback(n=>{u(t=>({...t,look:n})),h.success(`Look updated to ${n}!`)},[]),W=l.useCallback(n=>{u(t=>({...t,color:n})),h.success(`Color type updated to ${n}!`)},[]),Y=l.useCallback((n,t)=>{u(a=>{const i={...a};return n==="primary"?i.primaryColor=t:n==="secondary"?i.secondaryColor=t:n==="tertiary"&&(i.tertiaryColor=t),i}),h.success(`${n} color updated!`)},[]),Z=l.useCallback((n,t)=>{console.log(`Updating campaign rules: ${n}`,t),u(a=>{const i=a.rules||{},c=i[n]?{...i[n]}:{},b={...i,[n]:{...c,...t}};return console.log("Updated rules:",b),{...a,rules:b}})},[]),X=l.useCallback((n,t=null)=>{u(i=>{const c={...i.rules};return t?c[n]={...c[n],[t]:{...c[n][t],enabled:!c[n][t].enabled}}:c[n]={...c[n],enabled:!c[n].enabled},{...i,rules:c}});const a=t||n;h.success(`${a.charAt(0).toUpperCase()+a.slice(1)} ${t?"rule":""} toggled!`)},[]),Q=l.useCallback((n,t,a,i)=>{u(c=>{const b={...c.rules};return b[n]={...b[n],[t]:{...b[n][t],[a]:i}},{...c,rules:b}})},[]),ee=l.useCallback(n=>{n&&(u(t=>{if(t.rules.pageTargeting.urls.includes(n))return t;const a={...t.rules.pageTargeting,urls:[...t.rules.pageTargeting.urls,n]};return{...t,rules:{...t.rules,pageTargeting:a}}}),h.success(`URL "${n}" added to page targeting!`))},[]),te=l.useCallback(n=>{u(t=>{const a=t.rules.pageTargeting.urls.filter(i=>i!==n);return{...t,rules:{...t.rules,pageTargeting:{...t.rules.pageTargeting,urls:a}}}}),h.success(`URL "${n}" removed from page targeting!`)},[]),ae=l.useCallback(()=>{u(n=>{const t=Math.min(4,n.step+1),a=Math.min(100,t/4*100);return{...n,step:t,completionPercentage:a}}),h.success("Moving to next step!")},[]),oe=l.useCallback(()=>{u(n=>{const t=Math.max(1,n.step-1),a=Math.max(25,t/4*100);return{...n,step:t,completionPercentage:a}}),h.success("Moving to previous step!")},[]),se=l.useCallback(()=>y.length<o.campaignLimit,[y.length,o.campaignLimit]),A=l.useCallback(async n=>{const t=y.filter(a=>a.id!==n&&a.status==="active");if(t.length!==0){if(console.log(`Deactivating ${t.length} other active campaigns`),r.connected)for(const a of t)try{await fetch(`/api/campaigns/${a.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({...a,status:"draft"})})}catch(i){console.error(`Failed to deactivate campaign ${a.id}:`,i)}w(a=>a.map(i=>i.id!==n&&i.status==="active"?{...i,status:"draft"}:i)),t.length>0&&h.success(`Deactivated ${t.length} other campaign(s)`)}},[y,r.connected]),ne=l.useCallback(async n=>{let t;try{if(console.log("Saving campaign:",n),t={...n,id:n.id||`campaign-${Date.now()}`,name:n.name||"Campaign Name",createdAt:n.createdAt||new Date().toISOString(),status:n.status||"draft",primaryColor:n.primaryColor||"#fe5300",secondaryColor:n.secondaryColor||"#767676",tertiaryColor:n.tertiaryColor||"#444444",look:n.look||"custom",color:n.color||"singleTone",rules:n.rules||g.rules||{appearingRules:{exitIntent:{enabled:!0,device:"desktop"},timeDelay:{enabled:!0,seconds:5},pageScroll:{enabled:!0,percentage:20},pageCount:{enabled:!1,pages:2},clicksCount:{enabled:!1,clicks:2},inactivity:{enabled:!1,seconds:30}},pageTargeting:{enabled:!0,url:"www.yourdomain.com",urls:[]},popupAgain:{enabled:!0,timer:{minutes:10,seconds:0}},displayFrequency:{enabled:!0,frequency:"once_a_day",visitorType:"everyone"}},shop:f.name||n.shop||"wheel-of-wonders.myshopify.com"},t.status==="active"&&await A(t.id),console.log("Campaign to save with shop info:",t),r.connected)if(y.findIndex(i=>i.id===t.id)>=0){console.log(`Updating existing campaign with ID: ${t.id}`);const i=await fetch(`/api/campaigns/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!i.ok)throw new Error(`Failed to update campaign: ${i.statusText}`);const c=await i.json();if(console.log("Campaign updated successfully:",c),c.shop){const b=c.shop.replace(/\.myshopify\.com$/i,"");s({name:c.shop,formatted:b})}}else{console.log("Creating new campaign");const i=await fetch("/api/campaigns",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!i.ok)throw new Error(`Failed to create campaign: ${i.statusText}`);const c=await i.json();if(console.log("Campaign created successfully:",c),c.shop){const b=c.shop.replace(/\.myshopify\.com$/i,"");s({name:c.shop,formatted:b})}}else console.log("Database not connected, only updating local state");if(w(a=>a.findIndex(c=>c.id===t.id)>=0?a.map(c=>c.id===t.id?t:c):[...a,t]),u(a=>({...a,...t})),t.status==="active")try{console.log("Syncing saved active campaign to metafields...");const a=await fetch("/api/sync-campaign-metafields",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({campaignId:t.id})});if(a.ok){const i=await a.json();console.log("Campaign synced to metafields successfully:",i),h.success("Campaign saved and synced to storefront!")}else console.warn("Failed to sync campaign to metafields"),h.success("Campaign saved! Sync to storefront may take a moment.")}catch(a){console.error("Error syncing campaign to metafields:",a),h.success("Campaign saved! Sync to storefront may take a moment.")}else h.success("Campaign saved successfully!");return t}catch(a){console.error("Error saving campaign:",a),h.error(`Failed to save campaign: ${a.message}`);const i=y.findIndex(c=>c.id===t.id);return w(c=>i>=0?c.map(b=>b.id===t.id?t:b):[...c,t]),t}},[y,g.rules,r.connected,f.name,A]),re=l.useCallback(async n=>{try{if(r.connected){const t=await fetch(`/api/campaigns/${n}`,{method:"DELETE"});if(!t.ok)throw new Error(`Failed to delete campaign: ${t.statusText}`)}return w(t=>t.filter(a=>a.id!==n)),h.success("Campaign deleted successfully!"),{success:!0}}catch(t){return console.error("Error deleting campaign:",t),h.error(`Failed to delete campaign: ${t.message}`),w(a=>a.filter(i=>i.id!==n)),{success:!0}}},[r.connected]),ie=l.useCallback(async n=>{try{const t=y.find(i=>i.id===n);if(!t)throw new Error("Campaign not found");const a=t.status==="active"?"draft":"active";if(a==="active"&&await A(n),r.connected){const i=new FormData;i.append("status",a),i.append("shop",f.name||"");const c=await fetch(`/api/campaigns/status/${n}`,{method:"POST",body:i});if(!c.ok)throw new Error(`Failed to toggle campaign status: ${c.statusText}`)}if(w(i=>i.map(c=>c.id===n?{...c,status:a}:c)),a==="active")try{console.log("Syncing newly activated campaign to metafields...");const i=await fetch("/api/sync-campaign-metafields",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({campaignId:n})});if(i.ok){const c=await i.json();console.log("Campaign synced to metafields successfully:",c),h.success("Campaign activated and synced to storefront!")}else console.warn("Failed to sync campaign to metafields"),h.success("Campaign activated! Sync to storefront may take a moment.")}catch(i){console.error("Error syncing campaign to metafields:",i),h.success("Campaign activated! Sync to storefront may take a moment.")}else try{console.log("Clearing metafields for deactivated campaign..."),(await fetch("/api/sync-campaign-metafields",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({campaignId:null,clear:!0})})).ok?(console.log("Metafields cleared successfully"),h.success("Campaign deactivated and removed from storefront!")):(console.warn("Failed to clear metafields"),h.success("Campaign deactivated!"))}catch(i){console.error("Error clearing metafields:",i),h.success("Campaign deactivated!")}return{success:!0,status:a}}catch(t){console.error("Error toggling campaign status:",t),h.error(`Failed to toggle campaign status: ${t.message}`);const a=y.find(i=>i.id===n);if(a){const i=a.status==="active"?"draft":"active";return w(i==="active"?c=>c.map(b=>b.id===n?{...b,status:i}:b.status==="active"?{...b,status:"draft"}:b):c=>c.map(b=>b.id===n?{...b,status:i}:b)),{success:!0,status:i}}return{success:!1}}},[y,r.connected,A,f.name]),ce=l.useCallback(()=>y.find(n=>n.status==="active")||null,[y]);return le.jsx(H.Provider,{value:{campaignData:g,allCampaigns:y,isLoading:v,dbStatus:r,shopInfo:f,isOfflineMode:m,updateCampaignData:B,updateCampaignName:V,updateLook:K,updateColor:W,updateColorValues:Y,updateCampaignRules:Z,toggleRuleEnabled:X,updateRuleValue:Q,addPageTargetingUrl:ee,removePageTargetingUrl:te,nextStep:ae,prevStep:oe,saveCampaign:ne,deleteCampaign:re,toggleCampaignStatus:ie,checkCanCreateCampaign:se,getActiveCampaign:ce},children:e})}function rt(){const e=l.useContext(H);if(!e)throw new Error("useCampaign must be used within a CampaignProvider");return e}export{nt as C,st as O,h as c,rt as u};
