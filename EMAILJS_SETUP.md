# Setting Up EmailJS with Gmail

This guide will help you connect your contact form to your Gmail account using EmailJS.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS website](https://www.emailjs.com/) and sign up for a free account
2. The free tier allows 200 emails per month, which is sufficient for most portfolio websites

## Step 2: Connect Your Gmail Account

1. In your EmailJS dashboard, click on "Email Services" in the sidebar
2. Click "Add New Service"
3. Select "Gmail" from the list of providers
4. Follow the prompts to authenticate with your Gmail account
5. Give your service a name (e.g., "portfolio-contact")
6. Save the service and note the **Service ID** for later

## Step 3: Create an Email Template

1. In your EmailJS dashboard, click on "Email Templates" in the sidebar
2. Click "Create New Template"
3. Design your email template with the following variables:
   - `{{from_name}}`: The name of the person contacting you
   - `{{from_email}}`: The email of the person contacting you
   - `{{subject}}`: The subject of the message
   - `{{message}}`: The content of the message
4. Save the template and note the **Template ID** for later

## Step 4: Configure Your Environment Variables

1. Create a `.env` file in your project root (copy the content from `.env.example`)
2. Fill in the following values:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_USER_ID=your_user_id
   ```
3. Replace:
   - `your_service_id` with the Service ID from Step 2
   - `your_template_id` with the Template ID from Step 3
   - `your_user_id` with your EmailJS Public Key (find in Account > API Keys)

## Step 5: Verify It Works

1. Once you've set everything up, test your contact form
2. Fill out all fields and submit the form
3. You should receive an email at your Gmail address with the message details
4. Check for any errors in the browser console if the email doesn't arrive

## Troubleshooting

- **Emails not arriving**: Check spam folder, verify credentials, ensure Gmail hasn't restricted access
- **Form submission errors**: Check browser console for specific error messages
- **Rate limit**: Free tier is limited to 200 emails/month, upgrade if needed

## Security Notes

- Never commit your `.env` file to public repositories
- Always use environment variables for sensitive credentials
- EmailJS sends requests from the client side, but your API keys are secured by domain restrictions 