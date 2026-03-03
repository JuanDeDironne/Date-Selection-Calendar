// Configuration
const ds_cal_startClass     = "ds-cal-";
const ds_cal_separator      = "-";
const ds_cal_monthNameList  = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin','Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const ds_cal_dayNameList    = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const ds_cal_offsetUnder    = 5;
const ds_cal_imgNavigPrev   = "<svg class=\"ds-cal-btn-navigation-svg\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 17 17\"><g></g><path d=\"M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z\"></path></svg>";
const ds_cal_imgNavigNext   = "<svg class=\"ds-cal-btn-navigation-svg\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 17 17\"><g></g><path d=\"M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z\"></path></svg>";

// Global Variables
var ds_cal_classInput     = "ds-cal-input-date";
var ds_cal_elem           = null;
var ds_cal_objDateElem    = null;
var ds_cal_monthCal       = 0;
var ds_cal_yearCal        = 0;
var ds_cal_calendar       = null; // Div
var ds_cal_header         = null; // Div
var ds_cal_container      = null; // Div


//-------------------------------//
// Fonction ds_cal_getPosition() //
//-------------------------------//
function ds_cal_getPosition(elem,type)
{
  var response = "";

  if(type=="left")
  {
    response = elem.offsetLeft;
    elem = elem.offsetParent

    while(elem)
    {
      response += elem.offsetLeft;
      elem  = elem.offsetParent;
    }
  }

  if(type=="top")
  {
    response = elem.offsetTop;
    elem    = elem.offsetParent

    while(elem)
    {
      response += elem.offsetTop;
      elem     = elem.offsetParent;
    }
  }

  return response;
}

//--------------------------------//
// Fonction ds_cal_setPosition()  //
//--------------------------------//
function ds_cal_setPosition()
{
  // Getting Positions
  const ds_cal_posTop   = ds_cal_getPosition(ds_cal_elem,"top");
  const ds_cal_posLeft  = ds_cal_getPosition(ds_cal_elem,"left");
  const ds_cal_height   = ds_cal_elem.offsetHeight;

  // Set Positions Calendar
  ds_cal_calendar.style.top  = (ds_cal_posTop+ds_cal_height+ds_cal_offsetUnder)+"px";
  ds_cal_calendar.style.left = ds_cal_posLeft+"px";
}


//----------------------------------//
// Fonction ds_cal_getDateObject()  //
//----------------------------------//
function ds_cal_getDateObject(elem=null)
{
  var response = new Date();

  // If Element Given
  if(elem!=null)
  {
    // If Date Pre-filled
    if(elem.value!="")
    {
      // Decomposition
      var wordList = elem.value.split(ds_cal_separator);

      // Si Format Date Correcte
      if(wordList.length==3)
      {
        // Getting Day Month Year
        day   = wordList[0];
        month = wordList[1];
        year  = wordList[2];

        // Création Element Date
        var objectControleDate = new Date(year+ds_cal_separator+month+ds_cal_separator+day);

        // Si Objet Date Correcte
        if(!isNaN(objectControleDate))
        {
          // Détermination Date
          response = new Date(year,month-1,day);
        }
      }
      // End - Si Format Date Correcte
    }
    // End - If Date Pre-filled
  }
  // End - If Element Given

  return response;
}

//--------------------------------------//
// Fonction ds_cal_getNumberDayMonth()  //
//--------------------------------------//
function ds_cal_getNumberDayMonth(month,year)
{
  var nbDayFeb  = (year%4)?28:29;
  var monthList = new Array(31,nbDayFeb,31,30,31,30,31,31,30,31,30,31);

  return monthList[month];
}

//------------------------------------//
// Fonction ds_cal_changerMonthYear() //
//------------------------------------//
function ds_cal_changerMonthYear(entityChange,typeChange)
{
  var title = document.querySelector(".ds-cal-header-title");

  // If Change Month
  if(entityChange=="month")
  {
    // If Previous Month
    if(typeChange=="prev")
    {
      // Si Janvier
      if(ds_cal_monthCal==0)
      {
        ds_cal_monthCal  = 11;
        ds_cal_yearCal = ds_cal_yearCal-1;
      }
      else ds_cal_monthCal = ds_cal_monthCal-1;
    }
    // End - If Previous Month

    // If Next Month
    if(typeChange=="next")
    {
      // Si Décembre
      if(ds_cal_monthCal==11)
      {
        ds_cal_monthCal  = 0;
        ds_cal_yearCal = ds_cal_yearCal+1;
      }
      else ds_cal_monthCal = ds_cal_monthCal+1;
    }
    // End - If Next Month    
  }
  // End - If Change Month


  // If Change Year
  if(entityChange=="year")
  {
    // Depending Change
    if(typeChange=="prev")  ds_cal_yearCal = ds_cal_yearCal-1;
    else ds_cal_yearCal = ds_cal_yearCal+1;
  }
  // End - If Change Year


  // Update Header Title
  title.innerHTML = ds_cal_monthNameList[ds_cal_monthCal]+" "+ds_cal_yearCal;

  // Filling Day List
  ds_cal_fillDayList();
}

