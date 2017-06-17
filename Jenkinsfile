pipeline {

    environment {
        NEXUS = credentials('deployment-snapshots')
    }

    agent { 
       label 'tool10'
    }
 
    stages {
        stage('build') {
            
            tools {
                nodejs 'node-v6.10.0'
                jdk 'jdk8'
            }
            
            steps {
                sh 'gradle build -PnexusUsername=$NEXUS_USR -PnexusPassword=$NEXUS_PSW -PnexusBase=$nexusBase'
            }
        }
    }

}


