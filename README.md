# MaximusTesteCorreto
 
Boa tarde a todos.
Para a utilização desse código devemos focar no uso de duas partes principais. devemos iniciar a api do c# juntamente com o frontend desenvolvido em react.

Uma consideração importante é que o banco de dados conectado ao código se encontra no localhost porta 5432 database postgres com senha zanini, caso isso se diferencie do seu banco local será necessário fazer estas configurações primarias no appsettings.json

após isso devemos rodar o script para adicionar o schema com todas as tarefas no nosso banco de dados. Com essas considerações feitas é possível darmos início ao uso do código.

## Tela de Login

A primeira tela apresenta representa quatro botões que permitem o usuário escolher sua ação, no caso adicionar, editar, excluir ou visualizar os clientes.

## Adicionar os clientes
Para adicionar um cliente novo é requisitado que o usuário informe o nome completo, data de nascimento, cpf e email do usuario.
Não será permitido a requisição de adicionar um novo usuário sem os campos de email, data de nascimento e CPF.
Com o envio nosso código em C# irá verificar se o CPF informado é valido, caso seja ele irá fazer uma requisição ao banco de dados que verificara se já existe algum cpf ou email igual ao informado já cadastrado. Em caso positivo irá retornar um aviso que não é possível realizar o cadastro e caso positivo irá ser informado que o cadastro é realizado

## Editar Clientes e Excluir
Para editar os clientes, em um primeiro momento é requisitado que o usuário informe o cpf do usuario apresentado. Caso seja um cpf que se consta no banco de dados é possibilitado que o usuario faça as alterações que desejar. Isso vale para exclusão também.
Ao excluir um usuário ou finalizar a venda não excluímos de verdade apenas modificamos seu status de inativo e de pago respectivamente. Dessa forma fica possível seguir fazendo buscas e trabalhando com os dados que já foram apresentados até então. Também não é possível excluir clientes que ainda possuem dívidas ativas.

## Verificar os clientes
Neste campo é possível fazer a verificação de todos os clientes que estão ativos, com a soma dos valores de suas dívidas e sua idade. Ao fim da lista é possível verificar o total de todas as dívidas.
Em cada um dos clientes aparece um botão que permite verificar as dívidas especificas de cada usuário.

## Verificar Dívidas
Neste campo são verificadas as dívidas do cliente selecionado pelo usuário. Aqui é possível não apenas verificar as dívidas, mas também selecionar as que foram realizadas o pagamento. Com o pagamento realizado o preço total das dívidas selecionadas é subtraído do cliente e as dívidas são marcadas como em aberto.
Por fim nessa tela se encontra o botão que permite adicionar uma nova dívida ao cliente.

## Criar dívida
Para se criar a dívida o usuário deve informar o valor da mesma e de alguma descrição sobre o que significa a dívida (Você verá que esta parte é um JSON no banco pois para trabalhos futuros seria interessante uma implementação da escolha de itens unidades e preço individual de cada produto nessa descrição, permitindo também um melhor controle do fluxo das mercadorias).
Com isso a dívida é adicionada, porém o sistema não permite que se adicionem dívidas que façam o cliente ficar com um valor superior a 200 reais em dívidas.
