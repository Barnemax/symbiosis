FROM dunglas/frankenphp:1-php8.4-alpine

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN install-php-extensions \
    pdo_pgsql \
    intl \
    zip \
    opcache \
    gd

COPY php.ini /usr/local/etc/php/conf.d/app.ini
COPY Caddyfile /etc/frankenphp/Caddyfile

WORKDIR /app
