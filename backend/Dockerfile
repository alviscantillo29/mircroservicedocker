# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copiar configuración de dependencias Maven primero para cache de capas
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente y compilar la aplicación
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Production runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Crear usuario sin privilegios root por seguridad en microservicios
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar el artefacto .jar generado
COPY --from=builder /app/target/*.jar app.jar

# Exponer el puerto configurado en el servicio
EXPOSE 3050

# Comando de ejecución del microservicio
ENTRYPOINT ["java", "-jar", "app.jar"]
