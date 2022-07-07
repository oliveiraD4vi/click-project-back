# Click Project API

Click is a project developed and improved during the Software Engineering course at UFC - Quixadá campus. The system proposes a vote for films to be shown in a school cinema or social project. The purpose of the project is to exercise project development and organization skills.

## Starting

After clonning the repository, run

```
npm i
```
in order to install the right dependencies needed. Then run

```
node server.js
```
to see the server running locally.

This application is under development, so to run the app properly you will need the frontend app running locally as well. In order to get it, see the [FrontEnd repository](https://github.com/oliveiraD4vi/click-project).

It also uses a connection with a Postgres DB, so you will need it. See the .env-example file, and create a .env with those variables. If you want to change the used DB, see [Sequelize](https://sequelize.org/docs/v6/getting-started/).

## Build with

* [NodeJs](https://pt-br.reactjs.org/) - The runtime environment used
* [Postgres](https://www.postgresql.org/) - The DB used
* [JWT](jwt.io) - The method for representing claims securely between two parties
* [Sequelize](https://sequelize.org/) - The DB ORM used

## Version

See the [tags in this repository](https://github.com/oliveiraD4vi/click-project-back/tags).

## License

[MIT](https://choosealicense.com/licenses/mit/)
