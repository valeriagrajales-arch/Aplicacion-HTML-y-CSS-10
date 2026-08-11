
/* ===== V9: safe lesson state initialization =====
   These variables must exist before render/update functions execute.
*/
var htmlStep = 0;
var cssStep = 0;
var goodStep = 0;


/* ===== V9: safe lesson state initialization =====
   These variables must exist before render/update functions execute.
*/




const STORAGE="aulaWeb10Complete";
const TEACHER_KEY="Aula10-2026";
let dbMode=false;
const DEFAULT_STATE={
 role:null,student:null,html:false,css:false,flex:false,goodPractices:false,practice:false,
 project:0,quiz:0,projectChecks:{},projectHTML:"",projectCSS:"",projectAudit:0,
 createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()
};
let state=Object.assign({},DEFAULT_STATE,JSON.parse(localStorage.getItem(STORAGE)||"null")||{});
state.projectChecks=state.projectChecks||{};
state.vsChecks=state.vsChecks||{};
state.lessonQuizzes=state.lessonQuizzes||{};
state.quizScores=state.quizScores||{};
state.webExamples=!!state.webExamples;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const escapeHTML=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function save(){state.updatedAt=new Date().toISOString();localStorage.setItem(STORAGE,JSON.stringify(state));updateStudentUI();if(state.role==="student")syncStudent();}
function showToast(t){const x=$("#toast");if(!x)return;x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2400)}
window.showToast=showToast;

