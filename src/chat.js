const puppeteer = require('puppeteer')
const config = require('../dados.json')

// Alterando as variaveis recebidas (Tratamento de Dados)
var contatos = config.TELEFONE.NUMBER
contatos = contatos.split(',')
for (let index = 0; index < contatos.length; index++) {
  contatos[index] = '5562' + contatos[index];
}
var texto = config.WHATSAPP.TEXT.replace(/ /g, '%20')

const newConfig = ({
  TELEFONE:{
    NUMBER: contatos
  },
  WHATSAPP:{
    POST_URL: 'https://web.whatsapp.com/',
    TEXT: texto,
    DOCUMENT:config.WHATSAPP.DOCUMENT
  }
})
var numeroContatos = contatos.length
var ultimoElemento = numeroContatos - 1
var elementosArray = 0 
var browser = ''
async function entrarSite(vez) {
  if (vez == 0) {
    browser = await puppeteer.launch({headless:false});
  }
  const page = await browser.newPage()
  await page.goto(newConfig.WHATSAPP.POST_URL)
  // Tempo para carregar a página
  await page.waitForTimeout(2000)
  // Apertar no checkbox não ficar conectado
  // await page.click("input:checked")
  // Ele espera encontrar um elemento com xpath 
  await page.waitForXPath('//*[@id="app"]/div[1]/div[1]/div[4]/div/div/div[2]/div[1]')
  // Abre uma página com o telefone e mensagem pre definidas
  await page.goto('https://web.whatsapp.com/send?phone=' + contatos[vez] + '&text=' + newConfig.WHATSAPP.TEXT)
  // Pausa para carregar página
  try {
    await page.waitForXPath('//*[@id="main"]/footer/div[1]/div/span[2]/div/div[2]/div[1]')
    // Enviar mensagem que foi repassada pelo link
    await page.waitForTimeout(2000)
    await page.click('.p3_M1')
    await page.waitForTimeout(1000)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1000)
    await page.click("span[data-icon='clip']")
    await page.waitForTimeout(1000)
    // Enviar um arquivo
    try {
      const elementHandle = await page.$("input[type='file'");
      await elementHandle.uploadFile(newConfig.WHATSAPP.DOCUMENT);
      await page.click('#app > div._1ADa8._3Nsgw.app-wrapper-web.font-fix.os-win > div._1XkO3.two > div._3ArsE > div.ldL67._3sh5K > span > div._1N4rE > span > div:nth-child(1) > div > div.KPJpj._2M_x0 > div > div._1HI4Y > div._33pCO > div > div > span');
      await page.waitForTimeout(1000)
    } catch (error) { 
      await page.waitForTimeout(1000)
    }
    await page.waitForTimeout(1000)
    await page.close()
  } catch (error) {
    await page.click('#app > div._1ADa8._3Nsgw.app-wrapper-web.font-fix.os-win > span:nth-child(2) > div._209uk > span > div:nth-child(1) > div > div > div > div > div._2i3w0 > div > div > div')
  }
  if (vez == ultimoElemento) {
    browser.close()
  }
}
// Estrutura de repetição

async function repetir() {
  while (numeroContatos > 0) {
    await entrarSite(elementosArray)
    elementosArray += 1
    numeroContatos -= 1
  }
}
repetir()