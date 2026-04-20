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

        set IMAGE=discountmate-api:36
        set CONTAINER_NAME=discountmate-api
        set PORT=5000
        set MAX_RETRIES=15

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
            -p %PORT%:5000 ^
            --restart unless-stopped ^
            %IMAGE%

        echo Waiting for container startup...

        timeout /t 5 /nobreak >nul

        set RETRY=0

        :healthcheck
        echo Checking service health (attempt %RETRY%/%MAX_RETRIES%)...

        curl -f http://localhost:%PORT%/ >nul 2>nul

        if %ERRORLEVEL% EQU 0 (
            echo =====================================
            echo SERVICE IS HEALTHY - DEPLOY SUCCESS
            echo =====================================
            exit /b 0
        )

        echo Health check failed...

        docker logs --tail 20 %CONTAINER_NAME%

        set /a RETRY+=1

        if %RETRY% GEQ %MAX_RETRIES% goto fail

        timeout /t 3 /nobreak >nul
        goto healthcheck

        :fail
        echo =====================================
        echo DEPLOY FAILED - ROLLING BACK
        echo =====================================

        docker stop %CONTAINER_NAME%
        docker rm %CONTAINER_NAME%

        echo Restarting last known image...

        docker run -d ^
            --name %CONTAINER_NAME% ^
            -p %PORT%:5000 ^
            --restart unless-stopped ^
            %IMAGE%

        exit /b 1
        '''
    }
}
        stage('Release') {
    steps {
        bat '''
        echo =====================================
        echo RELEASE STAGE STARTING
        echo =====================================

        set IMAGE=discountmate-api:%BUILD_NUMBER%

        echo Tagging Git release...
        git config user.email "jenkins@ci.com"
        git config user.name "Jenkins CI"

        git tag -a v%BUILD_NUMBER% -m "Release version %BUILD_NUMBER%"
        git push origin v%BUILD_NUMBER%

        echo Tag created: v%BUILD_NUMBER%

        echo =====================================
        echo BUILD RELEASE METADATA
        echo =====================================

        echo {
          "version": "%BUILD_NUMBER%",
          "image": "%IMAGE%",
          "status": "released",
          "timestamp": "%DATE% %TIME%"
        } > release.json

        echo Release metadata created

        echo =====================================
        echo (OPTIONAL) PUSH DOCKER IMAGE
        echo =====================================

        REM docker login -u %DOCKER_USER% -p %DOCKER_PASS%
        REM docker tag discountmate-api:%BUILD_NUMBER% yourrepo/discountmate-api:%BUILD_NUMBER%
        REM docker push yourrepo/discountmate-api:%BUILD_NUMBER%

        echo =====================================
        echo RELEASE COMPLETE
        echo =====================================
        '''
    }
}
    }
}
