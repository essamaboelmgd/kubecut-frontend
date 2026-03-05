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
        body { font-family: Arial, sans-serif; direction: rtl; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; text-align: center; }
        th, td { border: 1px solid black; padding: 5px; }
        th { background-color: #f3f4f6; }
        .text-xl { font-size: 20px; font-weight: bold; }
        .text-sm { font-size: 14px; }
        h2 { margin-bottom: 5px; }
        .flex { display: flex; justify-content: space-between; align-items: flex-end; }
        .border-b-2 { border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 15px; }
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
