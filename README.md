# FastFeet 
Para ter acesso ao  -> [*backend*](https://github.com/thaislsilveira/FastFeet)  

Para ter acesso ao -> [*frontend*](https://github.com/thaislsilveira/FastFeet-Frontend)  

Para ter acesso ao -> [*mobile*](https://github.com/thaislsilveira/FastFeet-Mobile)  


Backend desenvolvido no treinamento GoStack, aplicado pela Rocketseat. Este desafio faz parte do projeto final do GoStack, desenvolvendo o FastFeet, uma transportadora fictícia.

**Instruções**

Em caso de download do projeto você precisará baixar as dependências:  

**Necessário:** Yarn ou Npm, Git, PostgreSQL e Redis instalados no seu computador

Durante o processo de desenvolvimento foi utilizado o Docker, portanto é recomendado que você faça o uso para utiização dos bancos de dados, você pode utilizar a partir dos seguintes comandos:
 ```
 #instalar a imagem do Redis 
docker run --name nameImage -p 6379:6379 -d -t redis:alpine

#instalar a imagem do Postgres
docker run --name nameImage -e POSTGRES_PASSWORD=yourPassword -p 5432:5432 -d postgres

```
- Comandos para execução dos serviços

```
#start Redis
docker start nameImage

#start Postgres
docker start nameImage

```
