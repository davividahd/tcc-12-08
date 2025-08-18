const express = require('express');
const app = express(); // <--- Esta linha estava faltando
//candidato
const { buscarClientes } = require('./src/DAO/cliente/buscarClientes.js');
const { inserirCandidato } = require('./src/DAO/cliente/addUsuario.js');
const {deletarUsuario} = require('./src/DAO/cliente/deliteCliente');
const { editarCliente } = require('./src/DAO/cliente/editarCliente.js');
//empresa
const { inserirEmpresa } = require('./src/DAO/Empresa/addEmpresa.js');
const {buscarEmpresa} = require('./src/DAO/Empresa/buscarEmpresa.js');
const {editarEmpresa} = require ('./src/DAO/Empresa/editarEmpresa.js')
const {deletarEmpresa} = require('./src/DAO/Empresa/deletEmpresa.js')


const { conexao, closeConexao, testarConexao } = require('./src/DAO/conexao');

// Middleware necessário para usar req.body com JSON
app.use(express.json());

app.get('/tcc/v1', (req, res) => {
    res.json({ msg: "Aplicação Funcionando tcc" });
});

app.get('/tcc/busca', async (req, res) => {
    let candidato = await buscarClientes();
    res.json(candidato);
});
//add cliente

app.post('/tcc/add_usuario', async (req, res) => {
    try {
        const { codigo, cpf, telefone, nome_completo, email, limite, id_endereco, id_status } = req.body;

        // Validação: verificar se todos os campos estão presentes
        if (
            codigo == null || !cpf || !nome_completo || !telefone || 
            !email || limite == null || id_endereco == null || id_status == null
        ) {
            return res.status(400).json({
                mensagem: "Dados incompletos: todos os campos são obrigatórios."
            });
        }

        // Inserir no banco
        const resultado = await inserirCandidato(
            codigo, cpf, telefone, nome_completo, email, limite, id_endereco, id_status
        );

        if (resultado.sucesso) {
            return res.status(201).json({
                mensagem: "Cliente inserido com sucesso",
                id: resultado.idInserido
            });
        } else {
            return res.status(500).json({
                mensagem: "Erro ao inserir cliente",
                erro: resultado.erro
            });
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro inesperado",
            erro: error.message
        });
    }
});




//delitpopopopopopop

app.delete('/tcc/deletar_usuario', async (req, res) =>{
    let { codigo } = req.body
    let result = await deletarUsuario(codigo)
    res.json(result)
});



//editar

app.patch('/empresa_produtos_limpeza/v4/cliente', async (req, res) =>{
    let {codigo, campo, valor } = req.body
    let resultado = await editarCliente(codigo, campo, valor)
    res.status(200).json(resultado)
    
})



const porta = 3000;

app.listen(porta, () => {
    console.log("Operando na porta " + porta);
    testarConexao();
});

//Epresa1234567890

// addEmpresa

app.post('/tcc/add_empresa', async (req, res) => {
    try {
        const { id, nome, cnpj, cidade, estado } = req.body;

        // Validação: verificar se todos os campos estão presentes
        if (
            id == null || !nome == null  || !cnpj == null  || !cidade == null  || 
            !estado == null 
        ) {
            return res.status(400).json({
                mensagem: "Dados incompletos: todos os campos são obrigatórios."
            });
        }

        // Inserir no banco
        const resultado = await inserirEmpresa(
            id, nome, cnpj, cidade, estado
        );

        if (resultado.sucesso) {
            return res.status(201).json({
                mensagem: "Empresa inserida com sucesso",
                id: resultado.idInserido
            });
        } else {
            return res.status(500).json({
                mensagem: "Erro ao inserir Empresa",
                erro: resultado.erro
            });
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro inesperado",
            erro: error.message
        });
    }
});

//buscar Empresa

app.get('/tcc/buscar_Empresas', async (req, res) => {
    let Empresa = await buscarEmpresa();
    res.json(Empresa);
});

app.patch('/tcc/editar_Empresas', async (req, res) =>{
    let {codigo, campo, valor } = req.body
    let resultado = await editarEmpresa(codigo, campo, valor)
    res.status(200).json(resultado)
    
})

//deletar empresa
app.delete('/tcc/deletar_empresa', async (req, res) =>{
    let {id} = req.params
    let result = await deletarEmpresa(id)
    res.json(result)
});





