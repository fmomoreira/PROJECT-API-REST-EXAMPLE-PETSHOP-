const moment = require("moment");
const conexao = require("../infraestrutura/conexao");

class Atendimento {
  adiciona(atendimento, res) {
    const dataCriacao = moment().format("YYYY-MM-DD HH:mm:ss");
    const data = moment(atendimento.data, "DD/MM/YYYY HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    const dataEhValido = moment(data).isSameOrAfter(dataCriacao);
    const clienteEhValido = atendimento.cliente.length >= 5;

    const validacoes = [
      {
        nome: "data",
        valido: dataEhValido,
        menssagem: "Data deve ser maior ou igual a data atual",
      },
      {
        nome: "cliente",
        valido: clienteEhValido,
        menssagem: "Cliente deve ter pelomenos cinco caracteres",
      },
    ];

    const errors = validacoes.filter((campo) => !campo.valido);
    const existemErros = errors.length;

    if (existemErros) {
      res.status(400).json(errors);
    } else {
      const atendimentoDatado = { ...atendimento, dataCriacao, data };
      const sql = "INSERT INTO Atendimentos SET ?";

      conexao.query(sql, atendimentoDatado, (erro, resultados) => {
        if (erro) {
          res.status(400).json(erro);
        }
        res.status(201).json(atendimentoDatado);
      });
    }
  }

  lista(res){
    const sql = 'SELECT * FROM Atendimentos'

    conexao.query(sql, (error, resultados)=> {

      if(error){
        res.status(400).json(error)
      }

        res.status(200).json(resultados)

    })
  }

  buscaPorId(id, res){

    const sql = `SELECT * FROM Atendimentos WHERE id =${id}`
    conexao.query(sql, (error, resultado) => {
      const resultados = resultado[0]
      if (error){
        res.status(400).json(error)
      } 

      res.status(200).json(resultados)
    })

  }

  altera(id, valores, res){

    if(valores.data){
      valores.data =  moment(valores.data, "DD/MM/YYYY HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
    const sql = `UPDATE Atendimentos SET ? WHERE ID=?`
    conexao.query(sql, [valores, id], (error, resultados) =>{
        if(error){
          res.status(400).json(error)
        }
        res.status(200).json({...valores, id})
    })

  }

  deleta(id, res) {
    const sql = 'DELETE FROM Atendimentos  WHERE id=?'

    conexao.query(sql, id, (error, resultado) =>{
      if(error){
        res.status(400).json(error)
      }

      res.status(200).json({id})
    })

  }
}

module.exports = new Atendimento();
