
/**
 * INVEST MAOOE - BACKEND DEFINITIVO
 * Este código deve estar no arquivo 'Code.gs'
 */

function doGet(e) {
  if (e.parameter.api) {
    return handleGetData();
  }

  try {
    return HtmlService.createTemplateFromFile('google_redirect')
      .evaluate()
      .setTitle('MAOOE | Conexão Segura')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput(
      "<html><body style='background:#050505;color:white;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;'>" +
      "<h2 style='color:#6366f1;'>ERRO: Arquivo HTML não encontrado</h2>" +
      "<p>Renomeie o arquivo HTML para <b>google_redirect</b> e faça uma nova implantação.</p>" +
      "</body></html>"
    );
  }
}

function doPost(e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "JSON Inválido" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (payload.action === "sync_all") {
    setupSheets();
    const data = payload.data;
    if (data.accounts) updateSheet(spreadsheet.getSheetByName("Contas"), data.accounts);
    if (data.incomes) updateSheet(spreadsheet.getSheetByName("Receitas"), data.incomes);
    if (data.notes) updateSheet(spreadsheet.getSheetByName("Sinais"), data.notes);
    if (data.appointments) updateSheet(spreadsheet.getSheetByName("Agenda"), data.appointments);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleGetData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  setupSheets();
  const data = {
    accounts: getSheetData(spreadsheet.getSheetByName("Contas")),
    incomes: getSheetData(spreadsheet.getSheetByName("Receitas")),
    notes: getSheetData(spreadsheet.getSheetByName("Sinais")),
    appointments: getSheetData(spreadsheet.getSheetByName("Agenda"))
  };
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheet) {
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      let val = row[i];
      try { if (typeof val === "string" && (val.startsWith("[") || val.startsWith("{"))) val = JSON.parse(val); } catch (e) {}
      obj[header] = val;
    });
    return obj;
  });
}

function updateSheet(sheet, data) {
  if (!sheet || !data || data.length === 0) return;
  sheet.clear();
  const headers = Object.keys(data[0]);
  sheet.appendRow(headers);
  const rows = data.map(item => headers.map(h => (typeof item[h] === "object") ? JSON.stringify(item[h]) : item[h]));
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ["Contas", "Receitas", "Sinais", "Agenda"].forEach(n => {
    if (!ss.getSheetByName(n)) ss.insertSheet(n);
  });
}
