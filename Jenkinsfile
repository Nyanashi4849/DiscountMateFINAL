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
      stage('Deploy') {
    steps {
        bat '''
        echo =====================================
        echo DEPLOYMENT STARTING
        echo =====================================

        set IMAGE=discountmate-api:%BUILD_NUMBER%

        echo Checking existing container...

        docker ps -a -q -f name=discountmate-api > container.txt
        set /p OLD_CONTAINER=<container.txt

        if not "%OLD_CONTAINER%"=="" (
            echo Stopping old container...
            docker stop discountmate-api
            docker rm discountmate-api
        ) else (
            echo No existing container found.
        )

        echo Running new container...
        docker run -d ^
        --name discountmate-api ^
        -p 3000:3000 ^
        --restart unless-stopped ^
        %IMAGE%

        echo Waiting for service startup...
        timeout /t 10

        echo Running health check...

        curl http://localhost:5000/ > healthcheck.txt

        if %ERRORLEVEL% NEQ 0 (
            echo =====================================
            echo DEPLOY FAILED - ROLLING BACK
            echo =====================================

            docker stop discountmate-api
            docker rm discountmate-api

            docker run -d ^
            --name discountmate-api ^
            -p 3000:3000 ^
            --restart unless-stopped ^
            %IMAGE%

            exit /b 1
        )

        echo =====================================
        echo DEPLOYMENT SUCCESSFUL
        echo =====================================
        '''
    }
}
        
    }
}
