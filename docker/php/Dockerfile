FROM php:8.2-apache

# Apache modules: rewrite for the api/.htaccess front-controller, headers for CORS.
RUN a2enmod rewrite headers

# PHP extensions: pdo_mysql/mysqli for the DB layer, gd + zip + intl for
# PhpSpreadsheet (used by the order export).
RUN apt-get update && apt-get install -y --no-install-recommends \
        libzip-dev \
        libpng-dev \
        libjpeg-dev \
        libfreetype6-dev \
        libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mysqli gd zip intl \
    && rm -rf /var/lib/apt/lists/*

# Let the api/.htaccess rewrite rules take effect.
RUN sed -ri 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

# Bigger uploads for image/topsign upload endpoints.
RUN { \
        echo 'upload_max_filesize = 64M'; \
        echo 'post_max_size = 64M'; \
        echo 'memory_limit = 512M'; \
        echo 'max_execution_time = 0'; \
    } > /usr/local/etc/php/conf.d/zz-app.ini

# DocumentRoot stays /var/www/html; the code is mounted at /var/www/html/api,
# so requests hit https://<domain>/api/... exactly as the frontend expects.
WORKDIR /var/www/html
