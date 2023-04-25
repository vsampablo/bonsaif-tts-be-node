## Dockerizing a Node.js web app

[https://nodejs.org/en/docs/guides/nodejs-docker-webapp](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)


## Docker

Crear Imagen del proyecto

```sh
cd /var/lib/node/tts/
docker build . -t bonsaif/tts:v1
```

Imagenes de docker
```sh
docker images
```
Crear contenedor (configurar puerto y volumen)

```sh
docker run -d --name tts1 -p 8801:8806 -v /var/lib/asterisk/sounds/blaster/:/var/lib/asterisk/sounds/blaster/ bonsaif/tts:v1
```
logs app
```sh
docker logs -f ${contenedor}
```
procesos
```sh
docker ps
```


Validar servicio

```sh
https.//127.0.0.1:${puerto}
```
detener contenedor
```sh
docker stop ${contenedor}
```
borrar contenedor
```sh
docker rm ${contenedor}
```