//--------------------------------//
// Fonction ds_cal_fillDayList()  //
//--------------------------------//
function ds_cal_fillDayList()
{
  // Getting Objet Date
  var objDate        = new Date(ds_cal_yearCal,ds_cal_monthCal,1);
  var objDateCurrent = new Date();

  // Getting Number of Days in Month
  var nbDayMonth = ds_cal_getNumberDayMonth(ds_cal_monthCal,ds_cal_yearCal);

  // Determining the Number of Empty Cells at the Start
  var nbCelStartEmpty = (objDate.getDay()==0)?6:(objDate.getDay()-1);

  // Determining the Number of Lines
  var nbLine = Math.ceil((nbDayMonth+nbCelStartEmpty)/7);

  // Determining Empty Cell Name End
  var nbCelEndEmpty = (nbLine*7)-nbCelStartEmpty-nbDayMonth;

  // Initialization
  ds_cal_container.innerHTML = "";

  // Filling Name Day
  for(i=1;i<ds_cal_dayNameList.length;i++){ ds_cal_container.innerHTML += "<div class=\"ds-cal-name-day\">"+ds_cal_dayNameList[i]+"</div>"; }
  ds_cal_container.innerHTML += "<div class=\"ds-cal-name-day\">"+ds_cal_dayNameList[0]+"</div>";
  
  // Filling Empty Cell Start
  for(i=0;i<nbCelStartEmpty;i++){ ds_cal_container.innerHTML += "<div class=\"ds-cal-cel-empty\">&nbsp;</div>"; }

  // Filling Cell Number Day
  for(i=1;i<=nbDayMonth;i++)
  {
    // Initialization
    let classComplemCel = "";

    // Current Day Detection
    if(i==objDateCurrent.getDate() && ds_cal_monthCal==objDateCurrent.getMonth() && ds_cal_yearCal==objDateCurrent.getFullYear())  classComplemCel = " ds-cal-cel-current";

    // Selected Day Detection
    if(ds_cal_elem.value!="" && i==ds_cal_objDateElem.getDate() && ds_cal_monthCal==ds_cal_objDateElem.getMonth() && ds_cal_yearCal==ds_cal_objDateElem.getFullYear())  classComplemCel = " ds-cal-cel-sel";

    // Filling
    ds_cal_container.innerHTML += "<div class=\"ds-cal-cel-day"+classComplemCel+"\" data-num-day=\""+i+"\">"+i+"</div>";
  }

  // Filling Empty Cell End
  for(i=0;i<nbCelEndEmpty;i++){ ds_cal_container.innerHTML += "<div class=\"ds-cal-cel-empty\">&nbsp;</div>"; }

  // Get Cell Day List
  ds_cal_calendarCelDayList = document.querySelectorAll(".ds-cal-cel-day");
  
  // Add Event For Each Cell Day
  ds_cal_calendarCelDayList.forEach(function(celDay){ celDay.addEventListener("click",ds_cal_fillInputDate); });
}

//----------------------------------//
// Fonction ds_cal_fillInputDate()  //
//----------------------------------//
function ds_cal_fillInputDate(evt)
{
  // Date Construction
  var date = evt.target.dataset.numDay.padStart(2,"0")+ds_cal_separator+(ds_cal_monthCal+1).toString().padStart(2,"0")+ds_cal_separator+ds_cal_yearCal;

  // Placement in text input
  ds_cal_elem.value = date;

  // Masking Calendar
  ds_cal_hide();
}

//------------------------------//
// Fonction ds_cal_addHeader()  //
//------------------------------//
function ds_cal_addHeader()
{
  // Create Header Div
  ds_cal_header = document.createElement("div");

  // ID and Class Assignment
  ds_cal_header.setAttribute("id","dsCalHeader");
  ds_cal_header.className  = "ds-cal-header";

  // Filling Header - Previous Navigation
  ds_cal_header.innerHTML  = "<div class=\"ds-cal-btn-navigation\" id=\"dsCalBtnPreviousYear\" title=\"Previous Year\">"+ds_cal_imgNavigPrev+"</div>";
  ds_cal_header.innerHTML += "<div class=\"ds-cal-btn-navigation\" id=\"dsCalBtnPreviousMonth\" title=\"Previous Month\">"+ds_cal_imgNavigPrev+"</div>";

  // Filling Header - Title
  ds_cal_header.innerHTML += "<div class=\"ds-cal-header-title\">"+ds_cal_monthNameList[ds_cal_monthCal]+" "+ds_cal_yearCal+"</div>";

  // Filling Header - Next Navigation
  ds_cal_header.innerHTML += "<div class=\"ds-cal-btn-navigation\" id=\"dsCalBtnNextMonth\" title=\"Next Month\">"+ds_cal_imgNavigNext+"</div>";
  ds_cal_header.innerHTML += "<div class=\"ds-cal-btn-navigation\" id=\"dsCalBtnNextYear\" title=\"Next Year\">"+ds_cal_imgNavigNext+"</div>";
  

  // Add Header
  ds_cal_calendar.appendChild(ds_cal_header);

  // Listener Creation
  ds_cal_btnPreviousYear = document.getElementById("dsCalBtnPreviousYear");
  ds_cal_btnPreviousYear.addEventListener("click",function(){ ds_cal_changerMonthYear('year','prev'); });

  // Listener Creation
  ds_cal_btnNextYear = document.getElementById("dsCalBtnNextYear");
  ds_cal_btnNextYear.addEventListener("click",function(){ ds_cal_changerMonthYear('year','next'); });

  // Listener Creation
  ds_cal_btnPreviousMonth = document.getElementById("dsCalBtnPreviousMonth");
  ds_cal_btnPreviousMonth.addEventListener("click",function(){ ds_cal_changerMonthYear('month','prev'); });

  // Listener Creation
  ds_cal_btnNextMonth = document.getElementById("dsCalBtnNextMonth");
  ds_cal_btnNextMonth.addEventListener("click",function(){ ds_cal_changerMonthYear('month','next'); });
}


