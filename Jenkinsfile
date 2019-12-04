pipeline {
    // CHANGE the label for your team!
    agent { node { label 'BAASU' } }
    //agent { node { label 'DATAU' } }

    environment {
        PATH = "$WORKSPACE/.npm-packages:$WORKSPACE/node-v10.16.3-linux-x64/bin:$WORKSPACE/node_modules/@angular/cli/bin:$PATH"
        NPM_CONFIG_USERCONFIG = "$WORKSPACE/.npmrc"
        NG_CLI_ANALYTICS = "ci"
    }
    
    stages {

        stage('Initialize') {
            steps {
                //deleteDir()
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
		        cobertura autoUpdateHealth: false, autoUpdateStability: false, 
                    coberturaReportFile: '**/cobertura-coverage.xml', 
                    conditionalCoverageTargets: '14, 0, 14', 
                    failUnhealthy: false, 
                    fileCoverageTargets: '90, 0, 90', 
                    lineCoverageTargets: '48, 0, 48', 
                    maxNumberOfBuilds: 0, 
                    methodCoverageTargets: '48, 0, 48', 
                    onlyStable: false
              }
            }
        }
        
    }

}
