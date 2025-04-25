FROM nginx
VOLUME /tmp
ENV LANG=en_US.UTF-8

COPY selfsigned.crt /etc/nginx/ssl/selfsigned.crt
COPY selfsigned.key /etc/nginx/ssl/selfsigned.key

RUN echo "server {  \
                      listen 443 ssl; \
                      http2 on; \
                      ssl_certificate /etc/nginx/ssl/selfsigned.crt; \
                      ssl_certificate_key /etc/nginx/ssl/selfsigned.key; \
                      client_max_body_size 100m; \
                      client_body_buffer_size 50M; \
                      location   /jeecgboot/ { \
                      proxy_pass              http://testnet-server:8080/jeecg-boot/; \
                      proxy_redirect          off; \
                      proxy_set_header        Host jeecg-boot-system; \
                      proxy_set_header        X-Real-IP \$remote_addr; \
                      proxy_set_header        X-Forwarded-For \$proxy_add_x_forwarded_for; \
                      proxy_read_timeout      180; \
                  } \
                location /ClientMessageService/ { \
                grpc_pass grpc://testnet-server:9090; \
                grpc_set_header Host \$host; \
                grpc_set_header X-Real-IP \$remote_addr; \
                grpc_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; \
                } \
                location /LiteFlowMessageService/ { \
                grpc_pass grpc://testnet-server:9090; \
                grpc_set_header Host \$host; \
                grpc_set_header X-Real-IP \$remote_addr; \
                grpc_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; \
                } \
                  #解决Router(mode: 'history')模式下，刷新路由地址不能找到页面的问题 \
                  location / { \
                     root   /var/www/html/; \
                      index  index.html index.htm; \
                      if (!-e \$request_filename) { \
                          rewrite ^(.*)\$ /index.html?s=\$1 last; \
                          break; \
                      } \
                  } \
                  access_log  /var/log/nginx/access.log ; \
                  \
                  # gzip config \
                  gzip on; \
                  gzip_min_length 1k; \
                  gzip_comp_level 9; \
                  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png; \
                  gzip_vary on; \
                  gzip_disable \"MSIE [1-6]\\.\"; \
              } " > /etc/nginx/conf.d/default.conf \
    &&  mkdir  -p  /var/www \
    &&  mkdir -p /var/www/html

ADD dist/ /var/www/html/
EXPOSE 443
