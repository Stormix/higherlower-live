FROM oven/bun:1.1.36 AS base
WORKDIR /usr/src/app

ARG BETTER_AUTH_URL
ENV BETTER_AUTH_URL ${BETTER_AUTH_URL}

RUN apt-get -y update; apt-get -y install curl
ARG NODE_VERSION=20.18.0
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
RUN bash n $NODE_VERSION
RUN rm n
RUN npm install -g n


FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb prisma /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile
RUN cd /temp/dev && bunx prisma generate

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
RUN mkdir -p dist
COPY --from=prerelease /usr/src/app/.output .
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "server/index.mjs" ]