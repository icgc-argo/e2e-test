FROM mhart/alpine-node:latest

WORKDIR /usr/src

COPY . .

RUN NODE_ENV=production npm ci

ENV NODE_PATH=./
ENV UI_ROOT=http://localhost:8080
ENV EGO_API_ROOT=https://ego.qa.argo.cancercollaboratory.org
ENV EGO_CLIENT_ID=platform-ui-qa
ENV GATEWAY_API_ROOT=https://argo-gateway.qa.argo.cancercollaboratory.org
ENV BROWSERSTACK_ACCESS_KEY=
ENV BROWSERSTACK_USER=
ENV BROWSERSTACK_API_ROOT=https://api.browserstack.com/automate
ENV BROWSERSTACK_SELENIUM_HOST=hub-cloud.browserstack.com
ENV BROWSERSTACK_PROJECT_NAME=ci_test
ENV TEST_GOOGLE_USER=
ENV TEST_GOOGLE_PASS=

CMD [ "npm", "run", "local" ]