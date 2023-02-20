import express from "express"; // importando o express
import { v4 as uuidv4 } from "uuid";

const app = express(); // O express é uma function que retorna um objeto cheio de metodos,
//estou guardando essas functions nessa variavel "app"

app.use(express.json()); // config pro server aceitar JSON

app.listen("4001", () => {
  console.log("server up and running at port 4001");
}); //esse metodo vai me dizer a porta que vai ficar de olho quando chega a
//request, o segundo argumento é uma callback que vai me informar se a conexao teve sucesso ou nao

let data = []; //array pora guardar as info desejadas, ela precisa ser declarada com let pois sera manipulada pelo cliente

// primeira rota GET
//Quando o cliente der um GET na rota: "http://localhost:4000/welcome"
app.get("/welcome", (req, res) => {
  //essa callback recebe dois parâmetros:
  // req = request -> as informações que estão vindo do cliente
  // req = response -> é a resposta que o servidor serve para o cliente
  return res.status(200).json("Bem vindo!");
  //estamos retornando uma resposta com o status de 200 e um json "Bem Vindo"
});

// CRUD COMPLETO

//POST
app.post("/", (req, res) => {
  //req.body é onde esta toda a info que o cliente enviou para minha api
  // ex: {
  //    "name": "Paulo",
  //	"age": 24,
  //	"city": "Indaiatuba"
  //      }
  //então :
  // vou copiar tudo o que o cliente enviou, colocar num objeto, adicionar o ID
  let entry = { ...req.body, id: uuidv4() };
  // e em seguida colocar esses dados dentro da minha array data criada la no inicio
  data.push(entry);
  // agora eu retorno uma resposta com status 201 "Created" com um JSON do que foi criado
  return res.status(201).json(entry);
});

//GET
app.get("/", (req, res) => {
  return res.status(200).json(data);
  //toda vez que o cliente der um get no meu api, ele vai retornar uma resposta com
  //status 200 "OK" e o JSON com o array data que contem os dados do meu api
});

//GET apenas uma entrada

app.get("/:id", (req, res) => {
  //req.params é um objeto e por isso estamos desestruturando o obj.
  let { id } = req.params;

  //achar o objeto que tem o mesmo id que foi passado como parametro.
  let user = data.find((user) => user.id === id);
  //retorna a resposta com o status 200 "ok" e com o objeto encontrado dentro do array data.
  return res.status(200).json(user);
});

//DELETE
app.delete("/:id", (req, res) => {
  let { id } = req.params;
  // o metodo filter retornar um array dentro da condition
  // estou retornando um array com itens cujo qual o id é diferente do que eu desejo deletar
  let filtered = data.filter((user) => user.id !== id);

  // agora o array data vai ser a array filtrada, que esta sem o user desejado
  data = filtered;

  //retorna uma response com o status de 200 "ok" e o json com a array atualizada
  return res.status(200).json(data);
});

//EDIT - PUT

app.put("/:id", (req, res) => {
  //captura o id do usuario
  let { id } = req.params;
  //inicia a varaivel vazia que vai guardar o index que o usuario tem dentro da array data
  let index;
  // encontra o usuario dentro da array
  let user = data.find((user, i) => {
    //guarda o index que o usuartio vai ser encontrado
    index = i;
    //condicional que vai encontrar o usuário
    // se o usuário tiver o mesmo id
    return user.id === id;
  });
  //atualiza o objeto do usuario com as info que vieram do req.body
  let updatedUser = { ...user, ...req.body };

  //acessando a array no index que o user está
  // vamos trocar o objeto que exista la pelo objeto atualizado

  data[index] = updatedUser;
});