function enterStudent(){
 const name=$("#studentName").value.trim(),group=$("#studentGroup").value.trim();
 if(!name||!group)return showToast("Escribe tu nombre y grupo.");
 state.role="student";state.student={name,group,id:studentId(name,group)};save();openApp("student");show("home");
}
function enterTeacher(){
 if($("#teacherKey").value!==TEACHER_KEY)return showToast("Clave docente incorrecta. Revisa README.md.");
 state.role="teacher";openApp("teacher");show("teacherDash");renderTeacher();
}
function openApp(role){
 $("#authView").classList.add("hidden");$("#appView").classList.remove("hidden");
 $("#studentNav").classList.toggle("hidden",role!=="student");$("#teacherNav").classList.toggle("hidden",role!=="teacher");
 $("#studentIdentity").classList.toggle("hidden",role!=="student");$("#teacherIdentity").classList.toggle("hidden",role!=="teacher");
 $("#roleLabel").textContent=role==="teacher"?"Panel docente · Grado 10":"10° · Diseño y Desarrollo Web";
 $("#userNameTop").textContent=role==="student"?state.student.name:"Docente";
 if(role==="student"){ $("#identityName").textContent=state.student.name;$("#identityGroup").textContent=state.student.group; }
}
function logout(){state.role=null;localStorage.setItem(STORAGE,JSON.stringify(state));$("#appView").classList.add("hidden");$("#authView").classList.remove("hidden");}
function moduleRequirement(id){
 const req={
   html:null,
   vscode:"html",
   css:"vscode",
   flex:"css",
   goodPractices:"flex",
   webExamples:"goodPractices",
   practice:"webExamples",
   project:"practice",
   result:"project"
 };
 return req[id]===undefined?null:req[id];
}
function canOpenPage(id){
  return true;
}
function lockedMessage(id){
 const labels={html:"HTML5",vscode:"Crear archivos en VS Code",css:"CSS",flex:"Flexbox",goodPractices:"Buenas prácticas",webExamples:"Web reales",practice:"Laboratorio",project:"Proyecto final",result:"Mi avance"};
 const req=moduleRequirement(id);
 const reqLabel=labels[req]||"la lección anterior";
 showToast(`🔒 Primero debes completar: ${reqLabel}.`);
}
function show(id){
 if(!canOpenPage(id)){lockedMessage(id);return;}
 $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));
 $$(".side-nav").forEach(n=>n.classList.toggle("active",n.dataset.page===id));
 if(id.startsWith("teacher"))renderTeacher();
 if(id==="result")renderResult();
 window.scrollTo({top:0,behavior:"smooth"});
}
$("#studentEnter").onclick=enterStudent;$("#teacherEnter").onclick=enterTeacher;$("#logoutBtn").onclick=logout;
$$(".auth-tab").forEach(t=>t.onclick=()=>{$$(".auth-tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");$("#studentAuth").classList.toggle("hidden",t.dataset.auth!=="student");$("#teacherAuth").classList.toggle("hidden",t.dataset.auth!=="teacher")});
$$(".side-nav").forEach(n=>n.onclick=()=>show(n.dataset.page));
$$("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));

const htmlSteps=[
 {title:'Fundamentos',desc:'Comprende la estructura base: doctype, html, head y body.'},
 {title:'Semántica',desc:'Elige etiquetas que describen la función del contenido.'},
 {title:'Contenido',desc:'Organiza títulos, párrafos, listas, enlaces y formato de texto.'},
 {title:'Multimedia',desc:'Integra imágenes, video e iframe con atributos útiles.'},
 {title:'Accesibilidad',desc:'Haz que tu contenido pueda ser entendido y usado por más personas.'},
 {title:'Formularios',desc:'Construye formularios claros y relaciona label con input.'},
 {title:'Tablas',desc:'Presenta datos estructurados con filas, encabezados y celdas.'}
];
const cssSteps=[
 {title:'Selectores',desc:'Aprende a seleccionar elementos con etiqueta, clase e ID.'},
 {title:'Texto',desc:'Controla color, tamaño, peso, alineación y legibilidad.'},
 {title:'Box Model',desc:'Comprende content, padding, border y margin.'},
 {title:'Fondos',desc:'Usa color, imagen, gradientes y contraste con intención.'},
 {title:'Responsive',desc:'Adapta el diseño a celulares, tabletas y computadores.'},
 {title:'CSS externo',desc:'Separa estructura y presentación para mantener proyectos ordenados.'}
];
const goodSteps=[
 {title:'Nombres claros',desc:'Usa nombres que expliquen qué representa cada elemento.'},
 {title:'Accesibilidad',desc:'Prioriza contraste, texto alternativo, foco y etiquetas claras.'},
 {title:'Responsive',desc:'Comprueba que la interfaz siga siendo usable en pantallas pequeñas.'}
];
const htmlTabs=['html-basic','html-semantic','html-content','html-media','html-accessibility','html-forms','html-tables'];
const cssTabs=['css-selectors','css-text','css-box','css-background','css-responsive','css-structure'];

const lessonQuizData={
 "html-basic":{title:"Quiz · Fundamentos HTML",questions:[
  ["¿Qué elemento contiene el contenido visible de la página?",["head","body","title"],"body"],
  ["¿Para qué sirve <!doctype html>?",["Indica HTML5 al navegador","Crea un párrafo","Conecta el CSS"],"Indica HTML5 al navegador"],
  ["¿Dónde se coloca normalmente el <title>?",["body","footer","head"],"head"]]},
 "html-semantic":{title:"Quiz · HTML semántico",questions:[
  ["¿Qué etiqueta representa la navegación?",["nav","section","footer"],"nav"],
  ["¿Qué etiqueta representa el contenido principal?",["main","aside","header"],"main"],
  ["¿Para qué sirve article?",["Contenido independiente","Solo para imágenes","Cambiar colores"],"Contenido independiente"]]},
 "html-content":{title:"Quiz · Texto y listas",questions:[
  ["¿Qué lista usarías para pasos que deben seguir un orden?",["ul","ol","dl"],"ol"],
  ["¿Qué etiqueta expresa importancia semántica?",["strong","big","bigger"],"strong"],
  ["¿Para qué sirve <a>?",["Crear un enlace","Crear una tabla","Cambiar el fondo"],"Crear un enlace"]]},
 "html-media":{title:"Quiz · Multimedia",questions:[
  ["¿Qué atributo describe una imagen?",["src","alt","href"],"alt"],
  ["¿Qué elemento incrusta un video?",["video","picture","audio-text"],"video"],
  ["¿Para qué sirve iframe?",["Incrustar otro recurso/página","Crear una lista","Definir una clase"],"Incrustar otro recurso/página"]]},
 "html-accessibility":{title:"Quiz · Accesibilidad",questions:[
  ["¿Qué ayuda a una persona que no puede ver una imagen?",["alt descriptivo","color rojo","margin"],"alt descriptivo"],
  ["¿Qué elemento relaciona un texto con un campo de formulario?",["label","span","div"],"label"],
  ["¿Qué es importante para el teclado?",["Foco visible","Solo animaciones","Texto pequeño"],"Foco visible"]]},
 "html-forms":{title:"Quiz · Formularios",questions:[
  ["¿Qué atributo conecta label con input?",["for + id","href + src","class + style"],"for + id"],
  ["¿Qué tipo sirve para correo?",["email","text-only","mailbox"],"email"],
  ["¿Qué botón envía un formulario?",["submit","send-page","go"],"submit"]]},
 "html-tables":{title:"Quiz · Tablas",questions:[
  ["¿Qué etiqueta representa un encabezado de tabla?",["th","td","tr-title"],"th"],
  ["¿Qué etiqueta representa una fila?",["tr","row","line"],"tr"],
  ["¿Cuándo conviene una tabla?",["Datos tabulares","Para hacer el layout general","Para separar botones"],"Datos tabulares"]]},
 "css-selectors":{title:"Quiz · Selectores",questions:[
  ["¿Qué selector selecciona todos los p?",["p",".p","#p"],"p"],
  ["¿Qué selector representa una clase?",["#card",".card","card"],".card"],
  ["¿Qué selector tiene mayor especificidad?",["p",".card","#card"],"#card"]]},
 "css-text":{title:"Quiz · Texto CSS",questions:[
  ["¿Qué cambia el tamaño de letra?",["font-size","text-size","size-font"],"font-size"],
  ["¿Qué cambia el color del texto?",["color","background","paint"],"color"],
  ["¿Qué centra texto horizontalmente?",["text-align:center","align:center","font-center"],"text-align:center"]]},
 "css-box":{title:"Quiz · Box Model",questions:[
  ["¿Qué crea espacio dentro del borde?",["padding","margin","outline"],"padding"],
  ["¿Qué crea espacio fuera de la caja?",["margin","padding","content"],"margin"],
  ["¿Cuál es una capa del Box Model?",["border","display","selector"],"border"]]},
 "css-background":{title:"Quiz · Fondos",questions:[
  ["¿Qué propiedad define el color de fondo?",["background-color","color-bg","fill"],"background-color"],
  ["¿Qué mejora la legibilidad entre texto y fondo?",["Contraste","Más elementos","Más sombras"],"Contraste"],
  ["¿Qué puede usar una página como fondo?",["Color, imagen o gradiente","Solo imágenes","Solo blanco"],"Color, imagen o gradiente"]]},
 "css-responsive":{title:"Quiz · Responsive",questions:[
  ["¿Qué regla permite cambiar estilos según el ancho?",["@media","@screen-only","@responsive"],"@media"],
  ["¿Qué dispositivo debemos considerar?",["Celular, tablet y computador","Solo computador","Solo celular"],"Celular, tablet y computador"],
  ["¿Qué ayuda a que elementos Flex se acomoden?",["flex-wrap","float-only","position-fixed"],"flex-wrap"]]},
 "css-structure":{title:"Quiz · CSS externo",questions:[
  ["¿Qué conecta HTML con style.css?",["link rel=stylesheet","script css","import html"],"link rel=stylesheet"],
  ["¿Por qué separar CSS?",["Orden y mantenimiento","Para ocultar HTML","Para evitar usar clases"],"Orden y mantenimiento"],
  ["¿Dónde se coloca normalmente el link al CSS?",["head","footer","article"],"head"]]}
};

function switchTopicTab(sectionId,tabId){
 const section=$("#"+sectionId); if(!section)return;
 section.querySelectorAll(".topic-tabs button").forEach(btn=>{
   btn.classList.toggle("active",btn.dataset.tab===tabId);
   const idx=Number(btn.dataset.stepIndex);
   if(Number.isFinite(idx))btn.classList.toggle("is-locked",!canOpenTopic(sectionId,idx));
 });
 section.querySelectorAll(".tab-content").forEach(panel=>panel.classList.toggle("active",panel.id===tabId));
}
function topicKey(sectionId,index){return `${sectionId}-${index}`;}
function topicQuizKey(tabId){return `lesson:${tabId}`;}
function topicPassed(tabId){return (state.lessonQuizzes?.[topicQuizKey(tabId)]||0)>=80;}
function canOpenTopic(sectionId,index){
  return true;
}
function firstLockedTopic(sectionId,index){
 const tabs=sectionId==="html"?htmlTabs:cssTabs;
 for(let i=0;i<index;i++)if(!topicPassed(tabs[i]))return i;
 return -1;
}
function updateStepUI(){
  if(typeof htmlStep !== "number" || Number.isNaN(htmlStep)) htmlStep=0;
  if(typeof cssStep !== "number" || Number.isNaN(cssStep)) cssStep=0;

 const htmlHeader=$("#htmlStepProgress"),htmlInfo=$("#htmlStepInfo");
 if(htmlHeader){htmlHeader.textContent=`Paso ${htmlStep+1} de ${htmlSteps.length}`;htmlInfo.textContent=htmlSteps[htmlStep].desc}
 const cssHeader=$("#cssStepProgress"),cssInfo=$("#cssStepInfo");
 if(cssHeader){cssHeader.textContent=`Paso ${cssStep+1} de ${cssSteps.length}`;cssInfo.textContent=cssSteps[cssStep].desc}
 const goodHeader=$("#goodStepProgress"),goodInfo=$("#goodStepInfo");
 if(goodHeader){goodHeader.textContent=`Paso ${goodStep+1} de ${goodSteps.length}`;goodInfo.textContent=goodSteps[goodStep].desc}
 $$("#htmlStepper .step-button").forEach(btn=>{
   const i=Number(btn.dataset.stepIndex);btn.classList.toggle("active",i===htmlStep);btn.classList.remove("is-locked","locked","disabled"); btn.disabled=false;
 });
 $$("#cssStepper .step-button").forEach(btn=>{
   const i=Number(btn.dataset.stepIndex);btn.classList.toggle("active",i===cssStep);btn.classList.remove("is-locked","locked","disabled"); btn.disabled=false;
 });
 $$("#goodStepper .step-button").forEach(btn=>btn.classList.toggle("active",Number(btn.dataset.stepIndex)===goodStep));
 switchTopicTab("html",htmlTabs[htmlStep]);
 switchTopicTab("css",cssTabs[cssStep]);
}
function nextHtmlStep(){
  htmlStep=Math.min(htmlStep+1,htmlSteps.length-1);
  updateStepUI();
}
function prevHtmlStep(){htmlStep=Math.max(htmlStep-1,0);updateStepUI();}
function nextCssStep(){
  cssStep=Math.min(cssStep+1,cssSteps.length-1);
  updateStepUI();
}
function prevCssStep(){cssStep=Math.max(cssStep-1,0);updateStepUI();}
function goodTopicKey(i){return `good:${i}`;}
function goodPassed(i){return (state.lessonQuizzes?.[goodTopicKey(i)]||0)>=80;}
function nextGoodStep(){
  goodStep=Math.min(goodStep+1,goodSteps.length-1);
  updateStepUI();
}
function prevGoodStep(){goodStep=Math.max(goodStep-1,0);updateStepUI();}

function updateStudentUI(){
 if(state.role!=="student")return;
 const vals=[state.html?1:0,state.css?1:0,state.flex?1:0,state.goodPractices?1:0,state.practice?1:0,state.project>=5?1:0];
 if(state.quizScores){ const qs=Object.values(state.quizScores); if(qs.length) $("#homeScore").textContent=Math.round(qs.reduce((a,b)=>a+b,0)/qs.length)+"/100"; }
 const progress=Math.round(vals.reduce((a,b)=>a+b,0)/6*100);
 $("#homeProgress").textContent=progress+"%";$("#homeScore").textContent=state.quiz?state.quiz+"/100":"—";$("#homeModules").textContent=vals.reduce((a,b)=>a+b,0)+"/6";$("#homeProject").textContent=Math.round(state.project/6*100)+"%";
 [["routeHtml",state.html],["routeCss",state.css],["routeFlex",state.flex],["routeGoodPractices",state.goodPractices],["routePractice",state.practice],["routeProject",state.project>=6]].forEach(([id,ok])=>{$("#"+id).textContent=ok?"Completado":"Pendiente";$("#"+id).parentElement.classList.toggle("done",ok)});
 $$("#studentNav .side-nav").forEach(btn=>{
   btn.classList.remove("locked-nav","locked","disabled");
   btn.removeAttribute("disabled");
   const span=btn.querySelector("span");
   if(span && btn.dataset.originalText) span.textContent=btn.dataset.originalText;
 });
}
function allTopicPassed(keys){return keys.every(k=>(state.lessonQuizzes?.[k]||0)>=80);}
function completeModule(key){
  state[key]=true;
  save();
  showToast("✅ Módulo marcado como estudiado. Puedes continuar o volver cuando quieras.");
  return true;
}
$("#finishHtml")?.addEventListener("click",()=>completeModule("html"));
$("#finishCss")?.addEventListener("click",()=>completeModule("css"));
$("#finishFlex")?.addEventListener("click",()=>completeModule("flex"));
$("#finishGoodPractices")?.addEventListener("click",()=>completeModule("goodPractices"));

$$(".choice").forEach(btn=>btn.onclick=()=>{
 const parent=btn.parentElement;parent.querySelectorAll(".choice").forEach(x=>x.classList.remove("correct","wrong"));btn.classList.add(btn.dataset.correct==="true"?"correct":"wrong");
 const msg=parent.querySelector(".message");if(msg){msg.className="message "+(btn.dataset.correct==="true"?"show":"error");msg.textContent=btn.dataset.msg|| (btn.dataset.correct==="true"?"✅ Correcto.":"❌ Revisa la explicación y vuelve a intentarlo.");}
});

$$("#sortItems button").forEach(btn=>btn.onclick=()=>{
 const ok=btn.dataset.target==="head" ? (btn.textContent.includes("Título de pestaña")||btn.textContent.includes("UTF-8")) : (btn.textContent.includes("Título principal")||btn.textContent.includes("Imagen"));
 btn.classList.remove("correct","wrong");btn.classList.add(ok?"correct":"wrong");
 $("#sortMsg").className="message "+(ok?"show":"error");$("#sortMsg").textContent=ok?"✅ Buena decisión.":"❌ Piensa si el elemento es visible para el usuario o es configuración del documento.";
});

$("#colorControl").oninput=e=>{$("#cssLive").style.color=e.target.value};
$("#fontControl").oninput=e=>{$("#cssLive").style.fontSize=e.target.value+"px";$("#fontOut").textContent=e.target.value+"px"};
$("#alignControl").oninput=e=>{$("#cssLive").style.textAlign=e.target.value};
$("#weightControl").oninput=e=>{$("#cssLive").style.fontWeight=e.target.value};
const miniBg=$("#miniBg"),miniColor=$("#miniColor"),miniRadius=$("#miniRadius"),miniPadding=$("#miniPadding"),miniShadow=$("#miniShadow"),miniButton=$("#miniButton"),miniCode=$("#miniCode"),miniRadiusOut=$("#miniRadiusOut"),miniPaddingOut=$("#miniPaddingOut"),miniShadowOut=$("#miniShadowOut"),miniComplete=$("#miniComplete"),miniLabStatus=$("#miniLabStatus");
function updateMiniLab(){
  if(!miniBg||!miniColor||!miniRadius||!miniPadding||!miniShadow||!miniButton||!miniCode||!miniRadiusOut||!miniPaddingOut||!miniShadowOut) return;
  const radius=miniRadius.value, padding=miniPadding.value, shadow=miniShadow.value;
  miniButton.style.background=miniBg.value;
  miniButton.style.color=miniColor.value;
  miniButton.style.borderRadius=radius+"px";
  miniButton.style.padding=`${padding}px ${Math.round(padding*1.7)}px`;
  miniButton.style.boxShadow=`0 ${Math.round(shadow/2)}px ${Math.round(shadow*1.3)}px rgba(0,0,0,0.18)`;
  miniRadiusOut.textContent=`${radius}px`;
  miniPaddingOut.textContent=`${padding}px`;
  miniShadowOut.textContent=shadow;
  miniCode.textContent=`.boton-principal {\n  background: ${miniBg.value};\n  color: ${miniColor.value};\n  border-radius: ${radius}px;\n  padding: ${padding}px ${Math.round(padding*1.7)}px;\n  box-shadow: 0 ${Math.round(shadow/2)}px ${Math.round(shadow*1.3)}px rgba(0,0,0,0.18);\n}`;
}
function updateMiniLabUI(){
  if(!miniComplete||!miniLabStatus) return;
  if(state.cssLab){
    miniComplete.textContent="Mini-lab completado";
    miniComplete.disabled=true;
    miniComplete.classList.remove("primary");
    miniComplete.classList.add("dark");
    miniLabStatus.textContent="✅ Has completado el Mini-lab CSS.";
  } else {
    miniComplete.textContent="Marcar mini-lab como completado";
    miniComplete.disabled=false;
    miniComplete.classList.remove("dark");
    miniComplete.classList.add("primary");
    miniLabStatus.textContent="";
  }
}
function finishMiniLab(){
  state.cssLab=true;
  save();
  updateMiniLabUI();
  showToast("Mini-lab CSS completado. ¡Buen trabajo!");
}
if(miniBg&&miniColor&&miniRadius&&miniPadding&&miniShadow){
  [miniBg,miniColor,miniRadius,miniPadding,miniShadow].forEach(x=>x.oninput=()=>{updateMiniLab();updateMiniLabUI();});
}
if(miniComplete) miniComplete.onclick=finishMiniLab;
updateMiniLab();
updateMiniLabUI();
if($("#marginControl")) $("#marginControl").oninput=e=>{$(".margin").style.padding=e.target.value+"px";$("#marginOut").textContent=e.target.value+"px"};
if($("#paddingControl")) $("#paddingControl").oninput=e=>{$(".padding").style.padding=e.target.value+"px";$("#paddingOut").textContent=e.target.value+"px"};

const fcan=$("#flexCanvas"),fd=$("#flexDirection"),fj=$("#flexJustify"),fa=$("#flexAlign"),fg=$("#flexGap");
function flexRender(){
  if(!fcan||!fd||!fj||!fa||!fg) return;
  fcan.style.flexDirection=fd.value;
  fcan.style.justifyContent=fj.value;
  fcan.style.alignItems=fa.value;
  fcan.style.gap=fg.value+"px";
  $("#flexGapOut").textContent=fg.value+"px";
  $("#flexCode").textContent=`display: flex;\nflex-direction: ${fd.value};\njustify-content: ${fj.value};\nalign-items: ${fa.value};\ngap: ${fg.value}px;`;
}
if(fd&&fj&&fa&&fg){
  [fd,fj,fa,fg].forEach(x=>x.oninput=flexRender);
  flexRender();
}
if($("#checkFlex")){
  $("#checkFlex").onclick=()=>{
    if(!fd||!fj||!fa) return;
    const ok=fd.value==="row"&&fj.value==="center"&&fa.value==="center";
    $("#flexMsg").className="message "+(ok?"show":"error");
    $("#flexMsg").textContent=ok?"✅ Reto superado. Puedes continuar explorando: el reto es opcional.":"❌ Configura row + center + center.";
    if(ok){state.flexChallenge=true;save();}
  };
}


const practiceData=[
 ["01","Estructura","¿Qué etiqueta representa el contenido principal de una página?","main","div","footer","nav"],
 ["02","HTML","¿Qué atributo describe una imagen para accesibilidad?","alt","href","src","name"],
 ["03","CSS","Quieres aplicar el mismo estilo a muchas tarjetas. ¿Qué selector conviene?",".card","#card","card","*card"],
 ["04","Box Model","¿Qué propiedad crea espacio dentro del borde?","padding","margin","gap","display"],
 ["05","Flexbox","Quieres repartir elementos con espacio igual entre ellos. ¿Cuál opción es adecuada?","space-between","flex-start","column","stretch"],
 ["06","CSS externo","¿Qué etiqueta conecta un archivo CSS externo?","link","style","css","script"],
 ["07","Accesibilidad","¿Cuál elemento relaciona el texto con un campo de entrada?","label","div","span","button"],
 ["08","Responsive","¿Qué regla CSS se usa para cambiar estilos según el ancho de pantalla?","@media","@import","@font-face","@container"]
];
let practiceScore=0;
function renderPractice(){
 $("#practiceList").innerHTML=practiceData.map((q,i)=>`<article class="practice-card" data-p="${i}"><b>${q[0]} · +10</b><h3>${q[2]}</h3><div class="practice-options">${q.slice(3).map((a,j)=>`<button data-correct="${j===0}">${a}</button>`).join("")}</div><div class="message"></div></article>`).join("");
 $$("#practiceList .practice-card").forEach(card=>card.querySelectorAll("button").forEach(btn=>btn.onclick=()=>{
   card.querySelectorAll("button").forEach(b=>b.classList.remove("correct","wrong"));btn.classList.add(btn.dataset.correct==="true"?"correct":"wrong");
   const msg=card.querySelector(".message");msg.className="message "+(btn.dataset.correct==="true"?"show":"error");msg.textContent=btn.dataset.correct==="true"?"✅ Correcto.":"❌ No es esa. Revisa el módulo correspondiente.";
 }));
}
renderPractice();
$("#finishPractice").onclick=()=>{const cards=$$("#practiceList .practice-card");let c=0;cards.forEach(card=>{if(card.querySelector(".correct"))c++});if(c<5){$("#practiceMsg").className="message error";$("#practiceMsg").textContent=`Completa correctamente al menos 5 de 8 prácticas. Actualmente: ${c}/8.`;return}state.practice=true;state.quiz=Math.max(state.quiz,c*100/8);save();$("#practiceMsg").className="message show";$("#practiceMsg").textContent=`✅ Prácticas finalizadas: ${c}/8 correctas.`};

const defaultHTML=$("#htmlEditor")?.value||"";
const defaultCSS=$("#cssEditor")?.value||"";

function updateProjectPreview(){
  const h=$("#htmlEditor"), c=$("#cssEditor"), frame=$("#projectFrame");
  if(!h||!c||!frame)return;
  frame.srcdoc=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${c.value}</style></head><body>${h.value}</body></html>`;
}

function loadSavedProjectCode(){
  const h=$("#htmlEditor"), c=$("#cssEditor");
  if(!h||!c)return;
  if(state.projectHTML)h.value=state.projectHTML;
  if(state.projectCSS)c.value=state.projectCSS;
  updateProjectPreview();
}

$("#resetHtmlEditor")?.addEventListener("click",()=>{
  $("#htmlEditor").value=defaultHTML;
  state.projectHTML=defaultHTML;
  updateProjectPreview();
  updateProjectAudit();
});

$("#resetCssEditor")?.addEventListener("click",()=>{
  $("#cssEditor").value=defaultCSS;
  state.projectCSS=defaultCSS;
  updateProjectPreview();
  updateProjectAudit();
});

$("#htmlEditor")?.addEventListener("input",()=>{
  state.projectHTML=$("#htmlEditor").value;
  state.projectChecks.edited=true;
  updateProjectPreview();
  updateProjectAudit();
});

$("#cssEditor")?.addEventListener("input",()=>{
  state.projectCSS=$("#cssEditor").value;
  state.projectChecks.edited=true;
  updateProjectPreview();
  updateProjectAudit();
});

$$("[data-project]").forEach(c=>c.addEventListener("change",()=>{
  state.projectChecks[c.dataset.project]=c.checked;
  state.project=Object.values(state.projectChecks).filter(Boolean).length;
  save();
}));

$("#saveProject")?.addEventListener("click",()=>{
  state.projectHTML=$("#htmlEditor")?.value||"";
  state.projectCSS=$("#cssEditor")?.value||"";
  const checked=Object.values(state.projectChecks).filter(Boolean).length;
  state.project=checked;
  state.projectAudit=inspectProject().checks.flex?100:0;
  save();
  const msg=$("#projectMsg");
  if(msg){
    msg.className="message show";
    msg.textContent=`💾 Proyecto guardado. ${checked}/6 evidencias marcadas y código almacenado en este navegador.`;
  }
});

loadSavedProjectCode();

function renderResult(){
 const html=state.html?100:0,css=state.css?100:0,flex=state.flex?100:0,goodPractices=state.goodPractices?100:0,practice=state.practice?100:0,project=Math.round(state.project/6*100);
 const total=Math.round((html+css+flex+goodPractices+practice+project)/6);
 $("#rHtml").textContent=html+"%";$("#rCss").textContent=css+"%";$("#rFlex").textContent=flex+"%";$("#rGoodPractices").textContent=goodPractices+"%";$("#rPractice").textContent=practice+"%";$("#rProject").textContent=project+"%";$("#resultScore").innerHTML=total+'<small>/100</small>';
 $("#resultTitle").textContent=total>=90?"¡Excelente trabajo!":total>=70?"¡Muy buen avance!":total>=50?"Vas por buen camino":"Tu ruta está comenzando.";
 $("#resultDescription").textContent=total>=90?"Ya puedes pasar a fortalecer el proyecto final y cuidar los detalles visuales.":total>=70?"Tienes una base sólida. Revisa los módulos pendientes antes de entregar.":"Continúa módulo por módulo y usa los laboratorios para practicar.";
 updateStudentUI();
}

function studentId(name,group){
 return `${String(name).trim().toLowerCase()}::${String(group).trim().toLowerCase()}`;
}
function getRecords(){
 const raw=JSON.parse(localStorage.getItem("aulaWeb10Records")||"[]");
 let changed=false;
 const records=raw.map(r=>{
   if(r.id)return r;
   changed=true;
   return Object.assign({id:studentId(r.name||"",r.group||"")},r);
 });
 if(changed)localStorage.setItem("aulaWeb10Records",JSON.stringify(records));
 return records;
}
function syncStudent(){
 if(state.role!=="student"||!state.student)return;
 const records=getRecords();
 const id=state.student.id||studentId(state.student.name,state.student.group);
 state.student.id=id;
 const idx=records.findIndex(r=>r.id===id);
 const record={
   id,name:state.student.name,group:state.student.group,
   html:!!state.html,css:!!state.css,flex:!!state.flex,
   goodPractices:!!state.goodPractices,practice:!!state.practice,
   project:Number(state.project)||0,quiz:Number(state.quiz)||0,
   projectHTML:state.projectHTML||"",projectCSS:state.projectCSS||"",
   projectChecks:state.projectChecks||{},updatedAt:state.updatedAt
 };
 if(idx>=0)records[idx]=Object.assign({},records[idx],record);else records.push(record);
 localStorage.setItem("aulaWeb10Records",JSON.stringify(records));
}
function avg(records,key){if(!records.length)return 0;return Math.round(records.reduce((s,r)=>s+(key==="project"?r.project/6*100:(r[key]?100:0)),0)/records.length)}
function renderTeacher(){
 const records=getRecords(),n=records.length,active=records.filter(r=>r.html||r.css||r.flex||r.goodPractices||r.practice||r.project).length,finished=records.filter(r=>r.project>=5&&r.practice&&r.flex&&r.goodPractices&&r.css&&r.html).length;
 const scores=records.map(r=>Math.round(([r.html?100:0,r.css?100:0,r.flex?100:0,r.goodPractices?100:0,r.practice?100:0,(r.project/6)*100].reduce((a,b)=>a+b,0))/6));
 $("#tStudents").textContent=n;$("#tActive").textContent=active;$("#tFinished").textContent=finished;$("#tAverage").textContent=n?(Math.round(scores.reduce((a,b)=>a+b,0)/n))+"%":"—";
 const mods=[["HTML5","html"],["CSS","css"],["Flexbox","flex"],["Buenas prácticas","goodPractices"],["Prácticas","practice"],["Proyecto","project"]];
 $("#moduleBars").innerHTML=mods.map(([label,key])=>{const v=avg(records,key);return `<div class="bar-row"><b>${label}</b><div class="bar"><i style="width:${v}%"></i></div><span>${v}%</span></div>`}).join("");
 const sorted=[...records].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,8);
 $("#recentStudents").innerHTML=table(sorted);
 $("#allStudents").innerHTML=table(records);
 bindStudentButtons();
 renderReports(records);
}
function table(records){
 if(!records.length)return '<p style="color:#697089;font-size:11px">Aún no hay estudiantes registrados en este navegador.</p>';
 return `<div class="student-row head"><span>Estudiante</span><span>Grupo</span><span>Avance</span><span>Puntaje</span><span>Estado</span></div>`+
 records.map(r=>{
   const av=Math.round(([r.html?1:0,r.css?1:0,r.flex?1:0,r.goodPractices?1:0,r.practice?1:0,r.project>=5?1:0].reduce((a,b)=>a+b,0))/6*100);
   const score=Math.round(([r.html?100:0,r.css?100:0,r.flex?100:0,r.goodPractices?100:0,r.practice?100:0,r.project/6*100].reduce((a,b)=>a+b,0))/6);
   const cls=av>=80?"green":av>=40?"orange":"red";
   return `<div class="student-row"><button data-student-id="${escapeHTML(r.id)}">${escapeHTML(r.name)}</button><span>${escapeHTML(r.group)}</span><span>${av}%</span><span>${score}</span><span class="status ${cls}">${av>=80?"Avanzado":av>=40?"En proceso":"Inicial"}</span></div>`;
 }).join("");
}
function bindStudentButtons(){
 $$("#allStudents [data-student-id], #recentStudents [data-student-id]").forEach(btn=>{
   btn.onclick=()=>detailStudent(btn.dataset.studentId);
 });
}
window.detailStudent=id=>{
 const records=getRecords(),r=records.find(x=>x.id===id);
 if(!r)return;
 const vals=[["HTML5",r.html?100:0],["CSS",r.css?100:0],["Flexbox",r.flex?100:0],["Buenas prácticas",r.goodPractices?100:0],["Prácticas",r.practice?100:0],["Proyecto",Math.round(r.project/6*100)]];
 $("#studentDetail").classList.remove("hidden");
 $("#studentDetail").innerHTML=`<h3 style="font-family:'Space Grotesk';margin:0">${escapeHTML(r.name)}</h3><p style="font-size:10px;color:#bfc5d6">Grupo ${escapeHTML(r.group)} · Última actividad ${new Date(r.updatedAt).toLocaleString("es-CO")}</p><div class="detail-bars">${vals.map(v=>`<div class="detail-row"><b>${v[0]}</b><div class="bar"><i style="width:${v[1]}%"></i></div><span>${v[1]}%</span></div>`).join("")}</div>`;
 $("#studentDetail").scrollIntoView({behavior:"smooth"});
};

function renderReports(records){
 const mods=[["Html","html"],["Css","css"],["Flex","flex"],["GoodPractices","goodPractices"],["Practice","practice"],["Project","project"]];
 mods.forEach(([a,k])=>{$("#rep"+a).textContent=avg(records,k)+"%";$("#rep"+a+"Bar").style.width=avg(records,k)+"%"});
 const weak=records.filter(r=>{const av=[r.html?1:0,r.css?1:0,r.flex?1:0,r.goodPractices?1:0,r.practice?1:0,r.project>=5?1:0].reduce((a,b)=>a+b,0);return av<3});
 $("#needsSupport").innerHTML=weak.length?weak.map(r=>`<div style="padding:11px;border-bottom:1px solid #eef0f5;font-size:11px"><b>${escapeHTML(r.name)}</b> · ${escapeHTML(r.group)} <span class="red">requiere acompañamiento</span></div>`).join(""):'<p style="font-size:11px;color:#697089">No hay estudiantes por debajo de 3 módulos completados.</p>';
}
$("#studentSearch").oninput=e=>{const q=e.target.value.toLowerCase();const rows=getRecords().filter(r=>(r.name+" "+r.group).toLowerCase().includes(q));$("#allStudents").innerHTML=table(rows);bindStudentButtons()};
$("#exportCsv").onclick=()=>{const rows=getRecords();if(!rows.length)return showToast("No hay registros para exportar.");const head=["Nombre","Grupo","HTML","CSS","Flexbox","Buenas prácticas","Prácticas","Proyecto","Puntaje"];const data=rows.map(r=>[r.name,r.group,r.html?100:0,r.css?100:0,r.flex?100:0,r.goodPractices?100:0,r.practice?100:0,Math.round(r.project/6*100),Math.round(([r.html?100:0,r.css?100:0,r.flex?100:0,r.goodPractices?100:0,r.practice?100:0,r.project/6*100].reduce((a,b)=>a+b,0))/6)]);const csv=[head,...data].map(row=>row.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));a.download="aula-web-grado10.csv";a.click()};
$("#saveSettings").onclick=()=>showToast("Configuración guardada en esta sesión.");

function restoreChecks(){if(state.projectChecks)$$("[data-project]").forEach(c=>c.checked=!!state.projectChecks[c.dataset.project])}
restoreChecks();
if(state.role==="student"){openApp("student");show("home");updateStudentUI()}else if(state.role==="teacher"){openApp("teacher");show("teacherDash");renderTeacher()}else{$("#authView").classList.remove("hidden")}

/* =========================================================
   AULA WEB 10° · Interacciones extra
   ========================================================= */
const flexPresets = {
  nav:["row","space-between","center",18],
  cards:["row","space-evenly","stretch",14],
  hero:["row","space-between","center",28],
  mobile:["column","center","center",18]
};
function applyFlexPreset(name){
  const p=flexPresets[name]; if(!p) return;
  const d=$("#flexDirection"),j=$("#flexJustify"),a=$("#flexAlign"),g=$("#flexGap");
  if(!d||!j||!a||!g) return;
  d.value=p[0]; j.value=p[1]; a.value=p[2]; g.value=p[3];
  [d,j,a,g].forEach(el=>el.dispatchEvent(new Event("input",{bubbles:true})));
  [d,j,a,g].forEach(el=>el.dispatchEvent(new Event("change",{bubbles:true})));
  $$(".scenario").forEach(x=>x.classList.toggle("active",x.dataset.flexPreset===name));
  showToast("Configuración aplicada: "+name+" ✨");
}
$$(".scenario").forEach(btn=>btn.addEventListener("click",()=>applyFlexPreset(btn.dataset.flexPreset)));

// Animate cards into view when supported.
if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("reveal-in");observer.unobserve(e.target)}})
  },{threshold:.08});
  document.querySelectorAll(".panel-card,.info-panel,.project-milestones article,.scenario").forEach(el=>observer.observe(el));
}

// Small keyboard-friendly shortcut: F opens Flexbox from anywhere.
document.addEventListener("keydown",e=>{
  if(e.key.toLowerCase()==="f" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)){
    if(typeof show==="function"){show("flex");showToast("⚡ Modo Flexbox activado")}
  }
});

/* =========================================================
   CÓDIGO INTERACTIVO + OBSERVATORIO WEB
   ========================================================= */
const labChallenges={
 nav:{title:"Convierte este menú en una barra horizontal.",text:"El contenedor .menu debe usar Flexbox. Separa los enlaces y céntralos verticalmente.",hint:"Prueba display:flex, justify-content, align-items y gap.",html:`<header class="menu"><strong>MI SITIO</strong><nav><a href="#">Inicio</a><a href="#">Cursos</a><a href="#">Contacto</a></nav></header>`,css:`body{margin:0;font-family:Arial;background:#eef0ff}.menu{padding:18px 24px;background:#182038;color:white}.menu nav{gap:8px}.menu a{color:white;text-decoration:none;padding:8px 10px}`},
 cards:{title:"Haz que estas tarjetas se adapten.",text:"El contenedor .cards debe permitir que las tarjetas bajen a otra línea cuando no haya espacio.",hint:"Usa display:flex, flex-wrap:wrap y gap. Puedes probar flex:1 1 220px en las tarjetas.",html:`<main class="cards"><article><b>HTML</b><p>Estructura</p></article><article><b>CSS</b><p>Diseño</p></article><article><b>Flexbox</b><p>Layout</p></article><article><b>Responsive</b><p>Adaptación</p></article></main>`,css:`body{margin:0;font-family:Arial;background:#f6f8ff}.cards{padding:30px}.cards article{background:white;border-radius:18px;padding:25px;box-shadow:0 12px 35px #18203812;min-width:0}`},
 center:{title:"Centra el contenido en los dos ejes.",text:"El bloque .box tiene un elemento .robot. Debe quedar centrado horizontal y verticalmente.",hint:"Piensa en el eje principal y el eje cruzado. Prueba justify-content y align-items.",html:`<div class="box"><div class="robot">🤖<strong>¡Céntrame!</strong></div></div>`,css:`body{margin:0;font-family:Arial}.box{height:320px;background:#dffaf5}.robot{padding:25px;background:#fff;border-radius:20px;text-align:center;box-shadow:0 12px 30px #18203818}`},
 hero:{title:"Construye un hero con texto + imagen.",text:"El contenido de .hero debe quedar en dos columnas en escritorio y ordenarse en móvil.",hint:"Usa display:flex, justify-content, align-items, gap y una media query.",html:`<section class="hero"><div><small>APRENDE WEB</small><h1>Diseña algo increíble.</h1><p>Tu primera landing empieza aquí.</p><button>Comenzar</button></div><div class="visual">💻</div></section>`,css:`body{margin:0;font-family:Arial;background:#f6f8ff}.hero{padding:45px;background:#fff;border-radius:24px}.hero h1{font-size:38px}.hero button{padding:12px 20px;border:0;border-radius:10px;background:#635bff;color:#fff}.visual{font-size:90px}`}
};
let currentChallenge="nav";
function labLoad(name){const c=labChallenges[name];if(!c)return;currentChallenge=name;const h=$("#labHtml"),s=$("#labCss");if(!h||!s)return;h.value=c.html;s.value=c.css;$("#challengeTitle").textContent=c.title;$("#challengeText").innerHTML=c.text;$("#challengeHint").innerHTML=c.hint;$$('.code-challenge').forEach(x=>x.classList.toggle('active',x.dataset.challenge===name));labRun();}
function labRun(){const h=$("#labHtml"),s=$("#labCss"),f=$("#labFrame");if(!h||!s||!f)return;const doc=`<!doctype html><html><head><meta charset="utf-8"><style>${s.value}</style></head><body>${h.value}</body></html>`;f.srcdoc=doc;}
function labCheck(){const s=$("#labCss").value.toLowerCase(), h=$("#labHtml").value.toLowerCase();let ok=false,reason="";
 if(currentChallenge==='nav')ok=/display\s*:\s*flex/.test(s)&&/gap\s*:/.test(s)&&/align-items\s*:/.test(s);
 if(currentChallenge==='cards')ok=/display\s*:\s*flex/.test(s)&&/flex-wrap\s*:\s*wrap/.test(s)&&/gap\s*:/.test(s);
 if(currentChallenge==='center')ok=/display\s*:\s*flex/.test(s)&&/justify-content\s*:\s*center/.test(s)&&/align-items\s*:\s*center/.test(s);
 if(currentChallenge==='hero')ok=/display\s*:\s*flex/.test(s)&&/justify-content\s*:/.test(s)&&/align-items\s*:/.test(s)&&/gap\s*:/.test(s)&&/@media/.test(s);
 const msg=$("#challengeFeedback"); if(ok){msg.className='message success';msg.textContent='¡Desafío superado! 🎉 Tu código cumple los requisitos principales.';localStorage.setItem('aula10_lab_'+currentChallenge,'done');}else{msg.className='message error';msg.textContent='Todavía no. Revisa la pista y prueba una propiedad a la vez. 🔧';} labRun();}
$$('.code-challenge').forEach(b=>b.addEventListener('click',()=>labLoad(b.dataset.challenge)));
["#labHtml","#labCss"].forEach(sel=>$(sel)?.addEventListener('input',labRun));
$("#checkChallenge")?.addEventListener('click',labCheck);$("#resetLabHtml")?.addEventListener('click',()=>labLoad(currentChallenge));$("#resetLabCss")?.addEventListener('click',()=>labLoad(currentChallenge));
$("#saveLabReflection")?.addEventListener('click',()=>{const v=$("#labReflection").value.trim();if(!v){showToast('Escribe una reflexión primero.');return}localStorage.setItem('aula10_lab_reflection',v);$("#labSaveMsg").className='message success';$("#labSaveMsg").textContent='Reflexión guardada. 🧠';});
labLoad('nav');

/* Proyecto final: evidencia técnica */
function inspectProject(){const css=$("#cssEditor")?.value.toLowerCase()||'', html=$("#htmlEditor")?.value.toLowerCase()||'';const flex=(css.match(/display\s*:\s*flex/g)||[]).length;const forbidden=(css.match(/position\s*:/g)||[]).length;const checks={semantic:/<header[\s>]/.test(html)&&/<nav[\s>]/.test(html)&&/<main[\s>]/.test(html)&&/<section[\s>]/.test(html)&&/<footer[\s>]/.test(html),flex:flex>=3&&/justify-content\s*:/.test(css)&&/align-items\s*:/.test(css)&&/gap\s*:/.test(css),clean:forbidden===0};return {flex,forbidden,checks}}
const projectCheck=document.createElement('div');projectCheck.className='project-code-feedback';projectCheck.innerHTML='<b>🔍 Auditoría rápida del código</b><span id="projectAuditText">Edita tu código para analizarlo.</span>';document.querySelector('#project .project-workspace')?.after(projectCheck);
function updateProjectAudit(){const x=inspectProject(),e=$("#projectAuditText");if(!e)return;e.innerHTML=`Flexbox detectado: <strong>${x.flex}</strong> · position: <strong>${x.forbidden}</strong> · ${x.checks.flex?'✅ Requisitos Flexbox completos':'⚠️ Aún faltan propiedades Flexbox'}`;e.className=x.checks.flex&&x.checks.clean?'audit-good':'audit-warn';}
$("#cssEditor")?.addEventListener('input',updateProjectAudit);$("#htmlEditor")?.addEventListener('input',updateProjectAudit);setTimeout(updateProjectAudit,300);


/* ===== APRENDIZAJE: QUIZ POR TEMA ===== */

/* ===== LECCIONES GUIADAS: QUIZ POR CADA PARTE ===== */
function renderLessonQuiz(tabId,data){
 const panel=$("#"+tabId); if(!panel || panel.querySelector(".lesson-quiz"))return;
 const key=topicQuizKey(tabId);
 const quiz=document.createElement("div");
 quiz.className="lesson-quiz";
 quiz.dataset.lessonQuiz=tabId;

 quiz.innerHTML=
 `<div class="lesson-quiz-head">
    <div>
      <span class="quiz-label">EVALUACIÓN DE LA LECCIÓN</span>
      <h4>🧠 ${escapeHTML(data.title)}</h4>
    </div>
    <span class="quiz-count">${data.questions.length} preguntas</span>
  </div>
  <p class="quiz-instruction">Responde las ${data.questions.length} preguntas. Debes obtener <strong>80% o más</strong> para desbloquear la siguiente lección.</p>
  <div class="lesson-quiz-progress"><i style="width:0%"></i></div>`+
 data.questions.map((q,i)=>`
   <div class="lesson-question" data-q="${i}">
     <div class="question-number">Pregunta ${i+1} de ${data.questions.length}</div>
     <b>${escapeHTML(q[0])}</b>
     <div class="lesson-options">
       ${q[1].map(opt=>`<button type="button" class="lesson-option" data-answer="${escapeHTML(opt)}">${escapeHTML(opt)}</button>`).join("")}
     </div>
   </div>`).join("")+
 `<button type="button" class="btn primary lesson-check">Comprobar respuestas</button>
  <div class="lesson-quiz-result"></div>`;

 panel.appendChild(quiz);

 const questions=quiz.querySelectorAll(".lesson-question");
 const progress=quiz.querySelector(".lesson-quiz-progress i");

 quiz.querySelectorAll(".lesson-option").forEach(btn=>btn.addEventListener("click",()=>{
   const q=btn.closest(".lesson-question");
   q.querySelectorAll(".lesson-option").forEach(x=>x.classList.remove("selected"));
   btn.classList.add("selected");
   const answered=quiz.querySelectorAll(".lesson-option.selected").length;
   progress.style.width=`${Math.round(answered/data.questions.length*100)}%`;
 }));

 quiz.querySelector(".lesson-check").addEventListener("click",()=>{
   let score=0;
   let answered=0;

   questions.forEach((q,i)=>{
     const selected=q.querySelector(".lesson-option.selected");
     if(selected)answered++;
     q.querySelectorAll(".lesson-option").forEach(x=>x.classList.remove("correct","wrong"));

     const correct=data.questions[i][2];
     if(selected && selected.dataset.answer===correct){
       selected.classList.add("correct");
       score++;
     }else if(selected){
       selected.classList.add("wrong");
     }

     q.querySelectorAll(".lesson-option").forEach(x=>{
       if(x.dataset.answer===correct)x.classList.add("correct");
     });
   });

   const pct=Math.round(score/data.questions.length*100);
   state.lessonQuizzes[key]=pct;
   save();

   const r=quiz.querySelector(".lesson-quiz-result");
   r.className="lesson-quiz-result show "+(pct>=80?"good":"low");

   if(pct>=80){
     r.innerHTML=`<strong>🎉 Lección aprobada: ${score}/${data.questions.length} (${pct}%).</strong><br>Ya puedes continuar con la siguiente parte.`;
   }else{
     r.innerHTML=`<strong>🔁 Resultado: ${score}/${data.questions.length} (${pct}%).</strong><br>Respondiste ${answered}/${data.questions.length}. Necesitas mínimo 80%. Revisa la explicación y vuelve a intentarlo.`;
   }

   updateStepUI();
   updateStudentUI();
 });
}

Object.entries(lessonQuizData).forEach(([id,data])=>renderLessonQuiz(id,data));

/* Quiz de cada paso de Buenas Prácticas */
const goodQuizData=[
 {title:"Quiz · Nombres claros",questions:[
  ["¿Cuál comunica mejor su propósito?",[".c1",".hero-banner",".x"],".hero-banner"],
  ["¿Qué conviene evitar?",["Nombres descriptivos","Abreviaturas confusas","Clases coherentes"],"Abreviaturas confusas"],
  ["¿Por qué importa el nombre de una clase?",["Facilita mantenimiento","Cambia el HTML","Aumenta la velocidad siempre"],"Facilita mantenimiento"]]},
 {title:"Quiz · Accesibilidad",questions:[
  ["¿Qué mejora el contraste?",["Texto y fondo distinguibles","Más sombras","Más animaciones"],"Texto y fondo distinguibles"],
  ["¿Qué debe decir un botón?",["Una acción clara","Solo 'clic'","Nada"],"Una acción clara"],
  ["¿Qué ayuda a teclado?",["Foco visible","Ocultar outline siempre","Texto diminuto"],"Foco visible"]]},
 {title:"Quiz · Responsive",questions:[
  ["¿Qué debe pasar en celular?",["La interfaz sigue siendo usable","Todo se vuelve pequeño","Se oculta el contenido"],"La interfaz sigue siendo usable"],
  ["¿Qué herramienta usamos para reglas por ancho?",["@media","@mobile","@phone"],"@media"],
  ["¿Qué conviene probar?",["Varios tamaños de pantalla","Solo mi computador","Solo una resolución"],"Varios tamaños de pantalla"]]}
];
function renderGoodStepQuiz(){ /* Buenas prácticas: aprendizaje libre, sin quiz automático. */ }
const originalUpdateStepUI=updateStepUI;
updateStepUI=function(){originalUpdateStepUI();try{ renderGoodStepQuiz(); }catch(error){ console.warn("Quiz inicializado sin bloquear la plataforma:", error); }};
renderGoodStepQuiz();

/* ===== SELECTORES DINÁMICOS ===== */
function initSelectorPlayground(){
 const box=$("#selectorPlayground");if(!box)return;
 const buttons=box.querySelectorAll(".selector-type-btn"),targets=box.querySelectorAll("#selectorTargets p"),code=$("#selectorLiveCode"),exp=$("#selectorExplanation"),spec=$("#specificityValue");
 const data={
  tag:{code:"p { color: #635bff; }",spec:"1",ex:"<b>Etiqueta</b><p>Selecciona todos los elementos del mismo tipo. Úsala para reglas generales, por ejemplo todos los párrafos.</p><strong>Especificidad: 1</strong>",match:t=>t.tagName==="P"},
  class:{code:".producto { color: #20a9a8; }",spec:"10",ex:"<b>Clase</b><p>Selecciona todos los elementos que tengan esa clase. Es ideal para reutilizar un mismo estilo en varias tarjetas, botones o componentes.</p><strong>Especificidad: 10</strong>",match:t=>t.classList.contains("producto")},
  id:{code:"#destacado { color: #ef8d56; }",spec:"100",ex:"<b>ID</b><p>Selecciona un elemento específico. Tiene mayor especificidad, pero para estilos reutilizables normalmente es preferible una clase.</p><strong>Especificidad: 100</strong>",match:t=>t.id==="destacado"}
 };
 function select(type){const d=data[type];buttons.forEach(b=>b.classList.toggle("active",b.dataset.selectorType===type));targets.forEach(t=>t.classList.toggle("hit",d.match(t)));code.textContent=d.code;spec.textContent=`Especificidad: ${d.spec}`;exp.innerHTML=d.ex}
 buttons.forEach(b=>b.onclick=()=>select(b.dataset.selectorType));select("tag");
}
initSelectorPlayground();

/* ===== APLICACIÓN REAL EN CADA TEMA ===== */
const realUse={
 "html-basic":["Estructura de una página institucional","Una empresa necesita separar configuración del navegador (head) del contenido que verá el visitante (body)."],
 "html-semantic":["Una noticia o tienda organizada","Usar main, section y article permite identificar cada zona sin llenar el documento de div sin significado."],
 "html-content":["Menú y pasos de compra","Una tienda puede usar ul para características y ol para pasos: elegir producto → pagar → recibir."],
 "html-media":["Catálogo de productos","Una tienda usa img para mostrar productos, video para demostraciones e iframe para mapas o recursos externos."],
 "html-accessibility":["Una web para todas las personas","alt, labels, foco y contraste ayudan a que el contenido pueda entenderse y utilizarse con distintas necesidades."],
 "html-forms":["Formulario de contacto","Un usuario escribe nombre, correo y mensaje; label e input permiten identificar correctamente cada dato."],
 "html-tables":["Reporte de notas","Las tablas sirven para datos relacionados por filas y columnas: estudiante, módulo, nota y estado."],
 "css-selectors":["Sistema de tarjetas reutilizables","Una clase .card puede estilizar 20 tarjetas; un ID puede destacar una sección única."],
 "css-text":["Página de noticias","Jerarquía de títulos, tamaño, peso y color ayudan a que el lector sepa qué mirar primero."],
 "css-box":["Botón cómodo de usar","padding aumenta el área interna del botón; margin lo separa de otros elementos."],
 "css-background":["Identidad visual","Un fondo y un color de texto con buen contraste ayudan a reconocer una marca sin sacrificar legibilidad."],
 "css-responsive":["Tienda desde celular","Las tarjetas pueden pasar de 4 columnas a 1 para que los productos sigan siendo legibles."],
 "css-structure":["Proyecto en equipo","Separar HTML y CSS permite que varias páginas compartan estilos y facilita mantenimiento."]};
function injectRealUse(){
 Object.entries(realUse).forEach(([id,[title,text]])=>{
   const panel=$("#"+id);if(!panel||panel.querySelector(".real-use-note"))return;
   const d=document.createElement("div");d.className="real-use-note";d.innerHTML=`<span>🌎 APLICACIÓN REAL</span><b>${title}</b><p>${text}</p>`;panel.insertBefore(d,panel.firstChild);
 });
}
injectRealUse();

const quizAnswers={
  html:["main","alt","section","head","a"],
  css:["color","padding","class","font-size","gap"],
  flex:["flex","horizontal","justify","align","gap"]
};
$$(".topic-quiz .quiz-q").forEach(q=>{
  q.querySelectorAll(".quiz-option").forEach(btn=>{
    btn.onclick=()=>{
      q.querySelectorAll(".quiz-option").forEach(x=>x.classList.remove("selected","correct","wrong"));
      btn.classList.add("selected");
    };
  });
});
$$(".check-quiz").forEach(btn=>{
  btn.onclick=()=>{
    const key=btn.dataset.quiz, wrap=document.querySelector(`.topic-quiz[data-quiz="${key}"]`);
    const questions=[...wrap.querySelectorAll(".quiz-q")], answers=quizAnswers[key]; let score=0;
    questions.forEach((q,i)=>{
      q.querySelectorAll(".quiz-option").forEach(x=>x.classList.remove("correct","wrong"));
      const selected=q.querySelector(".quiz-option.selected");
      if(selected){
        if(selected.dataset.answer===answers[i]){selected.classList.add("correct");score++}
        else selected.classList.add("wrong");
      }
      q.querySelectorAll(".quiz-option").forEach(x=>{if(x.dataset.answer===answers[i])x.classList.add("correct")});
    });
    const pct=Math.round(score/questions.length*100);
    state.quizScores=state.quizScores||{}; state.quizScores[key]=pct;
    state.quiz=Math.round(Object.values(state.quizScores).reduce((a,b)=>a+b,0)/Object.keys(state.quizScores).length);
    save();
    const r=wrap.querySelector(".quiz-result");r.className="quiz-result show "+(pct>=80?"good":pct>=60?"mid":"low");
    r.innerHTML=`<strong>${pct>=80?"🎉 Excelente":pct>=60?"👍 Vas bien":"💡 Sigue practicando"}</strong> — ${score}/${questions.length} correctas (${pct}%). ${pct<80?"Revisa las explicaciones y vuelve a intentarlo.":"¡Puedes continuar con el siguiente reto!"}`;
  };
});

/* ===== TALLER VISUAL STUDIO CODE ===== */
$$("[data-vs]").forEach(c=>c.onchange=()=>{
  state.vsChecks=state.vsChecks||{};state.vsChecks[c.dataset.vs]=c.checked;save();
});
$("#finishVs")?.addEventListener("click",()=>{
  const n=Object.values(state.vsChecks||{}).filter(Boolean).length;
  if(n<5){$("#vsMsg").className="message error";$("#vsMsg").textContent=`Completa los 5 pasos antes de marcar el taller: ${n}/5.`;return}
  state.vscode=true;save();$("#vsMsg").className="message show";$("#vsMsg").textContent="✅ Taller completado. Ya tienes la base para trabajar tu proyecto en VS Code.";
});
$("#finishWebExamples")?.addEventListener("click",()=>{
  state.webExamples=true;save();
  $("#webExamplesMsg").className="message show";
  $("#webExamplesMsg").textContent="✅ Observatorio completado. Ya puedes pasar al laboratorio.";
});


/* ===== ANALIZADOR PEDAGÓGICO DEL PROYECTO ===== */
$("#analyzeProject")?.addEventListener("click",()=>{
  const h=$("#htmlEditor").value, c=$("#cssEditor").value;
  const starterH=defaultHTML.trim(), starterC=defaultCSS.trim();
  const unchanged=h.trim()===starterH && c.trim()===starterC;
  const htmlChanged=h.trim()!==starterH, cssChanged=c.trim()!==starterC;
  const cleanH=h.toLowerCase(), cleanC=c.toLowerCase();
  const flexMatches=c.match(/display\s*:\s*flex\s*;/g)||[];
  const realContent=(cleanH.match(/<(h1|h2|h3|p|article|a|button)\b/g)||[]).length;
  const checks=[
    ["HTML semántico",["<header","<nav","<main","<section","<footer"],cleanH],
    ["Contenido propio",[],cleanH],
    ["Flexbox",["display:flex"],cleanC],
    ["justify-content",["justify-content"],cleanC],
    ["align-items",["align-items"],cleanC],
    ["gap",["gap"],cleanC],
    ["Responsive",["@media"],cleanC],
    ["Tres contenedores flex",[],cleanC]
  ];
  let ok=0;
  const rows=checks.map(([name,need,src],i)=>{
    let pass;
    if(i===0)pass=htmlChanged&&need.every(x=>src.includes(x));
    else if(i===1)pass=htmlChanged&&!cleanH.includes("escribe aquí")&&realContent>=3;
    else if(i===2)pass=cssChanged&&need.every(x=>src.includes(x));
    else if(i===7)pass=cssChanged&&flexMatches.length>=3;
    else pass=cssChanged&&need.every(x=>src.includes(x));
    if(pass)ok++;
    return `<div class="${pass?"pass":"fail"}"><span>${pass?"✓":"○"}</span>${name}${i===7?` <small>(${flexMatches.length} detectados)</small>`:""}</div>`;
  }).join("");
  if(unchanged){
    $("#projectAnalysis").innerHTML=`<div class="analysis-head"><b>🔎 Análisis del proyecto</b><strong>0/100</strong></div><div class="project-start-warning"><b>⚠️ Todavía estás usando la plantilla inicial.</b><p>El analizador no marcará como correcto un requisito solo porque el ejemplo ya lo contiene. Escribe contenido propio, cambia la estructura y construye tus tres contenedores Flexbox.</p></div>${rows}`;
    return;
  }
  const score=Math.round(ok/checks.length*100);
  $("#projectAnalysis").innerHTML=`<div class="analysis-head"><b>🔎 Análisis de tu código</b><strong>${score}/100</strong></div>${rows}<p>${score===100?"🏆 Excelente: tu código cumple todos los requisitos técnicos.":"💡 Corrige los requisitos marcados y vuelve a analizar. El analizador revisa tu código real, no la plantilla."}</p>`;
});
/* V4: estado inicial */
updateStepUI();
updateStudentUI();


/* Navegación libre: ningún quiz ni módulo bloquea el contenido. */
function bindLearningStepButtons(){
 $$("#htmlStepper .step-button").forEach(btn=>btn.onclick=()=>{
   htmlStep=Number(btn.dataset.stepIndex)||0; updateStepUI();
 });
 $$("#cssStepper .step-button").forEach(btn=>btn.onclick=()=>{
   cssStep=Number(btn.dataset.stepIndex)||0; updateStepUI();
 });
 $$("#goodStepper .step-button").forEach(btn=>btn.onclick=()=>{
   goodStep=Number(btn.dataset.stepIndex)||0; updateStepUI();
 });
}
bindLearningStepButtons();

/* ===== V6 Interactive Labs ===== */
(function(){
 const $v=s=>document.querySelector(s);
 const HTML_START=`<h1>Mi cafetería</h1>
<p>El mejor café de la ciudad ☕</p>
<button>Ver menú</button>`;
 const FLEX_START=`<style>
.productos {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.producto {
  padding: 25px;
  background: #eee;
  border-radius: 12px;
}
</style>
<div class="productos">
  <div class="producto">☕ Café</div>
  <div class="producto">🍰 Torta</div>
  <div class="producto">🥐 Croissant</div>
</div>`;
 function render(target,code){if(target) target.innerHTML=code;}
 function setup(){
  const he=$v("#v6HtmlEditor"), hp=$v("#v6HtmlPreview"), hf=$v("#v6HtmlFeedback");
  if(he&&hp){
   render(hp,he.value);
   $v("#v6RunHtml")?.addEventListener("click",()=>{
    render(hp,he.value);
    const ok=/<h1[\s\S]*?<\/h1>/i.test(he.value)&&/<p[\s\S]*?<\/p>/i.test(he.value)&&/<button[^>]*>\s*Comprar\s*<\/button>/i.test(he.value);
    hf.className="v6-feedback show "+(ok?"v6-ok":"v6-info");
    hf.textContent=ok?"🎉 ¡Reto completado! Ya estás construyendo una interfaz web.":"👀 Código ejecutado. Para completar la misión, cambia el texto del botón a “Comprar”.";
    if(ok)localStorage.setItem("v6HtmlDone","1");
   });
   $v("#v6HintHtml")?.addEventListener("click",()=>{hf.className="v6-feedback show v6-info";hf.textContent="💡 Busca la etiqueta <button>. El texto que está entre la apertura y el cierre es lo que verá el usuario.";});
   $v("#v6ResetHtml")?.addEventListener("click",()=>{he.value=HTML_START;render(hp,he.value);hf.className="v6-feedback";});
  }
  const fe=$v("#v6FlexEditor"), fp=$v("#v6FlexPreview");
  if(fe&&fp){
   render(fp,fe.value);
   $v("#v6RunFlex")?.addEventListener("click",()=>render(fp,fe.value));
   $v("#v6ResetFlex")?.addEventListener("click",()=>{fe.value=FLEX_START;render(fp,fe.value);});
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
})();

/* ===== V7 navigation safety patch =====
   Content exploration is intentionally independent from quiz completion.
   This prevents a stale localStorage/progress state from trapping the student
   in "Fundamentos" or "Elige una etiqueta HTML".
*/
(function(){
  function unlockLearningUI(){
    document.querySelectorAll(".step-button, .topic-button, [data-topic], [data-step-index]").forEach(el=>{
      el.removeAttribute("disabled");
      el.classList.remove("locked","disabled");
      el.style.pointerEvents="auto";
    });

    // Do not let a stale "locked" class hide the lesson content.
    document.querySelectorAll(".locked,.is-locked").forEach(el=>{
      if(el.closest("#html") || el.closest("#css") || el.closest("#interactive")){
        el.classList.remove("locked","is-locked");
      }
    });
  }

  function patchButtons(){
    unlockLearningUI();

    document.querySelectorAll("#htmlStepper .step-button").forEach(btn=>{
      btn.onclick=()=>{
        const i=Number(btn.dataset.stepIndex);
        if(Number.isFinite(i)){
          window.htmlStep=i;
          if(typeof updateStepUI==="function") updateStepUI();
        }
      };
    });

    document.querySelectorAll("#cssStepper .step-button").forEach(btn=>{
      btn.onclick=()=>{
        const i=Number(btn.dataset.stepIndex);
        if(Number.isFinite(i)){
          window.cssStep=i;
          if(typeof updateStepUI==="function") updateStepUI();
        }
      };
    });

    // Interactive HTML: allow selecting any tag/card.
    document.querySelectorAll(
      '#interactive [data-tag], #interactive .tag-option, #interactive .html-tag-option, #htmlInteractive [data-tag]'
    ).forEach(btn=>{
      btn.removeAttribute("disabled");
      btn.style.pointerEvents="auto";
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{
    patchButtons();
    setTimeout(patchButtons,100);
    setTimeout(patchButtons,500);
  });
})();

try{
  ["htmlLocked","cssLocked","interactiveLocked","currentTopicLock"].forEach(k=>localStorage.removeItem(k));
}catch(e){}

/* ===== V8 Interactive Semantic HTML Explorer ===== */
(function(){
 const data={
  header:{name:"header",title:"Encabezado",what:"Representa contenido introductorio de una página o de una sección.",when:"Úsala para logotipo, título, descripción o información inicial.",example:`<header>
  <h1>Mi tienda</h1>
  <p>Productos hechos con amor</p>
</header>`,challenge:"Agrega dentro del header un enlace que diga “Inicio”.",hint:"Usa <a href=\"#\">Inicio</a>."},
  nav:{name:"nav",title:"Navegación",what:"Agrupa enlaces de navegación importantes del sitio.",when:"Úsala para menús principales o conjuntos de enlaces de navegación.",example:`<nav>
  <a href="#inicio">Inicio</a>
  <a href="#productos">Productos</a>
  <a href="#contacto">Contacto</a>
</nav>`,challenge:"Agrega un enlace llamado “Contacto”.",hint:"Crea otro <a href=\"#\">Contacto</a>."},
  main:{name:"main",title:"Contenido principal",what:"Contiene el contenido principal y único de la página.",when:"Debe contener la información central que distingue esa página.",example:`<main>
  <h1>Catálogo</h1>
  <p>Estos son nuestros productos.</p>
</main>`,challenge:"Agrega una lista dentro de main.",hint:"Puedes usar <ul> con varios <li>."},
  section:{name:"section",title:"Sección temática",what:"Agrupa contenido relacionado que forma parte de una misma página.",when:"Úsala cuando puedas identificar un tema o bloque de contenido.",example:`<section>
  <h2>Promociones</h2>
  <p>20% de descuento esta semana.</p>
</section>`,challenge:"Agrega un subtítulo dentro de la sección.",hint:"Usa un <h2> o <h3>."},
  article:{name:"article",title:"Contenido independiente",what:"Representa una pieza de contenido que podría existir por sí sola.",when:"Ideal para noticias, publicaciones, reseñas o tarjetas con contenido autónomo.",example:`<article>
  <h2>Nuevo producto</h2>
  <p>Conoce nuestra nueva colección.</p>
</article>`,challenge:"Agrega un botón al artículo.",hint:"Usa <button>Comprar</button>."},
  aside:{name:"aside",title:"Contenido complementario",what:"Contiene información relacionada pero secundaria al contenido principal.",when:"Úsala para recomendaciones, enlaces relacionados o barras laterales.",example:`<aside>
  <h2>También te puede interesar</h2>
  <p>Descubre nuestras novedades.</p>
</aside>`,challenge:"Agrega un enlace dentro del aside.",hint:"Usa una etiqueta <a>."},
  footer:{name:"footer",title:"Pie de página",what:"Contiene información final de una página o sección.",when:"Ideal para derechos de autor, contacto, redes y enlaces legales.",example:`<footer>
  <p>© 2026 Mi tienda</p>
</footer>`,challenge:"Agrega un texto con tu correo.",hint:"Puedes usar <p>contacto@ejemplo.com</p>."},
  form:{name:"form",title:"Formulario",what:"Agrupa controles que permiten al usuario introducir y enviar información.",when:"Úsala para login, registro, contacto, búsquedas o compras.",example:`<form>
  <label>Nombre</label>
  <input type="text" placeholder="Escribe tu nombre">
  <button>Enviar</button>
</form>`,challenge:"Agrega un campo para el correo.",hint:"Usa <input type=\"email\" placeholder=\"Correo\">."}
 };
 function setup(){
  const info=document.querySelector("#v8TagInfo"),lab=document.querySelector("#v8TagLab"),ed=document.querySelector("#v8TagEditor"),prev=document.querySelector("#v8TagPreview"),fb=document.querySelector("#v8TagFeedback");
  if(!info||!lab||!ed||!prev)return;
  document.querySelectorAll(".v8-tag").forEach(btn=>btn.addEventListener("click",()=>{
   document.querySelectorAll(".v8-tag").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
   const d=data[btn.dataset.htmltag];
   info.innerHTML=`<h3>🏷️ &lt;${d.name}&gt; — ${d.title}</h3><p><b>¿Qué hace?</b> ${d.what}</p><p><b>¿Cuándo usarla?</b> ${d.when}</p><div class="v8-example">${d.example.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div><div class="v8-tip">🎯 <b>Tu reto:</b> ${d.challenge}</div>`;
   ed.value=d.example;prev.innerHTML=d.example;lab.classList.remove("hidden");fb.className="v6-feedback";
   ed.dataset.expected=d.challenge;
   ed.dataset.hint=d.hint;
  }));
  document.querySelector("#v8RunTag")?.addEventListener("click",()=>{
   prev.innerHTML=ed.value;
   const expected=ed.dataset.expected||"";
   const hint=ed.dataset.hint||"";
   let ok=false;
   if(/Contacto/.test(expected)) ok=/Contacto/i.test(ed.value);
   else if(/lista/.test(expected)) ok=/<ul/i.test(ed.value)&&/<li/i.test(ed.value);
   else if(/subtítulo/.test(expected)) ok=/<h[2-6]/i.test(ed.value);
   else if(/botón/.test(expected)) ok=/<button/i.test(ed.value);
   else if(/enlace/.test(expected)) ok=/<a\s/i.test(ed.value);
   else if(/correo/.test(expected)) ok=/<input[^>]*email/i.test(ed.value)||/contacto@/i.test(ed.value);
   fb.className="v6-feedback show "+(ok?"v6-ok":"v6-info");
   fb.textContent=ok?"🎉 ¡Reto conseguido! Cambiaste el código y el navegador lo renderizó.":"👀 El código se ejecutó. Todavía no cumple el reto. "+hint;
  });
  document.querySelector("#v8HintTag")?.addEventListener("click",()=>{
   fb.className="v6-feedback show v6-info";fb.textContent="💡 "+(ed.dataset.hint||"Observa el ejemplo y modifica una etiqueta.");
  });
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
})();

/* ===== V9: final navigation safety ===== */
(function(){
  function safeLessonState(){
    if(typeof window.htmlStep!=="number") window.htmlStep=0;
    if(typeof window.cssStep!=="number") window.cssStep=0;
    if(typeof window.goodStep!=="number") window.goodStep=0;
  }

  function safeBind(){
    safeLessonState();

    document.querySelectorAll("#htmlStepper .step-button").forEach(btn=>{
      btn.disabled=false;
      btn.classList.remove("locked","disabled");
      btn.onclick=function(){
        safeLessonState();
        window.htmlStep=Number(this.dataset.stepIndex)||0;
        if(typeof updateStepUI==="function") updateStepUI();
      };
    });

    document.querySelectorAll("#cssStepper .step-button").forEach(btn=>{
      btn.disabled=false;
      btn.classList.remove("locked","disabled");
      btn.onclick=function(){
        safeLessonState();
        window.cssStep=Number(this.dataset.stepIndex)||0;
        if(typeof updateStepUI==="function") updateStepUI();
      };
    });
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",safeBind);
  }else{
    safeBind();
  }
})();

/* ===== V10: FREE FLOW MODE =====
   La plataforma es interactiva, no secuencial.
   Quizzes, retos y "marcar como estudiado" son opcionales.
*/
(function(){
  function freeFlow(){
    document.querySelectorAll(
      ".side-nav,.step-button,.topic-tabs button,.topic-button,[data-page],[data-step-index]"
    ).forEach(el=>{
      el.disabled=false;
      el.removeAttribute("disabled");
      el.classList.remove("locked","locked-nav","is-locked","disabled");
      el.style.pointerEvents="auto";
    });

    // Never replace navigation labels with lock icons.
    document.querySelectorAll("#studentNav .side-nav span").forEach(span=>{
      if(span.textContent.trim().startsWith("🔒 ")){
        span.textContent=span.textContent.trim().replace(/^🔒\s*/,"");
      }
    });
  }

  window.freeFlowMode=true;
  freeFlow();
  document.addEventListener("DOMContentLoaded",()=>{
    freeFlow();
    setTimeout(freeFlow,100);
    setTimeout(freeFlow,500);
  });
})();

/* V12 - Buenas prácticas interactivas */
(function(){
const data={
names:["🏷️","Nombres claros","Una clase debe describir el propósito del componente, no una apariencia temporal.",".rojo-grande",".producto-destacado","Cambia nombres basados en colores o tamaños por nombres que describan el componente."],
semantic:["🧩","HTML semántico","Elige etiquetas por su significado: header, nav, main, section, article y footer ayudan a estructurar la página.","<div class=\"menu\">","<nav>","Cuando un bloque representa navegación, usa <nav> en lugar de un div genérico."],
css:["🎨","CSS limpio","Agrupa reglas relacionadas, evita repetir estilos y separa estructura HTML de presentación CSS.",".titulo { color:red } .titulo2 { color:red }",".titulo, .titulo2 { color:red }","Busca estilos repetidos y piensa cómo podrías reutilizarlos."],
accessibility:["♿","Accesibilidad","Una interfaz profesional debe poder comprenderse y utilizarse con teclado y lectores de pantalla.",'<input placeholder="Correo">','<label for="email">Correo</label><input id="email" type="email">',"Relaciona cada campo con su label usando for e id."],
responsive:["📱","Responsive","Comprueba qué ocurre cuando el espacio disponible se reduce.","width: 900px;","max-width: 100%; width: 100%;","Evita anchos rígidos que puedan desbordar la pantalla."]
};
function render(k){const d=data[k],c=document.querySelector("#bpContent");if(!c)return;c.innerHTML=`<article class="bp-card"><div class="bp-icon">${d[0]}</div><h3>${d[1]}</h3><p>${d[2]}</p><div class="bp-compare"><div class="bp-bad"><b>❌ Evita</b><code>${d[3]}</code><small>Puede dificultar el mantenimiento o la experiencia.</small></div><div class="bp-good"><b>✅ Mejor enfoque</b><code>${d[4]}</code><small>Es más claro, reutilizable y fácil de mantener.</small></div></div><div class="bp-challenge"><b>🎯 Mini reto:</b> ${d[5]}</div></article>`}
function init(){document.querySelectorAll(".bp-tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".bp-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.bptab)});const e=document.querySelector("#bpEditor"),p=document.querySelector("#bpPreview"),f=document.querySelector("#bpFeedback");if(e&&p){p.innerHTML=e.value;document.querySelector("#bpRun").onclick=()=>{p.innerHTML=e.value;const ok=/producto-destacado/i.test(e.value)&&!/\.rojo-grande\s*\{/.test(e.value);f.className="v6-feedback show "+(ok?"v6-ok":"v6-info");f.textContent=ok?"🎉 ¡Bien! Tu nombre describe el componente.":"👀 Ejecutado. Intenta reemplazar .rojo-grande por un nombre como .producto-destacado."};document.querySelector("#bpHint").onclick=()=>{f.className="v6-feedback show v6-info";f.textContent="💡 Pista: el nombre debe seguir teniendo sentido si cambias el color o tamaño."};const initial=e.value;document.querySelector("#bpReset").onclick=()=>{e.value=initial;p.innerHTML=initial;f.className="v6-feedback"} }render("names")}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();


/* ===== V13 · Interactive HTML tags ===== */
(function(){
  const tags={
    header:{label:"Encabezado",desc:"Contiene contenido introductorio de una página o sección.",use:"Úsalo para el nombre del sitio, logotipo, título o introducción.",code:`<header>
  <h1>Mi cafetería</h1>
  <p>El mejor café de la ciudad</p>
</header>`,render:`<header style="padding:18px;border-radius:14px;background:#fff3e8;border:2px solid #ffb37c"><h1 style="margin:0 0 6px">Mi cafetería ☕</h1><p style="margin:0">El mejor café de la ciudad</p></header>`},
    main:{label:"Contenido principal",desc:"Representa el contenido principal y único de una página.",use:"Debe contener aquello que es el objetivo central de esa página.",code:`<main>
  <h1>Nuestros productos</h1>
  <p>Conoce nuestro catálogo.</p>
</main>`,render:`<main style="padding:18px;border-radius:14px;background:#eef7ff;border:2px solid #8bc8ff"><h1 style="margin:0 0 6px">Nuestros productos</h1><p style="margin:0">Conoce nuestro catálogo.</p></main>`},
    img:{label:"Imagen",desc:"Inserta una imagen. Es una etiqueta vacía y no lleva etiqueta de cierre.",use:"Úsala para fotografías, ilustraciones, logos y otros recursos visuales.",code:`<img src="https://picsum.photos/420/180" alt="Paisaje de ejemplo">`,render:`<img src="https://picsum.photos/420/180" alt="Paisaje de ejemplo" style="max-width:100%;border-radius:14px;display:block">`},
    a:{label:"Enlace",desc:"Crea enlaces para navegar a otra página, sección, archivo o recurso.",use:"Úsala cuando el usuario deba poder ir a otro lugar.",code:`<a href="#contacto">Ir a contacto</a>`,render:`<a href="#contacto" style="display:inline-block;padding:11px 15px;border-radius:10px;background:#172033;color:white;text-decoration:none;font-weight:700">Ir a contacto →</a>`},
    form:{label:"Formulario",desc:"Agrupa controles que permiten al usuario introducir y enviar información.",use:"Úsalo para registros, login, contacto, búsquedas y compras.",code:`<form>
  <label for="nombre">Nombre</label>
  <input id="nombre" placeholder="Escribe tu nombre">
  <button>Enviar</button>
</form>`,render:`<form style="display:grid;gap:9px;max-width:360px"><label for="nombre" style="font-weight:700">Nombre</label><input id="nombre" placeholder="Escribe tu nombre" style="padding:10px;border:1px solid #ccd3df;border-radius:9px"><button type="button" style="padding:10px;border:0;border-radius:9px;background:#7257e8;color:white;font-weight:800">Enviar</button></form>`}
  };
  function init(){
    const buttons=document.querySelectorAll(".html-interactive .html-tag-btn");
    const preview=document.querySelector("#htmlTagPreview");
    if(!buttons.length||!preview)return;
    function show(name){
      const d=tags[name]||tags.header;
      buttons.forEach(b=>b.classList.toggle("active",b.dataset.tag===name));
      preview.innerHTML=`<div class="v13-tag-heading"><span class="v13-tag-pill">&lt;${name}&gt;</span><strong>${d.label}</strong></div><div class="v13-tag-render">${d.render}</div><div class="v13-tag-explain"><b>¿Qué hace?</b> ${d.desc}<br><b>¿Cuándo usarla?</b> ${d.use}</div><pre><code>${d.code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre><div class="v13-tag-challenge"><b>🎯 Mini reto:</b> cambia el ejemplo, pruébalo y luego explora otra etiqueta. No necesitas completar nada para continuar.</div>`;
    }
    buttons.forEach(btn=>{
      btn.disabled=false;btn.removeAttribute("disabled");
      btn.addEventListener("click",()=>show(btn.dataset.tag));
    });
    show(document.querySelector(".html-interactive .html-tag-btn.active")?.dataset.tag||"header");
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();


/* ===== V17 · Flexbox interactive labs and challenges ===== */
(function(){
  const labs={
    nav:{
      title:"🧭 Laboratorio 1 · Construye una navegación",
      mission:"Crea una barra donde la marca quede a la izquierda y los enlaces a la derecha. Los elementos deben quedar centrados verticalmente y separados de forma consistente.",
      starter:`.nav {
  display: flex;
  /* escribe aquí */
}

.links {
  display: flex;
  /* escribe aquí */
}`,
      html:`<nav class="lab-nav-demo"><strong>MiSitio</strong><div class="links"><a>Inicio</a><a>Cursos</a><a>Proyectos</a><a>Contacto</a></div></nav>`,
      hints:["¿Qué propiedad activa Flexbox?","¿Quieres separar los extremos? Piensa en space-between.","Los enlaces también son un grupo Flexbox: ¿qué necesitas para crear espacio entre ellos?" ],
      expected:["display","justify-content","align-items","gap"]
    },
    cards:{
      title:"🃏 Laboratorio 2 · Tarjetas que se adaptan",
      mission:"Construye una cuadrícula de tarjetas que pueda saltar a otra línea cuando no haya espacio. No uses position ni floats.",
      starter:`.cards {
  display: flex;
  /* permite varias líneas */
  /* agrega espacio entre tarjetas */
}

.card {
  /* define un tamaño base */
}`,
      html:`<div class="lab-cards-demo"><article class="card"><b>HTML</b><p>Estructura semántica.</p></article><article class="card"><b>CSS</b><p>Estilos y diseño.</p></article><article class="card"><b>Flexbox</b><p>Distribución.</p></article><article class="card"><b>Responsive</b><p>Adaptación.</p></article><article class="card"><b>UI</b><p>Interfaces.</p></article>`,
      hints:["Necesitas flex-wrap: wrap.","Usa gap para evitar márgenes repetidos.","Prueba flex: 1 1 180px en .card."],
      expected:["flex-wrap","gap","flex"]
    },
    hero:{
      title:"🦸 Laboratorio 3 · Construye un Hero",
      mission:"Organiza texto e imagen en una fila, distribuye el espacio y céntralos verticalmente. Después intenta convertirlo en columna.",
      starter:`.hero {
  display: flex;
  /* distribución */
  /* alineación vertical */
  /* espacio entre bloques */
}`,
      html:`<section class="lab-hero-demo"><div><small>APRENDE WEB</small><h3>Construye algo increíble.</h3><p>HTML + CSS + Flexbox.</p><button>Comenzar</button></div><div class="hero-art">🚀</div></section>`,
      hints:["justify-content controla el eje principal.","align-items controla el eje transversal.","gap crea espacio entre texto e imagen."],
      expected:["justify-content","align-items","gap"]
    },
    responsive:{
      title:"📱 Laboratorio 4 · Hazlo responsive",
      mission:"En escritorio el contenido debe estar en fila. En pantallas pequeñas debe pasar a columna. Aquí combinarás Flexbox y una media query.",
      starter:`.layout {
  display: flex;
  gap: 20px;
}

@media (max-width: 700px) {
  .layout {
    /* cambia la dirección */
  }
}`,
      html:`<div class="lab-responsive-demo"><div>🖼️ Imagen</div><div><h3>Contenido</h3><p>En escritorio estoy al lado. En móvil quiero estar debajo.</p></div></div>`,
      hints:["La dirección por defecto es row.","En móvil usa flex-direction: column.","No necesitas JavaScript para hacer este cambio."],
      expected:["flex-direction","column"]
    }
  };

  const challenges=[
    {level:"🟢 NIVEL 1",title:"Céntralo perfecto",mission:"Tienes un botón dentro de una caja. Haz que quede centrado horizontal y verticalmente.",html:`<div class="ch-box"><button>Estoy centrado</button></div>`,starter:`.box {
  display: flex;
  /* completa las dos propiedades */
}`,hint:"Piensa en los dos ejes.",solution:`.box {
  display: flex;
  justify-content: center;
  align-items: center;
}`},
    {level:"🟢 NIVEL 1",title:"Separa los extremos",mission:"Coloca el logo a la izquierda y el botón a la derecha.",html:`<div class="ch-nav"><b>LOGO</b><button>Entrar</button></div>`,starter:`.nav {
  display: flex;
  /* ¿cómo separas los extremos? */
}`,hint:"Busca una distribución que coloque uno al inicio y otro al final.",solution:`.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`},
    {level:"🟡 NIVEL 2",title:"Tarjetas que saltan de línea",mission:"Hay cinco tarjetas. Haz que se acomoden en varias filas y mantengan un espacio uniforme.",html:`<div class="ch-cards"><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i></div>`,starter:`.cards {
  display: flex;
  /* completa wrap + gap */
}
.cards i {
  flex: 1 1 140px;
}`,hint:"Necesitas permitir varias líneas y separar los elementos.",solution:`.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}`},
    {level:"🟡 NIVEL 2",title:"Descubre el error",mission:"El desarrollador quería centrar la caja, pero no funciona como esperaba. Corrige el CSS.",html:`<div class="ch-error"><b>¿Dónde estoy?</b></div>`,starter:`.box {
  display: flex;
  justify-content: center;
  /* falta algo */
}`,hint:"justify-content y align-items trabajan en ejes diferentes.",solution:`.box {
  display: flex;
  justify-content: center;
  align-items: center;
}`},
    {level:"🔴 NIVEL 3",title:"Layout responsive",mission:"Construye un layout horizontal en escritorio que se convierta en columna en pantallas de 700px o menos.",html:`<div class="ch-responsive"><div>CONTENIDO A</div><div>CONTENIDO B</div></div>`,starter:`.layout {
  display: flex;
  gap: 16px;
}

@media (max-width: 700px) {
  .layout {
    /* tu solución */
  }
}`,hint:"En móvil cambia el eje principal.",solution:`.layout {
  display: flex;
  gap: 16px;
}

@media (max-width: 700px) {
  .layout {
    flex-direction: column;
  }
}`},
    {level:"🏆 DESAFÍO FINAL",title:"Mini página con Flexbox",mission:"Construye una mini interfaz con navegación, hero y tarjetas. Usa Flexbox para organizar los bloques y hazla adaptable.",html:`<div class="ch-final"><nav>NAV</nav><main>HERO</main><section><i>CARD 1</i><i>CARD 2</i><i>CARD 3</i></section></div>`,starter:`/* 1. Navegación */
/* 2. Hero */
/* 3. Tarjetas */
/* 4. Responsive */`,hint:"Divide el problema: primero contenedores, luego dirección, distribución, alineación y finalmente responsive.",solution:`nav { display:flex; justify-content:space-between; align-items:center; }
main { display:flex; justify-content:space-between; align-items:center; gap:24px; }
section { display:flex; flex-wrap:wrap; gap:16px; }
@media (max-width:700px) {
  main { flex-direction:column; }
}`}
  ];

  function escapeHTML(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  function runPreview(frame, htmlCode, cssCode){
    if(!frame)return;
    frame.srcdoc=`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
      *{box-sizing:border-box}body{margin:0;padding:18px;font-family:Arial,sans-serif;background:#f7f8fc;color:#172033}
      ${cssCode}
      .lab-nav-demo{padding:14px;border-radius:12px;background:#172033;color:#fff}
      .lab-nav-demo .links{display:flex}.lab-nav-demo a{color:#fff;padding:7px 9px;text-decoration:none}
      .lab-cards-demo{display:flex}.lab-cards-demo .card{padding:18px;background:#fff;border:1px solid #dfe4ec;border-radius:12px}
      .lab-hero-demo{padding:25px;background:#fff;border-radius:16px}.hero-art{width:120px;height:120px;display:grid;place-items:center;border-radius:20px;background:#e9e5ff;font-size:45px}
      .lab-responsive-demo{display:flex}.lab-responsive-demo>div{padding:25px;background:#fff;border:1px solid #dfe4ec;border-radius:12px;flex:1}
      button{padding:9px 13px;border:0;border-radius:8px;background:#7257e8;color:#fff;font-weight:700}
      @media(max-width:700px){.lab-hero-demo{flex-direction:column}.lab-responsive-demo{flex-direction:column}}
    </style></head><body>${htmlCode}</body></html>`;
  }

  function renderLab(key){
    const d=labs[key], host=document.getElementById("fx17Lab"); if(!d||!host)return;
    host.innerHTML=`<div class="fx17-mission"><h3>${d.title}</h3><p>${d.mission}</p></div>
      <div class="fx17-editor">
        <div class="fx17-codepane"><div class="fx17-codehead">✍️ TU CSS <button type="button" class="fx17-run" id="fx17LabRun">▶ Ejecutar</button></div><textarea id="fx17LabCSS" spellcheck="false">${d.starter}</textarea>
        <div class="fx17-actions"><button type="button" id="fx17LabReset">↩ Reiniciar</button><button type="button" id="fx17LabHint">💡 Pista <span>1</span></button><button type="button" id="fx17LabSolution">👀 Ver solución</button></div><div id="fx17LabHintBox" class="fx17-hintbox"></div></div>
        <div class="fx17-output"><div class="fx17-outputhead">🌐 TU RESULTADO</div><iframe id="fx17LabFrame" title="Resultado del laboratorio"></iframe></div>
      </div>`;
    const ta=document.getElementById("fx17LabCSS"), frame=document.getElementById("fx17LabFrame");
    const run=()=>runPreview(frame,d.html,ta.value);
    document.getElementById("fx17LabRun").onclick=run;
    document.getElementById("fx17LabReset").onclick=()=>{ta.value=d.starter;run();document.getElementById("fx17LabHintBox").textContent=""};
    let hint=0; document.getElementById("fx17LabHint").onclick=()=>{hint=Math.min(hint+1,d.hints.length);document.getElementById("fx17LabHint").querySelector("span").textContent=hint;document.getElementById("fx17LabHintBox").textContent=d.hints[hint-1]||"Ya viste todas las pistas. ¡Inténtalo!"};
    document.getElementById("fx17LabSolution").onclick=()=>{ta.value=d.starter+"\\n\\n/* SOLUCIÓN DE REFERENCIA */\\n"+d.expected.map(x=>`/* usa ${x} correctamente */`).join("\\n");ta.focus();};
    ta.addEventListener("keydown",e=>{if(e.key==="Tab"){e.preventDefault();const s=ta.selectionStart;ta.value=ta.value.slice(0,s)+"  "+ta.value.slice(ta.selectionEnd);ta.selectionStart=ta.selectionEnd=s+2}});
    run();
  }

  function renderChallenges(){
    const host=document.getElementById("fx17Challenges");if(!host)return;
    host.innerHTML=challenges.map((c,i)=>`<article class="fx17-challenge" data-ch="${i}"><div class="fx17-level">${c.level}</div><h3>${c.title}</h3><p>${c.mission}</p><div class="fx17-ch-editor"><div><div class="fx17-codehead">✍️ TU CSS <button type="button" class="fx17-ch-run" data-run="${i}">▶ Ejecutar</button></div><textarea class="fx17-ch-text" spellcheck="false">${c.starter}</textarea><div class="fx17-actions"><button type="button" data-hint="${i}">💡 Pista</button><button type="button" data-solution="${i}">👀 Solución</button></div><div class="fx17-hintbox" id="fx17Hint-${i}"></div></div><iframe id="fx17ChFrame-${i}" title="Resultado del reto"></iframe></div></article>`).join("");
    host.querySelectorAll("[data-run]").forEach(b=>b.onclick=()=>{const i=+b.dataset.run;runPreview(document.getElementById("fx17ChFrame-"+i),challenges[i].html,host.querySelectorAll(".fx17-ch-text")[i].value)});
    host.querySelectorAll("[data-hint]").forEach(b=>b.onclick=()=>document.getElementById("fx17Hint-"+b.dataset.hint).textContent=challenges[+b.dataset.hint].hint);
    host.querySelectorAll("[data-solution]").forEach(b=>b.onclick=()=>{const i=+b.dataset.solution;host.querySelectorAll(".fx17-ch-text")[i].value=challenges[i].solution;});
    host.querySelectorAll(".fx17-ch-text").forEach((ta,i)=>{ta.addEventListener("keydown",e=>{if(e.key==="Tab"){e.preventDefault();const s=ta.selectionStart;ta.value=ta.value.slice(0,s)+"  "+ta.value.slice(ta.selectionEnd);ta.selectionStart=ta.selectionEnd=s+2}});runPreview(document.getElementById("fx17ChFrame-"+i),challenges[i].html,ta.value)});
  }

  function init(){
    const tabs=document.querySelectorAll("#fx17Tabs .fx17-tab"), panels=document.querySelectorAll("#flex .fx17-panel");
    tabs.forEach(t=>t.addEventListener("click",()=>{
      const target=t.dataset.tab;
      tabs.forEach(x=>x.classList.toggle("is-active",x===t));
      panels.forEach(p=>p.classList.toggle("is-active",p.dataset.panel===target));
      if(target==="laboratorios" && !document.querySelector("#fx17Lab iframe"))renderLab("nav");
      if(target==="retos" && !document.querySelector("#fx17Challenges article"))renderChallenges();
    }));
    const canvas=document.getElementById("fx17Canvas"), d=document.getElementById("fx17Direction"), j=document.getElementById("fx17Justify"), a=document.getElementById("fx17Align"), w=document.getElementById("fx17Wrap"), g=document.getElementById("fx17Gap"), out=document.getElementById("fx17GapOut"), code=document.getElementById("fx17Code");
    const render=()=>{canvas.style.flexDirection=d.value;canvas.style.justifyContent=j.value;canvas.style.alignItems=a.value;canvas.style.flexWrap=w.value;canvas.style.gap=g.value+"px";out.value=g.value+"px";out.textContent=g.value+"px";code.textContent=`display: flex;\\nflex-direction: ${d.value};\\njustify-content: ${j.value};\\nalign-items: ${a.value};\\nflex-wrap: ${w.value};\\ngap: ${g.value}px;`};
    [d,j,a,w,g].forEach(x=>{x.addEventListener("input",render);x.addEventListener("change",render)});document.getElementById("fx17Reset").onclick=()=>{d.value="row";j.value="flex-start";a.value="stretch";w.value="nowrap";g.value=16;render()};render();
    document.querySelectorAll("#fx17LabNav button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#fx17LabNav button").forEach(x=>x.classList.toggle("is-active",x===b));renderLab(b.dataset.lab)}));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
