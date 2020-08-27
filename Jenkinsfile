final SONARQUBE_INSTALLATION_NAME = 'UnofficialSonarQube'
final SONARQUBE_CREDENTIALS_ID = 'sonarqube-doaks-token'

pipeline {
    agent { node { label 'BAASU' } }

    tools {
        git 'Default'
    }

    triggers {
        // Poll GitLab every 2 minutes for updates.
        pollSCM('H/2 * * * *')
    }

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        PATH = "$WORKSPACE/.npm-packages:$WORKSPACE/node-v10.16.3-linux-x64/bin:$WORKSPACE/node_modules/@angular/cli/bin:$WORKSPACE/sonar-scanner/bin:$PATH"
        NPM_CONFIG_USERCONFIG = "$WORKSPACE/.npmrc"
        NG_CLI_ANALYTICS = "ci"
        SONAR_SCANNER_OPTS='-Xmx1024m'
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

                sh label: 'Install SonarQube', script: '''
                    declare -r EXPECTED_SONAR_HASH='889f75c535471d426fcc4d75d4496ec6df6dd0a34c805988329fa58300775b4a'
                    declare -r SONAR_SCANNER_FILENAME='sonar-scanner-cli-4.4.0.2170-linux.zip'
                    if [[ -s "${SONAR_SCANNER_FILENAME}" ]]; then
                        echo 'Existing SonarScanner installation will be used'
                    else
                        wget -q "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/${SONAR_SCANNER_FILENAME}"
                    fi
                    # Before we unzip, verify that the file hash matches expected checksum
                    echo -e "${EXPECTED_SONAR_HASH}\t*${SONAR_SCANNER_FILENAME}" | sha256sum --strict --check -
                    hashMatchExitCode=$?
                    if [[ "${hashMatchExitCode}" -ne '0' ]]; then
                        echo "Hash of downloaded ${SONAR_SCANNER_FILENAME} file did not match ${EXPECTED_SONAR_HASH}"
                        exit 1
                    fi
                    unzip -qou "${SONAR_SCANNER_FILENAME}"
                    ln -sfT 'sonar-scanner-4.4.0.2170-linux' 'sonar-scanner'
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

        stage('SonarQube Analysis') {
            steps {
                echo 'SonarQube Analysis...'
                withSonarQubeEnv(installationName: "${SONARQUBE_INSTALLATION_NAME}",
                                 credentialsId: "${SONARQUBE_CREDENTIALS_ID}") {
                    sh label: 'Upload tests to SonarQube', script: """
                        # Removing remote from branch name
                        BRANCH=\${GIT_BRANCH#*/}

                        # Unset BRANCH if it is Master
                        [[ BRANCH == "master" ]] && BRANCH=""

                        TARGET_BRANCH=\$(case \$BRANCH in
                        dev | release | release-*)  echo -n "master";;
                        origin/master | master)     echo -n "";;
                        *)                          echo -n "dev";;
                        esac)

                        sonar-scanner -Dsonar.branch.name="\${BRANCH}" -Dsonar.branch.target="\${TARGET_BRANCH}"
                    """
                }

                // Wait for SonarQube analysis to confirm code passes quality-gate
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
