Mailhoo
=======

Mailhoo is a SMTP server for development inspired by [MailHog](https://github.com/mailhog/MailHog).


Build Requirements
------------------

When make a jar package.

- Java 17


How to build
------------

for Java ARchive (jar).

```shell
./mvnw clean package
```


How to run
----------

for Production

```shell
java -jar target/mailhoo-0.0.1-SNAPSHOT.jar
```

for Development

```shell
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="
  -Dspring.jpa.show-sql=true
  -Dspring.h2.console.enabled=true
  -Dserver.error.whitelabel.enabled=true
"
```
