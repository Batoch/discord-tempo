# discord-tempo

A simple bot capable of notifying users every day if the next day is not "blue" on the EDF electricity delivery system.

## How to run

### Using nodejs

Install [npm](https://docs.npmjs.com/getting-started/what-is-npm) dependences :

```shell
npm install
```

Start the serveur:

```shell
npm start
```

### Using Docker

#### For X86 and ARM based systems

```shell
docker run -d --restart=on-failure --name discordtempo --mount source=VOLNAME,target=/usr/src/app/data -e TOKEN='TOKENVALUE' ghcr.io/batoch/discordtempo:latest
```

#### Configuration

To use '/' commands, you need to use the deploy-commands.js file.

```shell
npm run deploy
```

You need to provide informations about the server you want to deploy on (telling Discord which / commands you can use).
Example config.json file:

```json
{
    "TOKEN": "",
    "CLIENTID": "",
    "GUILDID": ""
}
```
