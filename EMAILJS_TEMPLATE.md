# EmailJS Template for Order Tracking

## Instructions
1. Go to your EmailJS dashboard: https://dashboard.emailjs.com/
2. Navigate to Email Templates
3. Open or create template with ID: `template_n263dys`
4. Copy the HTML below and paste it into the template editor
5. Make sure to set the template variables:
   - `{{to_name}}` - Customer name
   - `{{to_email}}` - Customer email (automatically set by EmailJS)
   - `{{order_id}}` - Order ID (short format)
   - `{{tracking_link}}` - Full tracking URL

## HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Binodia Express</title>
</head>
<body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                            <img src="https://binodia-express.vercel.app/logo.jpeg" alt="Binodia Express" style="max-width: 80px; height: auto; margin-bottom: 12px; border-radius: 8px;" />
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #065f46; line-height: 1.2;">
                                Binodia Express
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td style="padding: 40px 40px 20px;">
                            <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #111827; line-height: 1.3;">
                                Thank you for your order, {{to_name}}!
                            </h2>
                            <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                We're excited to prepare your delicious meal! Your order has been confirmed and is now being processed.
                            </p>
                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                <strong>Order ID:</strong> <span style="font-family: monospace; background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px;">{{order_id}}</span>
                            </p>
                            <p style="margin: 0 0 8px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                <strong>Order Link:</strong>
                            </p>
                            <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #065f46; word-break: break-all;">
                                <a href="{{tracking_link}}" style="color: #065f46; text-decoration: underline;">{{tracking_link}}</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Tracking Button -->
                    <tr>
                        <td style="padding: 0 40px 40px; text-align: center;">
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                Track your order in real-time:
                            </p>
                            <a href="{{tracking_link}}" style="display: inline-block; padding: 14px 32px; background-color: #065f46; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                                Track Your Order
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 16px 16px;">
                            <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.5; color: #6b7280; text-align: center;">
                                We'll keep you updated on your order status. You can track your order anytime using the link above.
                            </p>
                            <p style="margin: 16px 0 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                                © 2024 Binodia Express. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

## Template Variables Used
- `{{to_name}}` - Customer's name
- `{{to_email}}` - Customer's email (automatically handled by EmailJS)
- `{{order_id}}` - Short order ID (6 characters, uppercase)
- `{{tracking_link}}` - Full URL to the order tracking page

## Design Notes
- Uses emerald green (#065f46) matching the app's emerald-900 color
- Clean, modern design with rounded corners
- Mobile-responsive table layout
- Prominent tracking button with emerald background
- Professional and welcoming tone

