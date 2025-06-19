import{j as e}from"./jsx-runtime-DlxonYWr.js";import{C as g,O as C}from"./CampaignContext-DDS0XVRo.js";import{P as f}from"./PlanContext-CABF9B4g.js";import{r as n}from"./index-DL0tHwE6.js";import{d as p,e as h,_ as O,a as y,M as w,f as x,S as _}from"./components-DPlD0s3O.js";import{u as L,d as j,O as N}from"./index-DRO-3EAr.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./index-a8qEWjHG.js";/**
 * @remix-run/react v2.16.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let l="positions";function D({getKey:o,...s}){let{isSpaMode:t}=p(),d=L(),c=j();h({getKey:o,storageKey:l});let u=n.useMemo(()=>{if(!o)return null;let r=o(d,c);return r!==d.key?r:null},[]);if(t)return null;let S=((r,m)=>{if(!window.history.state||!window.history.state.key){let i=Math.random().toString(32).slice(2);window.history.replaceState({key:i},"")}try{let a=JSON.parse(sessionStorage.getItem(r)||"{}")[m||window.history.state.key];typeof a=="number"&&window.scrollTo(0,a)}catch(i){console.error(i),sessionStorage.removeItem(r)}}).toString();return n.createElement("script",O({},s,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${S})(${JSON.stringify(l)}, ${JSON.stringify(u)})`}}))}const I="/assets/global-B-9vIcuz.css",J=()=>[{rel:"stylesheet",href:I}];function M(){const o=y();return n.useEffect(()=>{if(typeof window<"u")if(o.discountCodes&&o.discountCodes.length>0){window.GLOBAL_DISCOUNT_CODES=o.discountCodes,console.log("Root - Setting global discount codes:",o.discountCodes);try{localStorage.setItem("GLOBAL_DISCOUNT_CODES",JSON.stringify(o.discountCodes))}catch(s){console.error("Failed to store discount codes in localStorage:",s)}}else try{const s=localStorage.getItem("GLOBAL_DISCOUNT_CODES");if(s){const t=JSON.parse(s);t&&t.length>0&&(window.GLOBAL_DISCOUNT_CODES=t,console.log("Root - Using stored discount codes from localStorage:",t.length))}}catch(s){console.error("Failed to retrieve discount codes from localStorage:",s)}},[o.discountCodes]),e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx("link",{rel:"icon",href:"/favicon.ico",type:"image/x-icon"}),e.jsx("title",{children:"Spinorama"})," ",e.jsx(w,{}),e.jsx(x,{})]}),e.jsxs("body",{children:[e.jsx(f,{initialDiscountCodes:o.discountCodes||[],children:e.jsxs(g,{children:[e.jsx(N,{}),e.jsx(C,{position:"top-right"})]})}),e.jsx(D,{}),e.jsx(_,{}),e.jsx("script",{dangerouslySetInnerHTML:{__html:`
              window.ENV = ${JSON.stringify(o.ENV)};
              
              // Try to get codes from localStorage first
              let storedCodes;
              try {
                storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
                storedCodes = storedCodes ? JSON.parse(storedCodes) : [];
              } catch (e) {
                console.error("Error parsing stored discount codes:", e);
                storedCodes = [];
              }
              
              // Use server-provided codes if available, otherwise use stored codes
              const serverCodes = ${JSON.stringify(o.discountCodes||[])};
              window.GLOBAL_DISCOUNT_CODES = serverCodes.length > 0 ? serverCodes : storedCodes;
              
              console.log("Global discount codes initialized:", window.GLOBAL_DISCOUNT_CODES);
            `}})]})]})}export{M as default,J as links};
