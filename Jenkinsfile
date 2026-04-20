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
        echo DEPLOYMENT STARTING (PRODUCTION STYLE)
        echo =====================================

        set IMAGE=discountmate-api:%BUILD_NUMBER%
        set CONTAINER_NAME=discountmate-api
        set PORT=5000

        echo Checking existing container...
        docker ps -a -q -f name=%CONTAINER_NAME% > container.txt
        set /p OLD_CONTAINER=<container.txt

        if not "%OLD_CONTAINER%"=="" (
            echo Stopping and removing old container...
            docker stop %CONTAINER_NAME%
            docker rm %CONTAINER_NAME%
        ) else (
            echo No existing container found.
        )

        echo Starting new container...
        docker run -d ^
        --name %CONTAINER_NAME% ^
        -p %PORT%:3000 ^
        --restart unless-stopped ^
        %IMAGE%

        echo Waiting for service to become healthy...

        set RETRY=0

        :healthcheck

        REM Try root endpoint first
        curl -f http://localhost:%PORT%/ >nul 2>nul

        if %ERRORLEVEL%==0 (
            echo Service is healthy!
            goto success
        )

        REM Optional fallback health endpoint (uncomment if you have /health)
        REM curl -f http://localhost:%PORT%/health >nul 2>nul
        REM if %ERRORLEVEL%==0 (
        REM     echo Service is healthy via /health endpoint!
        REM     goto success
        REM )

        set /a RETRY+=1
        echo Health check failed. Attempt %RETRY% of 10...

        REM FIX: Jenkins-safe sleep (replaces timeout)
        ping 127.0.0.1 -n 4 >nul

        if %RETRY% LSS 10 goto healthcheck

        echo =====================================
        echo DEPLOY FAILED - ROLLING BACK
        echo =====================================

        docker stop %CONTAINER_NAME%
        docker rm %CONTAINER_NAME%

        echo Restarting last known image...
        docker run -d ^
        --name %CONTAINER_NAME% ^
        -p %PORT%:3000 ^
        --restart unless-stopped ^
        %IMAGE%

        exit /b 1

        :success
        echo =====================================
        echo DEPLOYMENT SUCCESSFUL
        echo =====================================
        '''
    }
}
    }
}
