pipeline {
    agent {
        // docker {
            // image 'retail-bint.corp.apple.com/alpine-java8-gradle:4.1'
            label 'tool12'
        // }
    }

    environment {
        NEXUS = credentials('deployment-releases')
        ARTIFACTORY = credentials('ci-read-aos-bint')
    }

    options {
        timeout(time: 30,unit: 'MINUTES')
        ansiColor('xterm')
    }

    stages {
        stage('build') {
            steps {
                script {
                    def branch_name = "${env.BRANCH_NAME}"
                    version_no = sh(script: 'cat ${WORKSPACE}/gradle.properties | grep ^version=',returnStdout: true).trim()
                    if (!branch_name.contains('master') && !version_no.contains('SNAPSHOT')|| branch_name.contains('PR-') || branch_name.contains('feature/') || branch_name.contains('bugfix/')){
                        sh 'gradle createJar -x test -x javadoc -Dorg.gradle.daemon=false'
                    }
                    else {
                        sh 'gradle publish -x test -x javadoc -Dorg.gradle.daemon=false'
                    }
                }
            }
        }
    }
}

