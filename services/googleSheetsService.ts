
/**
 * Serviço de Integração com Google Sheets (via Apps Script Web App)
 */

export const syncWithGoogleSheets = async (url: string, data: any) => {
  if (!url || !url.startsWith('http')) return null;

  try {
    // Usamos POST para enviar o volume de dados completo
    // mode: 'no-cors' é necessário pois o Apps Script redireciona e o navegador bloqueia o redirect em CORS padrão
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sync_all',
        data: data
      })
    });
    
    return { success: true };
  } catch (error) {
    console.error("Erro crítico na sincronização Sheets:", error);
    throw error;
  }
};
