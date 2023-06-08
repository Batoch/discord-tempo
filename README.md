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

#### For X86 based systems

```shell
docker run -d --restart=on-failure --name discordtempo -e TOKEN='TOKENVALUE' ghcr.io/batoch/discord-tempo/discordtempo:amd64-latest
```

#### For ARM based systems

```shell
docker run -d --restart=on-failure --name discordtempo -e TOKEN='TOKENVALUE' ghcr.io/batoch/discord-tempo/discordtempo:arm-latest
```

#### Configuration

To use '/' commands, you need to use the deploy-commands.js file.

```shell
npm deploy
```

You need to provide informations about the server you want to deploy on.
Example config.json file:

```json
{
    "TOKEN": "",
    "CLIENTID": "",
    "GUILDID": ""
}
```