//---------------------------------//
// Fonction ds_cal_addContent()    //
//---------------------------------//
function ds_cal_addContent(objetDate)
{
  // Day List DIV Creation
  ds_cal_container = document.createElement("div");

  // ID and Class Assignment
  ds_cal_container.setAttribute("id","dsCalContenu");
  ds_cal_container.className  = "ds-cal-container";

  // Add Day List
  ds_cal_calendar.appendChild(ds_cal_container);

  ds_cal_fillDayList();
}


//-------------------------------------//
// Fonction ds_cal_detectOutCalendar() //
//-------------------------------------//
function ds_cal_detectOutCalendar(evt)
{
  var nbClassCal = 0;

  // Detection if Target Class Belongs to the Calendar
  evt.target.classList.forEach(function(currentClass){  if(currentClass.startsWith(ds_cal_startClass)) nbClassCal++; });

  // If the Target Class does NOT belong to the Calendar (this is possible if you click on the SVG's Path)
  if(nbClassCal==0)
  {
    // Detection if Target Class Parent Belongs to Calendar
    evt.target.parentNode.classList.forEach(function(currentClass){  if(currentClass.startsWith(ds_cal_startClass)) nbClassCal++; });

    // If Target Parent Does NOT Belong to the Calendar
    if(nbClassCal==0)  ds_cal_hide();
  }
}

//----------------------------//
// Fonction ds_cal_display()  //
//----------------------------//
function ds_cal_display(elem)
{
  // Add Listener on BODY
  document.body.addEventListener("mousedown",ds_cal_detectOutCalendar);

  // Memorization
  ds_cal_elem = elem;

  // Getting Objet Dates
  ds_cal_objDateElem = ds_cal_getDateObject(elem);

  // Memorization
  ds_cal_monthCal = ds_cal_objDateElem.getMonth();
  ds_cal_yearCal  = ds_cal_objDateElem.getFullYear();

  // Calendar DIV Creation and Memorization
  ds_cal_calendar = document.createElement("div");
 
  // ID and Class Assignment
  ds_cal_calendar.setAttribute("id","dsCalGlobal");
  ds_cal_calendar.className  = "ds-cal-global";
 
  // Add DIV in Body
  document.getElementsByTagName("body")[0].appendChild(ds_cal_calendar);

  // Add Header
  ds_cal_addHeader();

  // Add Days List
  ds_cal_addContent(ds_cal_objDateElem);

  // Set Calendar Position
  ds_cal_setPosition();
}

//-------------------------//
// Fonction ds_cal_hide()  //
//-------------------------//
function ds_cal_hide()
{
  // Remove Listener on BODY
  document.body.removeEventListener("mousedown",ds_cal_detectOutCalendar);

  // Remove DIV in Body
  document.getElementsByTagName("body")[0].removeChild(ds_cal_calendar);

  // Re-Initialization
  ds_cal_elem     = null;
  ds_cal_calendar = null;
}

//---------------------------//
// Fonction ds_cal_manage()  //
//---------------------------//
function ds_cal_manage(evt)
{
  // Getting Element
  var elem = evt.target;

  // Getting ID Element with Displayed Calendar
  var idElemDisp = (ds_cal_elem!=null)?ds_cal_elem.id:"";

  // If Calendar Already Displayed
  if(idElemDisp!="")
  {
    // Remove
    ds_cal_hide();
    
    // If Calendar Already Visible on Another Element Than the One Clicked
    if(elem.id!=idElemDisp) ds_cal_display(elem);
  }
  // End - If Calendar Already Displayed
  else ds_cal_display(elem);

}

//-----------------------//
// Fonction ds_cal_use() //
//-----------------------//
function ds_cal_use()
{
  // Obtaining the list of each input date with possible calendar selection
  const ds_cal_inputList = document.querySelectorAll("."+ds_cal_classInput);

  // Add Event For Each Input
  ds_cal_inputList.forEach(function(input){ input.addEventListener("click", ds_cal_manage); });  
}