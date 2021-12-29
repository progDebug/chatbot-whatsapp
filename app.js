const express = require('express')
const fs = require('fs')
const open = require('open')

const app = express()

// Abrir o aplicativo 

open('http://localhost:3000')


// Configuração do express

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./public'))

// Rotas 

app.get('/', (req, res) =>{
    res.render('index')
})

// Definindo as variaves globais

app.post('/pegar-dados', function (req,res) {
    var contatos = req.body.contatos
    var mensagem = req.body.mensagem
    var midia = req.body.arquivo
    const config = ({
        TELEFONE:{
            NUMBER:contatos
        },
        WHATSAPP:{
            POST_URL: 'https://web.whatsapp.com/',
            TEXT: mensagem,
            DOCUMENT: midia
        }
    })
    module.exports = config
    res.send('Iniciando...')
    var code = 0
    // Abrir a outra parte do programa
    const dados = (config)
    // Criando os dados qe serão escritos no arquivo temporario
    // Escrevendo os dados no arquivo temporario
    if (dados != ''){
        fs.writeFileSync('./dados.json', JSON.stringify(dados), 'utf-8', (error, result)=>{
            if (error) {
                console.log('Erro')
            }
        })
    }
    const shell = require('shelljs')
    shell.cd('src')
    shell.exec('node chat.js')
    process.exit(code)
})

// Iniciando o Servidor 

app.listen(3000, () => {
    console.log('Servidor rodando com express')
    console.log('Pressione CTRL + C para encerrar')
})

