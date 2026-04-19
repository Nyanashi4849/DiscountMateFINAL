stage('Build') {
    steps {
        script {
            echo ' Cleaning workspace for fresh build...'
            cleanWs()

            echo ' Installing dependencies...'
            bat 'npm install'

            echo 'Running build step (if available)...'
            bat 'npm run build || echo "No build script found, skipping..."'

            echo ' Building Docker image with version tag...'
            bat 'docker build -t discountmate-api:%BUILD_NUMBER% .'

            echo 'Saving Docker image as artifact...'
            bat 'docker save discountmate-api:%BUILD_NUMBER% > discountmate-api.tar'

            echo ' Build stage completed successfully'
        }
    }
}
