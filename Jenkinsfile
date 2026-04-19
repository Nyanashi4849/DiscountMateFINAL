pipeline {

    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t discountmate-api .'
            }
        }

        stage('Run Container') {
    steps {
        bat '''
        set COMPOSE_PROJECT_NAME=discountmate_hd
        docker-compose down -v --remove-orphans
        docker-compose up -d --build
        '''
    }
}

    }
}
