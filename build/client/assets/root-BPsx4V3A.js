import{j as t}from"./jsx-runtime-DlxonYWr.js";import{c as u,d as f,_ as x,M as y,e as S,S as j}from"./components-BEwuW2UH.js";import{u as w,d as g,O as k}from"./index-CuNWEgFx.js";import{r as n}from"./index-BWtVRBRF.js";import"./index-Crcs4hqE.js";import"./_commonjsHelpers-gnU0ypJ3.js";/**
 * @remix-run/react v2.16.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function M({getKey:r,...l}){let{isSpaMode:c}=u(),o=w(),p=g();f({getKey:r,storageKey:a});let m=n.useMemo(()=>{if(!r)return null;let e=r(o,p);return e!==o.key?e:null},[]);if(c)return null;let h=((e,d)=>{if(!window.history.state||!window.history.state.key){let s=Math.random().toString(32).slice(2);window.history.replaceState({key:s},"")}try{let i=JSON.parse(sessionStorage.getItem(e)||"{}")[d||window.history.state.key];typeof i=="number"&&window.scrollTo(0,i)}catch(s){console.error(s),sessionStorage.removeItem(e)}}).toString();return n.createElement("script",x({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${h})(${JSON.stringify(a)}, ${JSON.stringify(m)})`}}))}function J(){return t.jsxs("html",{children:[t.jsxs("head",{children:[t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width,initial-scale=1"}),t.jsx("link",{rel:"preconnect",href:"https://cdn.shopify.com/"}),t.jsx("link",{rel:"stylesheet",href:"https://cdn.shopify.com/static/fonts/inter/v4/styles.css"}),t.jsx("link",{rel:"icon",href:"/favicon.ico",type:"image/x-icon"}),t.jsx("title",{children:"Spinorama"})," ",t.jsx(y,{}),t.jsx(S,{})]}),t.jsxs("body",{children:[t.jsx(k,{}),t.jsx(M,{}),t.jsx(j,{})]})]})}export{J as default};
