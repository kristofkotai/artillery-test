#!/usr/bin/env bash

./node_modules/.bin/artillery run --output=reports/login-and-test.json tests/login-and-test.yml
./node_modules/.bin/artillery report reports/login-and-test.json
chmod 0777 reports/*
node library/test-evaluator.js tests/login-and-test.yml reports/login-and-test.json
