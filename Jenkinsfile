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
        
    }
}
