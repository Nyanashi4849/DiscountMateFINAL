stage('Build') {
    steps {
        script {
            echo 'leaning workspace for fresh build...'
            cleanWs()

            echo ' Installing dependencies...'
            bat 'npm install'

            echo ' Running pre-build check...'
            bat 'npm run build || echo "No build script found, continuing..."'

            echo ' Building Docker image (versioned)...'
            bat 'docker build -t discountmate-api:%BUILD_NUMBER% .'

            echo 'Saving Docker image as artifact...'
            bat 'docker save discountmate-api:%BUILD_NUMBER% -o discountmate-api.tar'

            echo ' Build stage completed successfully'
        }
    }
}
