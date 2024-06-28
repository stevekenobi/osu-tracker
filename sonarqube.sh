/home/thanosbousios/.sonarqube/bin/sonar-scanner  \
  -Dsonar.projectKey=osu-tracker \
  -Dsonar.sources=. \
  -Dsonar.exclusions=tests/**/* \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
  -Dsonar.token=sqp_3b1a6812d9d4123ce5c87af67e8f954c4095149d