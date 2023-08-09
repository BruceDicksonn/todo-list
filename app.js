const express = require('express');
const path = require('path');
const port = 3000;
const app = express();

require('./config/src/database'); // abre conexão com o banco

// concentrando rotas em um arquivo a parte e importando 
// para o index
const checklistRouter = require('./src/routes/checklist');
const taskRouter = require('./src/routes/task');
const rootRouter = require('./src/routes/index');

const methodOverride = require('method-override');


// indica ao express que nossos arquivos estaticos ficarão
// localizados na pasta public
app.use(express.static(path.join(__dirname, 'public')))


// devemos notificar o express em que diretório estão nossas views
// para que possamos carregá-las quando precisarmos.
app.set('views', path.join(__dirname, '/src/views'));
// devemos alterar a view engine padrão para a ejs que queremos trabalhar 
app.set('view engine', 'ejs')


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

app.use('/checklists', checklistRouter);
app.use('/checklists', taskRouter.checklistDependentRoute);

app.use('/tasks', taskRouter.individualRoute);

app.use('/', rootRouter);

app.listen(port, () => console.log(`Servidor ativo na porta ${port}`));