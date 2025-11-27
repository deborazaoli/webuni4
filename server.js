const express = require('require');
const exphbs = require('express-handlebars');

const pessoa = require('./models/pessoa.model');
const db = require('./config/database');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app. engine( 'handlebars', exphbs. engine({ defaultLayout: false }));
app. set ('view engine', 'handlebars');

//let pessoas = [
 //{ id: 1, nome: "Pessoa 1"},
 //{ id: 2, nome: "Pessoa 2"},
 //{ id: 3, nome: "Pessoa 3"},
//]

app.get('/', (req, res) => res.render('home'));

   app.get('/pessoas', async (req, res) => {
    try {
        let pessoas = await pessoa.findAll({raw: true});
        res.render('listar Pessoas', {pessoas});
    } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
        res.status(500).send('Erro ao buscar pessoas')
    }
});

app.get('/pessoas/nova', (req, res) => res.render('cadastrarPessoa'));

app.post('/pessoas', async (req, res) => {
     try{
        await pessoa.create({
            nome: req.body.nome 
        });
     }
    res.redirect ('/pessoa')

}catch (error){
    console.error('Erro ao cadastrar pessoa:', pessoa)
    const novaPessoa = { id: pessoas.lenght + 1, nome};
    pessoas.push(novaPessoa);
    res.render('listarPessoas', { pessoas })
});

app.get('/pessoas/ver/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pessoa = pessoas.find(p => p.id === id);
    if (!pessoa) return res.status(404).send('Pessoa não encontrada');

    res.render('detalharPessoa', { pessoa });
});

app.get('/pessoas/:id/editar', (req, res) =>  {
    const id = parseInt(req.params.id);

    const pessoa = pessoas.find(p => p.id === id);

    if (pessoa) {
        res.render('editarPessoa', { pessoa });
    }else{
        return res.status(404).send('Pessoa não encontrada.');
    }
});

app.post('/pessoas/:id', (req, res) =>  {
    const id = parseInt(req.params.id);

    const pessoa = pessoas.find(p => p.id === id);

    if (pessoa) {
        pessoa.nome = req.body.nome;
        res.render('listarPessoas', { pessoas });
    }else{
        return res.status(404).send('Pessoa não encontrada.');
    }
})

app.post('/pessoas/excluir/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pessoas.findIndex(p => p.id === id);

    if (index === -1) return res.status(404).send('Pessoa não encontrada');

    pessoas.splice(index, 1);
    res.redirect('/pessoas');
})

app.listen(port, () => {
    console.log('Servidor em execução: http://localhost:${port}')
});

db.sync({force: true}).then( ()=>{
    console.log('Banco de dados sincronizado.');
}).catch((e) => {
    console.error('Erro ao sincronizar o banco de dados');
});

