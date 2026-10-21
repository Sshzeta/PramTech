FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY landing/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cache-busting automatico por hash de contenido.
# El token ?v= de cada asset se reescribe en cada build con un hash del
# contenido de los assets. Si un deploy cambia script.js o styles.css, las URLs
# cambian y ni el navegador ni el CDN (Cloudflare, TTL 4h) pueden seguir
# sirviendo la version anterior. Sin esto, un cambio de JS queda invisible
# para los visitantes que ya visitaron el sitio.
RUN set -eux; \
    stamp="$( (md5sum /usr/share/nginx/html/*.js /usr/share/nginx/html/*.css; \
                find /usr/share/nginx/html/assets -type f -exec md5sum {} \; | sort) \
              | md5sum | cut -c1-8)"; \
    find /usr/share/nginx/html -name '*.html' -type f \
        -exec sed -i -e 's/?v=[^"&]*/?v=__BUST__/g' {} \; ; \
    find /usr/share/nginx/html -name '*.html' -type f \
        -exec sed -i -e "s/?v=__BUST__/?v=${stamp}/g" {} \; ; \
    if grep -rq '__BUST__' /usr/share/nginx/html; then \
        echo 'ERROR: quedaron tokens de cache-busting sin resolver'; exit 1; \
    fi

EXPOSE 80
