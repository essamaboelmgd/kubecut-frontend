export const exportToWord = (elementId: string, filename = 'document.doc') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const preHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>Document</title>
      <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            direction: rtl; 
            color: #333333;
        }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin-bottom: 25px; 
            text-align: center; 
            font-size: 14pt;
        }
        th, td { 
            border: 1px solid #777777; 
            padding: 8px 10px; 
            vertical-align: middle;
        }
        th { 
            background-color: #e2e8f0; 
            font-weight: bold; 
            color: #1e293b;
        }
        h1 { font-size: 28pt; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 10px; text-align: center; margin-bottom: 20px;}
        h2 { font-size: 22pt; color: #1e293b; margin: 0 0 10px 0; }
        p { margin: 0; font-size: 14pt; line-height: 1.5; color: #475569; }
        .unit-header-table {
            border: 2px solid #cbd5e1;
            background-color: #f8fafc;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        .unit-header-table td { border: none !important; padding: 12px 15px; }
        .parts-table {
            border: 2px solid #94a3b8;
        }
        .parts-table th, .parts-table td {
            border: 1px solid #cbd5e1;
        }
        .parts-table thead th {
            background-color: #f1f5f9;
            border-bottom: 2px solid #94a3b8;
        }
      </style>
    </head>
    <body dir="rtl">
  `;
  const postHtml = "</body></html>";
  const html = preHtml + element.innerHTML + postHtml;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });

  const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  // Use Blob fallback for IE, otherwise use data URI to preserve structure
  if ((window as any).navigator?.msSaveOrOpenBlob) {
    (window as any).navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
  }

  document.body.removeChild(downloadLink);
};
