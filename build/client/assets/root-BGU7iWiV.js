import{j as e}from"./jsx-runtime-DlxonYWr.js";import{C,O as p}from"./CampaignContext-DDS0XVRo.js";import{P as g}from"./PlanContext-CABF9B4g.js";import{r as n}from"./index-DL0tHwE6.js";import{s as f}from"./global-BF7rpx99.js";import{c as O,d as h,_ as y,a as w,M as x,e as _,S as L}from"./components-JNt_2cPA.js";import{u as j,d as N,O as D}from"./index-DRO-3EAr.js";import"./_commonjsHelpers-D6-XlEtG.js";import"./index-a8qEWjHG.js";/**
 * @remix-run/react v2.16.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let l="positions";function E({getKey:o,...t}){let{isSpaMode:s}=O(),d=j(),c=N();h({getKey:o,storageKey:l});let u=n.useMemo(()=>{if(!o)return null;let r=o(d,c);return r!==d.key?r:null},[]);if(s)return null;let S=((r,m)=>{if(!window.history.state||!window.history.state.key){let i=Math.random().toString(32).slice(2);window.history.replaceState({key:i},"")}try{let a=JSON.parse(sessionStorage.getItem(r)||"{}")[m||window.history.state.key];typeof a=="number"&&window.scrollTo(0,a)}catch(i){console.error(i),sessionStorage.removeItem(r)}}).toString();return n.createElement("script",y({},t,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${S})(${JSON.stringify(l)}, ${JSON.stringify(u)})`}}))}const B=()=>[{rel:"stylesheet",href:f}];function R(){const o=w();return n.useEffect(()=>{if(typeof window<"u")if(o.discountCodes&&o.discountCodes.length>0){window.GLOBAL_DISCOUNT_CODES=o.discountCodes,console.log("Root - Setting global discount codes:",o.discountCodes);try{localStorage.setItem("GLOBAL_DISCOUNT_CODES",JSON.stringify(o.discountCodes))}catch(t){console.error("Failed to store discount codes in localStorage:",t)}}else try{const t=localStorage.getItem("GLOBAL_DISCOUNT_CODES");if(t){const s=JSON.parse(t);s&&s.length>0&&(window.GLOBAL_DISCOUNT_CODES=s,console.log("Root - Using stored discount codes from localStorage:",s.length))}}catch(t){console.error("Failed to retrieve discount codes from localStorage:",t)}},[o.discountCodes]),e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx("link",{rel:"icon",href:"/favicon.ico",type:"image/x-icon"}),e.jsx("title",{children:"Spinorama"}),e.jsx(x,{}),e.jsx(_,{})]}),e.jsxs("body",{children:[e.jsx(g,{initialDiscountCodes:o.discountCodes||[],children:e.jsxs(C,{children:[e.jsx(D,{}),e.jsx(p,{position:"top-right"})]})}),e.jsx(E,{}),e.jsx(L,{}),e.jsx("script",{dangerouslySetInnerHTML:{__html:`
              window.ENV = ${JSON.stringify(o.ENV)};
              let storedCodes;
              try {
                storedCodes = localStorage.getItem("GLOBAL_DISCOUNT_CODES");
                storedCodes = storedCodes ? JSON.parse(storedCodes) : [];
              } catch (e) {
                console.error("Error parsing stored discount codes:", e);
                storedCodes = [];
              }
              const serverCodes = ${JSON.stringify(o.discountCodes||[])};
              window.GLOBAL_DISCOUNT_CODES = serverCodes.length > 0 ? serverCodes : storedCodes;
              console.log("Global discount codes initialized:", window.GLOBAL_DISCOUNT_CODES);
            `}})]})]})}export{R as default,B as links};
