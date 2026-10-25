ARG BASE_IMAGE
FROM ${BASE_IMAGE}
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
COPY recipe.json install.sh /tmp/hello-mongodb/
RUN bash /tmp/hello-mongodb/install.sh /tmp/hello-mongodb/recipe.json \
    && rm -rf /tmp/hello-mongodb
ENV PATH="/opt/mongodb/bin:/opt/mongosh/bin:/opt/database-tools/bin:${PATH}"

