<img src="https://raw.githubusercontent.com/yo1000/mailhoo/master/src/main/resources/node/src/components/mailhoo_logo.svg" width="32"> Mailhoo
=======

Mailhoo is a SMTP server for development inspired by [MailHog](https://github.com/mailhog/MailHog).

![GitHub Actions](https://github.com/yo1000/mailhoo/actions/workflows/mailhoo.yml/badge.svg)<br>
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=yo1000_mailhoo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=yo1000_mailhoo)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=yo1000_mailhoo&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=yo1000_mailhoo)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=yo1000_mailhoo&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=yo1000_mailhoo)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=yo1000_mailhoo&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=yo1000_mailhoo)


Build Requirements
------------------

When make a jar package.

- Java 17

When make a GraalVM based native binary.

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


How to run
----------

for Production by Java ARchive (jar).

```shell
java -jar target/mailhoo-0.0.1-SNAPSHOT.jar
```

for Production by GraalVM based native binary.

```shell
./target/mailhoo
```

for Development.

```shell
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="
  -Dspring.jpa.show-sql=true
  -Dspring.h2.console.enabled=true
  -Dserver.error.whitelabel.enabled=true
"
```


### Multi database support

Standard supports are follows.

- H2 (default, in-memory mode)
- PostgreSQL
- MySQL
- MariaDB

for example: Using PostgreSQL.

```shell
docker run -d -p5432:5432 \
-ePOSTGRES_DB=postgres \
-ePOSTGRES_USER=postgres \
-ePOSTGRES_PASSWORD=postgres \
postgres:latest

export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/postgres
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=postgres
./target/mailhoo
```

for example: Using MySQL.

```shell
docker run -d -p3306:3306 \
-eMYSQL_DATABASE=my \
-eMYSQL_USER=my \
-eMYSQL_PASSWORD=my \
-eMYSQL_ROOT_PASSWORD=my \
mysql:latest

export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/my
export SPRING_DATASOURCE_USERNAME=my
export SPRING_DATASOURCE_PASSWORD=my
./target/mailhoo
```

for example: Using MariaDB.

```shell
docker run -d -p3306:3306 \
-eMARIADB_DATABASE=maria \
-eMARIADB_USER=maria \
-eMARIADB_PASSWORD=maria \
-eMARIADB_ROOT_PASSWORD=maria \
mariadb:latest

export SPRING_DATASOURCE_URL=jdbc:mariadb://localhost:3306/maria
export SPRING_DATASOURCE_USERNAME=maria
export SPRING_DATASOURCE_PASSWORD=maria
./target/mailhoo
```
