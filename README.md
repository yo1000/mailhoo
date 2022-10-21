<img src="https://raw.githubusercontent.com/yo1000/mailhoo/master/src/main/resources/node/src/components/mailhoo_logo.svg" width="32"> Mailhoo
=======

Mailhoo is a SMTP server for development inspired by [MailHog](https://github.com/mailhog/MailHog).

![GitHub Actions](https://github.com/yo1000/mailhoo/actions/workflows/mailhoo.yml/badge.svg)<br>
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=yo1000_mailhoo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=yo1000_mailhoo)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=yo1000_mailhoo&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=yo1000_mailhoo)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=yo1000_mailhoo&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=yo1000_mailhoo)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=yo1000_mailhoo&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=yo1000_mailhoo)


How to run
----------

### Run with Docker image

```shell
docker run ghcr.io/yo1000/mailhoo
```

### Run with Docker image and use an external database as a data store

```shell
docker run \
  --env SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mailhoo \
  --env SPRING_DATASOURCE_USERNAME=postgres \
  --env SPRING_DATASOURCE_PASSWORD=postgres \
  ghcr.io/yo1000/mailhoo
```

The following other databases are available.

| Database     | JDBC Url example                         |
|:-------------|:-----------------------------------------|
| H2 (default) | jdbc:h2:mem:mailhoo                      |
| PoasgreSQL   | jdbc:postgresql://localhost:5432/mailhoo |
| MySQL        | jdbc:mysql://localhost:3306/mailhoo      |
| MariaDB      | jdbc:mariadb://localhost:3306/mailhoo    |

### Run with native image

```shell
curl -o mailhoo https://github.com/yo1000/mailhoo/releases/download/1.0.0/mailhoo-linux && ./mailhoo
```

### Run with Java ARchive (jar)

See "Build Requirements" below for build requirements.

```shell
./mvnw package && \
java -jar target/mailhoo-0.0.1-SNAPSHOT.jar
```

### Run with Maven for development

See "Build Requirements" below for build requirements.

```shell
./mvnw clean spring-boot:run -Dspring-boot.run.jvmArguments="
  -Dspring.jpa.show-sql=true
  -Dspring.h2.console.enabled=true
  -Dserver.error.whitelabel.enabled=true
  -Dmailhoo.web.allowed-origins=http://localhost:8081
" &

cd src/main/resources/node
NODE_ENV=development \
PORT=8081 \
API_BASE_URL=http://localhost:8080 \
npx webpack serve &

open http://localhost:8081
```


Build Requirements
------------------

When make a jar package.

- Java 17

When make a GraalVM based native image.

- GraalVM CE 22

```shell
java -version
openjdk version "17.0.4" 2022-07-19
OpenJDK Runtime Environment GraalVM CE 22.2.0 (build 17.0.4+8-jvmci-22.2-b06)
OpenJDK 64-Bit Server VM GraalVM CE 22.2.0 (build 17.0.4+8-jvmci-22.2-b06, mixed mode, sharing)
```


How to build
------------

for Java ARchive (jar).

```shell
./mvnw clean package
```

for GraalVM based native binary.

```shell
./mvnw clean package -Pnative
```
