import{r as e,R as t,a as r}from"./vendor.204608bf.js";const n=()=>{const r=e.exports.useRef(null),n=e.exports.useRef(null),[c,o]=e.exports.useState(!0),[a,u]=e.exports.useState([]);return t.createElement("div",{className:"App"},t.createElement("header",{className:"header"},"Just write"),c?t.createElement(l,{letters:a,setLetters:u}):t.createElement(s,{letters:a}),t.createElement("button",{ref:r,onClick:()=>{r.current.blur(),o((e=>!e))}},c?"read":"write"),t.createElement("button",{ref:n,onClick:()=>{n.current.blur(),u([])}},"clear"))},s=e=>{const r=e.letters.map((e=>e.letter)).join("");return t.createElement("div",{className:"writing-container"},r)},l=r=>{const{letters:n,setLetters:s}=r,l=e.exports.useRef(null),c=e.exports.useRef(null),o=void 0!==n[n.length-1]?n[n.length-1].time+10:0,a=e.exports.useRef(o),[u,i]=e.exports.useState(0),[m,d]=e.exports.useState(!1),p=e.exports.useCallback((e=>[e%u,40*Math.floor(e/u)]),[u]);e.exports.useEffect((()=>{0===n.length&&(a.current=0)}),[n]),e.exports.useEffect((()=>{i(l.current.clientWidth);const e=()=>{i(l.current.clientWidth)};return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}}),[]),e.exports.useEffect((()=>{const e=e=>{e.preventDefault(),d(!0)," "===e.key&&(a.current+=4);const t={time:a.current,letter:e.key};s((e=>[...e,t]))};return window.addEventListener("keypress",e),()=>{window.removeEventListener("keypress",e)}}),[m,s]),e.exports.useEffect((()=>{const e=e=>{var t;if("Backspace"===e.key){if(d(!0),n.length<=1)return s([]),void d(!1);const{time:e}=null!=(t=n[n.length-1])?t:{time:0};s((e=>e.slice(0,e.length-1))),a.current=e}};return window.addEventListener("keydown",e),()=>{window.removeEventListener("keydown",e)}}),[m,n,s]),e.exports.useEffect((()=>{let e=0;const t=()=>{e=requestAnimationFrame(t),m&&(a.current+=2);const[r,n]=p(a.current);c.current.style.transform=`translate(${r}px, ${n}px)`};return t(),()=>{cancelAnimationFrame(e)}}),[p,m]);const f=e.exports.useMemo((()=>n.map(((e,r)=>{const{time:n,letter:s}=e,[l,c]=p(n),o={transform:`translate(${l}px, ${c}px)`};return t.createElement("div",{className:"letter",style:o,key:r},s)}))),[p,n]);return t.createElement("div",{className:"writing-container",ref:l},t.createElement("div",{className:"caret",ref:c}),f)};r.render(t.createElement(t.StrictMode,null,t.createElement(n,null)),document.getElementById("root"));