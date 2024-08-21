import{c as t,j as e,t as r}from"./index-DH1Cld9_.js";const c=t("/about")({component:l}),s=({className:n,...a})=>e.jsx("p",{className:r("my-2 first:mt-0 last:mb-0",n),...a}),i=({className:n,...a})=>e.jsx("h2",{className:r("my-3 font-bold first:mt-0 last:mb-0",n),...a});function l(){return e.jsx("div",{className:"max-w-lg p-2 md:pr-32",children:e.jsxs("div",{children:[e.jsx(s,{children:"Yet another implementation of a classic game."}),e.jsx(i,{children:"How to play"}),e.jsx(s,{children:"Open all squares without mines. Clicking on a mine ends the game."}),e.jsxs(s,{children:["Each opened square displays a number that reflects how many mines there are in 8 squares around it (its ",e.jsx("i",{children:"neighbors"}),"). Squares with no mined neighbors display no number."]}),e.jsx(i,{children:"Controls"}),e.jsxs(s,{children:["Use left click to ",e.jsx("b",{children:"open"})," a closed square."]}),e.jsxs(s,{children:["Use right click to place a ",e.jsx("b",{children:"flag"})," on a closed square."]}),e.jsxs(s,{children:["If the number of flags near an opened square equals the number inside the square, you can open all neighboring squares at once by clicking on the opened square (this is called a"," ",e.jsx("b",{children:e.jsx("i",{children:"chord"})}),")."]})]})})}export{c as Route};