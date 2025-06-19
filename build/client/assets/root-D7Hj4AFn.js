import{r as n,j as e}from"./index-Dxzwlmmu.js";import{C,O as m}from"./CampaignContext-C7gPG95t.js";import{P as f}from"./PlanContext-CgoqeIeO.js";import{d as p,e as h,_ as O,a as y,M as w,f as x,S as _}from"./components-DcZ5TJaC.js";import{u as L,d as j,O as N}from"./index-CKWc00xI.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./index-K0fwup_a.js";/**
 * @remix-run/react v2.16.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let l="positions";function D({getKey:o,...s}){let{isSpaMode:t}=p(),d=L(),c=j();h({getKey:o,storageKey:l});let u=n.useMemo(()=>{if(!o)return null;let r=o(d,c);return r!==d.key?r:null},[]);if(t)return null;let S=((r,g)=>{if(!window.history.state||!window.history.state.key){let i=Math.random().toString(32).slice(2);window.history.replaceState({key:i},"")}try{let a=JSON.parse(sessionStorage.getItem(r)||"{}")[g||window.history.state.key];typeof a=="number"&&window.scrollTo(0,a)}catch(i){console.error(i),sessionStorage.removeItem(r)}}).toString();return n.createElement("script",O({},s,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${S})(${JSON.stringify(l)}, ${JSON.stringify(u)})`}}))}const I="/assets/global-B-9vIcuz.css",G=()=>[{rel:"stylesheet",href:I}];function J(){const o=y();return n.useEffect(()=>{if(typeof window<"u")if(o.discountCodes&&o.discountCodes.length>0){window.GLOBAL_DISCOUNT_CODES=o.discountCodes,console.log("Root - Setting global discount codes:",o.discountCodes);try{localStorage.setItem("GLOBAL_DISCOUNT_CODES",JSON.stringify(o.discountCodes))}catch(s){console.error("Failed to store discount codes in localStorage:",s)}}else try{const s=localStorage.getItem("GLOBAL_DISCOUNT_CODES");if(s){const t=JSON.parse(s);t&&t.length>0&&(window.GLOBAL_DISCOUNT_CODES=t,console.log("Root - Using stored discount codes from localStorage:",t.length))}}catch(s){console.error("Failed to retrieve discount codes from localStorage:",s)}},[o.discountCodes]),e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx("link",{rel:"icon",href:"/favicon.ico",type:"image/x-icon"}),e.jsx("title",{children:"Spinorama"})," ",e.jsx(w,{}),e.jsx(x,{})]}),e.jsxs("body",{children:[e.jsx(f,{initialDiscountCodes:o.discountCodes||[],children:e.jsxs(C,{children:[e.jsx(N,{}),e.jsx(m,{position:"top-right"})]})}),e.jsx(D,{}),e.jsx(_,{}),e.jsx("script",{dangerouslySetInnerHTML:{__html:`
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
            `}})]})]})}export{J as default,G as links};
