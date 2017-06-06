pipeline {
    agent { label 'docker-slave' }
    stages {
        stage("build") {
            steps {
                sh "echo hello-world"
            }
        }
    }
}
