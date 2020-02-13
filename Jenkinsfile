pipeline {
    agent { node { label 'BAASU' } }

    environment {
        PATH = "$WORKSPACE/.npm-packages:$WORKSPACE/node-v10.16.3-linux-x64/bin:$WORKSPACE/node_modules/@angular/cli/bin:$PATH"
        NPM_CONFIG_USERCONFIG = "$WORKSPACE/.npmrc"
        NG_CLI_ANALYTICS = "ci"
    }

    stages {
        stage('Initialize') {
            steps {
                echo 'Initialize..'
                sh '''
                    wget -q https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-x64.tar.gz
                    tar -xaf node-v10.16.3-linux-x64.tar.gz
                    env
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Build..'
                sh label: '', script: '''
                    export PATH
                    echo $PATH
                    pwd
                    ls -la
                    npm install
                    ng build
                '''
            }
        }

        stage('Unit Testing') {
            steps {
                sh 'npm run test-headless'
            }
            post {
              always {
                junit 'coverage/test-report.xml'
                    cobertura autoUpdateHealth: false,
                    failUnhealthy: false,
                    autoUpdateStability: false,
                    onlyStable: false,
                    coberturaReportFile: '**/cobertura-coverage.xml',
                    maxNumberOfBuilds: 0,
                    packageCoverageTargets: '90, 0, 90',
                    fileCoverageTargets: '90, 0, 90',
                    classCoverageTargets: '90, 0, 90',
                    methodCoverageTargets: '65, 0, 65',
                    lineCoverageTargets: '68, 0, 68',
                    conditionalCoverageTargets: '54, 0, 54'
              }
            }
        }
    }
}
