plugins {
    kotlin("jvm") version "2.0.21"
    id("com.google.devtools.ksp") version "2.1.10-1.0.31"
}

group = "dev.zrdzn.finance"
version = "0.1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.devtools.ksp:symbol-processing-api:1.9.22-1.0.17")

    val poet = "2.1.0"
    implementation("com.squareup:kotlinpoet:$poet")
    implementation("com.squareup:kotlinpoet-ksp:$poet")
}

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

kotlin {
    jvmToolchain(21)
}