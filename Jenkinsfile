pipeline {

  agent {
    docker {
      image 'retail-bint.corp.apple.com/alpine-java8-maven:3.5.2'
      label 'rosdaos'
      args '-v /ngs/app/rosd/nfsmounts/agents/mvnrepo:/ngs/app/rosd/nfsmounts/agents/mvnrepo'
    }
  }

  options {
    timeout(time: 15, unit: 'MINUTES')
    ansiColor('xterm')
  }

  stages {
    stage('build') {
      steps {
        script {
          def pom = readMavenPom file: 'pom.xml'
          def version = pom['version'].toUpperCase();
          def branch = "${env.BRANCH_NAME}"
           def pr = "${env.BRANCH_NAME}"
            configFileProvider([configFile(fileId: 'aos-bint', variable: 'MAVEN_SETTINGS')]) {
              if (!branch.contains('master') && !version.contains('SNAPSHOT')|| pr.contains('PR-')) {
                // doesn't trigger a release if it isn't master.
                sh 'mvn clean install -Dmaven.test.skip=true -s $MAVEN_SETTINGS'
              }
              else {
                // change your goal as per your requirements here.
                sh 'mvn clean deploy -U -Dmaven.test.skip=true -s $MAVEN_SETTINGS'
              }
            }
        }
      }
    }
  }
  post {
      failure {
          emailext attachLog: false, body: """FAILED: Job Check console output at '${env.BUILD_URL}';""",
          recipientProviders: [[$class: 'CulpritsRecipientProvider'], [$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']], subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"

      }

  }

}
