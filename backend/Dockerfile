# Backend Dockerfile — Laravel (desenvolupament)
# Col·loca aquest fitxer a: backend/Dockerfile

FROM php:8.3-cli

# Instal·la extensions PHP necessàries per a Laravel + MySQL
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instal·la Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# El codi es munta via volum (vegeu docker-compose.yml)
# Aquí no copiem res per mantenir el hot reload

EXPOSE 8000
