// data.js
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTZ15FUg6uEgOUsIumdUL5Fc6N-bAgdVBgjNT4aMmQqOZlwL7c4Uwy_a5_XrfW-0RysVBN-vAcIRol/pub?output=csv'; 

export async function ambilDataProduk() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    return csvToJson(text);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

function csvToJson(csvText) {
  const lines = csvText.split("\n");
  const result = [];
  const headers = lines[0].split(",").map(h => h.trim().replace(/\r/g, ""));

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const obj = {};
    const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    for (let j = 0; j < headers.length; j++) {
      let val = currentline[j] || "";
      val = val.trim().replace(/\r/g, "");
      if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
      obj[headers[j]] = val;
    }
    result.push(obj);
  }
  return result;
}