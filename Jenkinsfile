pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                bat '''
                echo Cleaning workspace...
                
                echo Installing dependencies...
                npm install

                echo Running tests...
                npm test

                echo Building Docker image...
                docker build -t discountmate-api:%BUILD_NUMBER% .

                echo Saving image artifact...
                docker save discountmate-api:%BUILD_NUMBER% -o discountmate-api.tar
                '''
            }
        }

        stage('Run Tests') {
    steps {
        bat '''
        echo Running automated test suite...

        npm test
        '''
    }
}
        stage('Build Docker Image') {
    steps {
        bat '''
        echo Building Docker image with versioning...

        docker build -t discountmate-api:%BUILD_NUMBER% .

        echo Build completed successfully
        '''
    }
}
     stage('Code Quality - SonarCloud') {
    steps {
        withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
            script {
                def scannerHome = tool 'sonar-scanner'

                bat """
                echo Running SonarCloud Analysis...

                ${scannerHome}\\bin\\sonar-scanner ^
                -Dsonar.projectKey=Nyanashi4849_DiscountMateFINAL ^
                -Dsonar.organization=nyanashi4849 ^
                -Dsonar.sources=. ^
                -Dsonar.host.url=https://sonarcloud.io ^
                -Dsonar.login=%SONAR_TOKEN%
                """
            }
        }
    }
}
      
stage('Security Scan - Snyk') {
    steps {
        withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
            bat '''
                echo Installing Snyk CLI...
                npm install -g snyk

                echo Authenticating Snyk...
                snyk auth %SNYK_TOKEN%

                echo Testing dependencies...
                snyk test --severity-threshold=high

                echo Testing Docker image...
                snyk container test discountmate-api:%BUILD_NUMBER% --severity-threshold=high || exit 1
            '''
        }
    }
}
    }
}
