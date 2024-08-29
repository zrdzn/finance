FROM gradle:jdk17-focal as builder
WORKDIR /app
COPY . /app
RUN gradle bootJar

FROM openjdk:17-jdk-slim
COPY --from=builder /app/build/libs/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]