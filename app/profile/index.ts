export { default as ProfileForm } from './ProfileForm';# Create the App Registration (returns JSON with appId)
az ad app create --display-name learnapp-deploy --query "{appId:appId}" -o json