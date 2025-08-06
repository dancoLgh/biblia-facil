
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*


COPY template-generator/ /usr/share/nginx/html/

# Exponemos el puerto 80 para HTTP
EXPOSE 80

# Arrancamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
