import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app import models

def send_email(to_email: str, subject: str, html_content: str):
    """A simple function to send an email using SMTP."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("SMTP_FROM_EMAIL")

    if not all([smtp_host, smtp_port, smtp_user, smtp_password, from_email]):
        print("Email configuration is incomplete. Skipping email sending.")
        return

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to_email

    # Attach the HTML part
    part = MIMEText(html_content, "html")
    message.attach(part)

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to_email, message.as_string())
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

def send_order_confirmation_email(order: models.order.Order):
    """Sends an order confirmation email to the customer."""
    if not order.user or not order.user.email:
        print(f"Order {order.id} has no associated user email. Skipping confirmation email.")
        return

    subject = f"Your Order Confirmation #{order.order_number}"

    # Create a simple HTML body
    items_html = "".join([
        f"<li>{item.product_variant.product.title} (Qty: {item.quantity}) - ${item.unit_price * item.quantity:.2f}</li>"
        for item in order.items
    ])

    html_content = f"""
    <html>
      <body>
        <h1>Thank you for your order!</h1>
        <p>Hi {order.user.first_name or 'there'},</p>
        <p>We've received your order #{order.order_number}. Here is a summary:</p>
        <ul>
          {items_html}
        </ul>
        <h3>Total: ${order.total_amount:.2f}</h3>
        <p>We will notify you again once your order has shipped.</p>
      </body>
    </html>
    """

    send_email(to_email=order.user.email, subject=subject, html_content=html_content)