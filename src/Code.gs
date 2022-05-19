async function createSpreadsheetinFolder(folder, sheetname) {
  let file = {
    title: sheetname,
    mimeType: MimeType.GOOGLE_SHEETS,
    parents: [{ id: folder.getId()}]
  }
  let r = Drive.Files.insert(file);
  let t = r.id;
  return DriveApp.getFileById(r.id);
}

async function createSheet(folderUrl) {
  let folder = DriveApp.getFolderById(folderUrl.replace(/^.+\//, ''));
  let folderName = folder.getName()
  let images = folder.searchFiles("mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/jpg'");
  let spreadsheetFile = await createSpreadsheetinFolder(folder, folderName + " Spreadsheet");
  let newSS = SpreadsheetApp.open(spreadsheetFile);
  let newSheet = newSS.getSheetByName("Sheet1").setName("Discs for Sale");
  let fileArray = []
  while(images.hasNext()) {
    let fileInfo = [];
    current = images.next();
    current.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    fileInfo = current.getName().split("-");
    fileInfo[3] = current.getUrl();
    fileArray.push(fileInfo);
  }
  newSheet.getRange(1,1).setValue("Description");
  newSheet.getRange(1,2).setValue("Condition");
  newSheet.getRange(1,3).setValue("Price");
  newSheet.getRange(1,4).setValue("Link");
  let range = newSheet.getRange(2,1,fileArray.length, 4);
  range.setValues(fileArray);
  spreadsheetFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return spreadsheetFile.getUrl();
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile("main");
}