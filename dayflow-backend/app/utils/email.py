import os
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "email_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task
def send_verification_email_task(email: str, token: str):
    import smtplib
    from email.message import EmailMessage
    
    msg = EmailMessage()
    msg["Subject"] = "Verify your email"
    msg["From"] = settings.SMTP_USER
    msg["To"] = email
    
    verify_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    msg.set_content(f"Click the link to verify your email: {verify_link}")
    
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email to {email}: {str(e)}")
