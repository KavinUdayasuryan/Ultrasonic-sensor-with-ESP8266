// Enter Spreadsheet ID here
var SS = SpreadsheetApp.openById('12Vy3tyACsD20UJV9QZFdM7ryYE4p1M0OOc7YF4sz8kI');
var str = "";


function doPost(e) {

  var parsedData;
  var result = {};
  
  try { 
    parsedData = JSON.parse(e.postData.contents);
  } 
  catch(f){
    return ContentService.createTextOutput("Error in parsing request body: " + f.message);
  }
   
  if (parsedData !== undefined){
    var flag = parsedData.format;
    if (flag === undefined){
      flag = 0;
    }
    
    var sheet = SS.getSheetByName(parsedData.sheet_name); // sheet name to publish data to is specified in Arduino code
    var dataArr = parsedData.values.split(","); // creates an array of the values to publish 
  
    var distance = dataArr [0];
    var percentage = dataArr [1];
    
    // read and execute command from the "payload_base" string specified in Arduino code
    switch (parsedData.command) {
      
      case "insert_row":
         
         sheet.insertRows(2); // insert full row directly below header text
         
         //var range = sheet.getRange("A2:D2");              // use this to insert cells just above the existing data instead of inserting an entire row
         //range.insertCells(SpreadsheetApp.Dimension.ROWS); // use this to insert cells just above the existing data instead of inserting an entire row
         
         sheet.getRange('A2').setValue(distance); // publish current date to cell A2
         sheet.getRange('B2').setValue(percentage); // publish current time to cell B2
         
         str = "Success"; // string to return back to Arduino serial console
         SpreadsheetApp.flush();
         break;
         
      case "append_row":
         
         var publish_array = new Array(); // create a new array
         
         publish_array [0] = distance; // add current date to position 0 in publish_array
         publish_array [1] = temperature; // add current time to position 1 in publish_array
         
         sheet.appendRow(publish_array); // publish data in publish_array after the last row of data in the sheet
         
         str = "Success"; // string to return back to Arduino serial console
         SpreadsheetApp.flush();
         break;     
 
    }
    return ContentService.createTextOutput(str);
  } // endif (parsedData !== undefined)
  
  else {
    return ContentService.createTextOutput("Error! Request body empty or in incorrect format.");
  }
}
