# FastFeet 
Para ter acesso ao  -> [*backend*](https://github.com/thaislsilveira/FastFeet)  

Para ter acesso ao -> [*frontend*](https://github.com/thaislsilveira/FastFeet-Frontend)  

Para ter acesso ao -> [*mobile*](https://github.com/thaislsilveira/FastFeet-Mobile)  


## Sobre o Backend
Backend desenvolvido em NodeJs, no treinamento GoStack, aplicado pela Rocketseat. Este desafio faz parte do projeto final do GoStack, desenvolvendo o FastFeet, uma transportadora fictícia.

### Instruções
Em caso de download do projeto você precisará baixar as dependências:  

**Necessário:** Yarn ou Npm, Git, Express, PostgreSQL, Mongo, Redis  e para integração com o banco de dados, o sequelize.

Durante o processo de desenvolvimento foi utilizado o Docker, utilizando os seguintes comandos:
 ```
 #instalar a imagem do Postgres
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

 #instalar a imagem do Mongo
 docker run --name mongofastfeet -p 27017:27017 -d -t mongo
 
#instalar a imagem do Redis 
docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine

```
- Comandos para execução dos serviços

```
#start Postgres
docker start database

#start Mongo
docker start mongofastfeet

#start Redis
docker start redisfastfeet

```
- Clonar o projeto e baixar as dependências:
```
# Clonando o respositório
git clone https://github.com/thaislsilveira/FastFeet.git


# Instalando as dependências
yarn

# rodar as migrations migrations
yarn sequelize db:migrate

# rodar as  seeds
yarn sequelize db:seed:all
```
 - Usuário **admin**

para utilização da aplicação como admin você pode utilizar o seguinte usuário:

```
email: admin@fastfeet.com
senha: 123456
```
-Executando o projeto
```
yarn dev
yarn queue
```
