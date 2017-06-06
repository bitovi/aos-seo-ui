pipeline {
    agent { label 'aosdc' }
    environment {
        MVN_TASK='deploy:deploy-file'
    }
    stages {
        stage("build") {
            tools {
                nodejs 'node-v6.10.0'

            }
            steps {
                sh "node --version"
                sh "npm --version"
                sh "npm install"
                sh "build/build-seo-ui.sh"
            }
        }
    }
}
