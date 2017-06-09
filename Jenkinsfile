pipeline {
    environment {
        NEXUS = credentials('deployment-snapshots')
    }
    agent { label 'aosdc'}
    stages {
        stage("build") {
            tools {
                nodejs 'node-v6.10.0'

            }
            steps {
                sh "gradle gulpTest -PnexusUsername=$NEXUS_USR -PnexusPassword=$NEXUS_PSW"
            }
        }
    }
}


