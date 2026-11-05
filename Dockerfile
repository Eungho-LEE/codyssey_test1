FROM nginx:alpine
LABEL org.opencontainers.image.title="e11-workstation-web"
COPY site/ /usr/share/nginx/html/
EXPOSE 80
