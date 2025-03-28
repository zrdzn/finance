
import org.gradle.api.tasks.testing.logging.TestExceptionFormat
import org.gradle.api.tasks.testing.logging.TestLogEvent
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("com.coditory.integration-test") version "2.2.5"
    id("org.springframework.boot") version "3.4.4"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.jetbrains.kotlin.plugin.noarg") version "2.1.20"
    id("com.github.johnrengelman.shadow") version "8.1.1"
    kotlin("jvm") version "2.1.20"
    kotlin("plugin.spring") version "2.1.20"
    kotlin("plugin.allopen") version "2.1.20"
    kotlin("plugin.jpa") version "2.1.20"
}

group = "dev.zrdzn.finance"
version = "0.1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    // Spring
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-test")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.security:spring-security-crypto")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.6")

    // TOTP
    implementation("dev.samstevens.totp:totp-spring-boot-starter:1.7.1")

    // Serialization
    val jackson = "2.18.3"
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:$jackson")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:$jackson")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-xml:$jackson")
    implementation("com.konghq:unirest-modules-jackson:4.4.5")
    implementation("com.konghq:unirest-java-core:4.4.5")

    // Database
    implementation("org.postgresql:postgresql:42.7.5")
    implementation("org.liquibase:liquibase-core:4.31.1")

    // Storage
    implementation("software.amazon.awssdk:s3:2.31.6")

    // Authentication
    implementation("com.auth0:java-jwt:4.5.0")

    // Cache
    implementation("com.github.ben-manes.caffeine:caffeine:3.2.0")

    // Reflection
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // CSV
    implementation("com.opencsv:opencsv:5.10")

    // AI
    implementation("io.github.sashirestela:simple-openai:3.19.4") {
        exclude(group = "ch.qos.logback", module = "logback-classic")
        exclude(group = "org.slf4j", module = "slf4j-api")
        exclude(group = "org.slf4j", module = "slf4j-simple")
    }

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql:1.19.3")
}

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

springBoot {
    buildInfo()
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        languageVersion = "1.9"
        freeCompilerArgs += "-Xjsr305=strict"
        jvmTarget = "21"
        javaParameters = true
    }
}

tasks.withType<Test> {
    useJUnitPlatform()

    testLogging {
        events(
            TestLogEvent.STARTED,
            TestLogEvent.PASSED,
            TestLogEvent.FAILED,
            TestLogEvent.SKIPPED
        )
        exceptionFormat = TestExceptionFormat.FULL
        showExceptions = true
        showCauses = true
        showStackTraces = true
        showStandardStreams = true
    }

    maxParallelForks = 1
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.Embeddable")
    annotation("jakarta.persistence.MappedSuperclass")
}
