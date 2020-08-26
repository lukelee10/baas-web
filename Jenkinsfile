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
                echo 'Initialize...'
                sh '''
                    declare -r NODE_JS_FILENAME='node-v10.16.3-linux-x64.tar.gz'
                    if [[ -s "${NODE_JS_FILENAME}" ]]; then
                      echo 'Existing Node.js distribution archive will be used'
                    else
                      wget -q "https://nodejs.org/dist/v10.16.3/${NODE_JS_FILENAME}"
                    fi
                    tar -xaf "${NODE_JS_FILENAME}"
                    env
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Build...'
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

        stage('Linting') {
            steps {
                echo 'Linting...'
                sh label: '', script: '''
                    mkdir -p ./coverage
                    npm run lint-jenkins
                '''
            }
            post {
                always{
                    recordIssues failedTotalAll: 25, failedTotalHigh: 3, failedTotalLow: 20, failedTotalNormal: 10,
                        unstableTotalAll: 10, unstableTotalHigh: 1, unstableTotalLow: 10, unstableTotalNormal: 5,
                        tools: [checkStyle(pattern: '**/coverage/checkstyle.xml', reportEncoding: 'UTF-8')]
                }
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
