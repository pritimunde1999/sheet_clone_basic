const theadRow = document.getElementById("head-row");
const col = 26;
const body = document.getElementById("table-body");
const rows=100;
const arrMatrix='arrMatrix';

const selectedCell = document.getElementById("selected-cell");
const boldbtn = document.getElementById("boldbtn");
const italicbtn = document.getElementById("italicbtn");
const underlinebtn = document.getElementById("underlinebtn");

const leftbtn = document.getElementById("align-left");
const rightbtn = document.getElementById("align-right");
const centerbtn = document.getElementById("align-center");

const fontFamilySelector = document.getElementById("font_family");
const fontSizeSelector = document.getElementById("font_size");

const backgroundColorBtn = document.getElementById("backColor");
const textColorBtn = document.getElementById("textColor");

const copy = document.getElementById("copy");
const paste = document.getElementById("paste");
const cut = document.getElementById("cut");

const download = document.getElementById("download");
const upload = document.getElementById("upload");

const addSheetBtn = document.getElementById("add-sheet");
const sheetContainer = document.getElementById("sheet-container");

let prevPressedBtn;
let prevCellId;
let currCell; 
let cutCell;
let lastHandleBtn;
let numSheets=1;
let currentSheet =1;
let prevSheet;
let matrix = new Array(rows);
 createNewMatrix();

 if(localStorage.getItem(arrMatrix)){
    for(let i=0; i<JSON.parse(localStorage.getItem(arrMatrix)).length; i++)
    {
       genNextBtn(true);
    }
 }

 function createNewMatrix(){
    for(let i=0; i<rows; i++)
    {
       matrix[i] = new Array(col);
       for(let j=0; j<col; j++)
       {
          matrix[i][j] = {};
       }
    }
 }

function colGen(typeOfCell, whrToAppend, isInnerText,rowNum)
{
    for(let i=0; i<col; i++)
   {
      const cell = document.createElement(typeOfCell);
      if(isInnerText)
      {
        cell.innerText = String.fromCharCode(i+ 65);
        cell.setAttribute('id',`${String.fromCharCode(i+ 65)}`);
      }
      else
      {
        cell.setAttribute('id',`${String.fromCharCode(i+ 65)}${rowNum}`);
        cell.setAttribute('contenteditable','true');
        cell.addEventListener('focusout', ()=>{
          console.log("focusout");
          updateObjectInMatrix();
        });
        cell.addEventListener("focus",event=>onFocus(event.target));
        
      }
      whrToAppend.append(cell); 
   }
}

function onClickOnButtons(buttonType)
{
  buttonType.style.backgroundColor = '#f2f2f2';
  buttonType.style.border = '1px solid #d5d1d1';
  buttonType.style.borderRadius = '3px';
  updateObjectInMatrix();
}

function onClickOutFromButtons(buttonType)
{
    buttonType.style.backgroundColor = 'transparent';
    buttonType.style.border = 'none';
    updateObjectInMatrix();
}

function setCellColor(colId,rowId,color)
{
     const col = document.getElementById(colId);
     const row = document.getElementById(rowId);

     col.style.backgroundColor = color;
     row.style.backgroundColor = color;
     updateObjectInMatrix();
}

function onFocus(cellElement){
     
     currCell = cellElement;
     
     selectedCell.innerText = currCell.id;
     if(prevCellId)
     {
       setCellColor(prevCellId[0],prevCellId.substring(1),'#f9f9f9');
     }

     setCellColor(cellElement.id[0],cellElement.id.substring(1),'#d5d1d1');
     check(cellElement,'fontWeight','bold',boldbtn);
     check(cellElement,'fontStyle','italic',italicbtn);
     check(cellElement,'textDecoration','underline',underlinebtn);
     check(cellElement,'textAlign','left',leftbtn);
     check(cellElement,'textAlign','center',centerbtn);
     check(cellElement,'textAlign','right',rightbtn);

     
     if(cellElement.style.fontFamily !== ' ')
      {
        fontFamilySelector.value = cellElement.style.fontFamily;
      }
     if(cellElement.style.fontSize !== ' ')
     {
       fontSizeSelector.value = cellElement.style.fontSize;
     }

    
    
    prevCellId = cellElement.id;
        
}





function check(currentCell,styling,property,applytowhom)
{  
   if(currentCell.style[styling]=== property)
   {
      onClickOnButtons(applytowhom);
   }
   else{
    onClickOutFromButtons(applytowhom);
   }

   updateObjectInMatrix();
}

colGen("th",theadRow,true);
tableBodyGen();
console.log(arrMatrix);
if(localStorage.getItem(arrMatrix)){
  console.log("yes");
  matrix=JSON.parse(localStorage.getItem(arrMatrix))[0];
  renderMatrix();
}

function tableBodyGen(){
  body.innerHTML ='';
for(let i=1; i<=rows; i++)
  {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    
    th.innerText = i;
    th.id = `${i}`;
    tr.append(th);
    colGen("td",tr,false,i);
    body.append(tr);
  }
}

function button(button1,styling,property,propertyClickOut)
{    
   if(currCell.style[styling] === property)
   { 
     currCell.style[styling] = propertyClickOut;
     onClickOutFromButtons(button1);
   }
   else
   {  
      currCell.style[styling] = property;
      onClickOnButtons(button1);
   }
   updateObjectInMatrix();
}


function updateObjectInMatrix(){
  console.log("yes");
  let id = currCell.id;
  let tempObj={
      id: id,
      text: currCell.innerText,
      style: currCell.style.cssText,
  }
  let col=id[0].charCodeAt(0)-65;
  let row=id.substr(1)-1;
  matrix[row][col]=tempObj;
}


