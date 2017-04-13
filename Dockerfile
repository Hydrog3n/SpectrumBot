
FROM xataz/node:7

LABEL Description="Webservice for Pente game" \
      tags="latest" \
      maintainer="hydrog3n <https://github.com/hydrog3n>"

COPY . /spectrum
RUN cd /spectrum \
    && rm -rf .tmp/* \
    && npm install

COPY startup /usr/local/bin/startup
RUN chmod +x /usr/local/bin/startup

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/startup"]
CMD ["npm", "start"]