boldbtn.addEventListener("click",()=>button(boldbtn,'fontWeight','bold','normal'));
italicbtn.addEventListener("click",()=> button(italicbtn,'fontStyle','italic','normal'));
underlinebtn.addEventListener("click",()=> button(underlinebtn,'textDecoration','underline','none'));

leftbtn.addEventListener("click",()=> {
  if(prevPressedBtn !== undefined)
  {
      onClickOutFromButtons(prevPressedBtn);
  }
  button(leftbtn,'textAlign','left','normal');
  prevPressedBtn = leftbtn;
  updateObjectInMatrix();
});

centerbtn.addEventListener("click",()=> {
  if(prevPressedBtn !== undefined)
  {    
      onClickOutFromButtons(prevPressedBtn);
  }
  button(centerbtn,'textAlign','center','normal');
  prevPressedBtn = centerbtn;
  updateObjectInMatrix();
});

rightbtn.addEventListener("click",()=> {
  if(prevPressedBtn !== undefined)
  {
      onClickOutFromButtons(prevPressedBtn);
  }
  button(rightbtn,'textAlign','right','normal');
  prevPressedBtn = rightbtn;
  updateObjectInMatrix();
});

fontFamilySelector.addEventListener('change',()=>{
   currCell.style.fontFamily = fontFamilySelector.value;
   updateObjectInMatrix();
});

fontSizeSelector.addEventListener('change',()=>{
  currCell.style.fontSize = fontSizeSelector.value;
  updateObjectInMatrix();
});

backgroundColorBtn.addEventListener("input",()=>{
    currCell.style.backgroundColor = backgroundColorBtn.value;
    updateObjectInMatrix();
});

textColorBtn.addEventListener("input",()=>{
  currCell.style.color = textColorBtn.value;
  updateObjectInMatrix();
});

cut.addEventListener("click",()=>{
  lastHandleBtn ='cut';
    cutCell ={
       text : currCell.innerText,
       style : currCell.style.cssText
    }

    cutCell.innerText ='';
    cutCell.style.cssText = '';
    updateObjectInMatrix();
});

copy.addEventListener("click",()=>{
    lastHandleBtn='copy';
    cutCell ={
    text : currCell.innerText,
    style : currCell.style.cssText
  }
});

paste.addEventListener("click",()=>{
    
    currCell.innerText = cutCell.text;
    currCell.style = cutCell.style;

    if(lastHandleBtn==='cut')
    {
      cutCell = undefined;
    }
    updateObjectInMatrix();
});

addSheetBtn.addEventListener("click",()=>{
    genNextBtn(false);

    saveMatrix();
    createNewMatrix();
    tableBodyGen();
})

function genNextBtn(firstRender)
{
    const btn = document.createElement("button");
    numSheets++;
    if(!firstRender)
    {
      prevSheet =currentSheet;
      currentSheet = numSheets;
      const prevBtn = document.getElementById(`sheet-${prevSheet}`);
      prevBtn.className = '';
    }

    btn.innerText = `Sheet ${numSheets}`;
    btn.id = `sheet-${numSheets}`;
    btn.setAttribute('onclick','viewSheet(event)');
   
    btn.className = 'active';
    
    addSheetBtn.parentNode.insertBefore(btn,addSheetBtn);
}

function saveMatrix(){
  if(localStorage.getItem(arrMatrix)){
      let tempMatrixArr = JSON.parse(localStorage.getItem(arrMatrix));
      tempMatrixArr.push(matrix);
      localStorage.setItem(arrMatrix,JSON.stringify(tempMatrixArr));
  }
  else{
      let tempMatrixArr = [matrix];
      localStorage.setItem(arrMatrix,JSON.stringify(tempMatrixArr));
  }
}

function viewSheet(event){
  prevSheet = currentSheet;
  const prevBtn = document.getElementById(`sheet-${prevSheet}`);
  prevBtn.className = '';
  currentSheet = event.target.id.split('-')[1];
  const currBtn = document.getElementById(`sheet-${currentSheet}`);
  currBtn.className = 'active';
  let matrixArr = JSON.parse(localStorage.getItem(arrMatrix));
  matrixArr[prevSheet-1] = matrix;
  localStorage.setItem(arrMatrix,JSON.stringify(matrixArr));
  matrix = matrixArr[currentSheet-1];
  tableBodyGen();
  renderMatrix();
}


function renderMatrix(){
  matrix.forEach(row=>{
     row.forEach(cellObj=>{
       if(cellObj.id){
        let curCell = document.getElementById(cellObj.id);
        console.log(curCell);
        curCell.innerText = cellObj.text;
        curCell.style.cssText = cellObj.style;
       }
     })
  })
}

function downloadMatrix(){
  const matrixString = JSON.stringify(matrix);
  // memory out of my matrixString
  const blob = new Blob([matrixString], { type: 'application/json' });

  // i have my memory which is formed out of matrixString;
  const link = document.createElement('a');
  // convert my blob to link href (URL)
  link.href = URL.createObjectURL(blob);
  link.download='table.json';
  // matrix->stringify->blob->URL
  link.click();
}

upload.addEventListener('input',uploadMatrix);
function uploadMatrix(event) {
  const file = event.target.files[0];
  if(file){
      const reader = new FileReader();
      reader.readAsText(file); // this is the trigger
      // this reader should convert my blob into js code
      reader.onload = function(event){
          const fileContent = JSON.parse(event.target.result);
          matrix=fileContent;
          renderMatrix();
      }
      // reader is inbuild instance of my FileReaderClass
  }
}