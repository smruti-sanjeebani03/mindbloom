import re
from rest_framework.exceptions import ValidationError


def validate_password_strength(password: str):
    """
    Validates password strength:
    - Minimum length 8 characters
    - At least one letter
    - At least one digit or special character
    """
    if not password or len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long.")
    
    if not re.search(r'[a-zA-Z]', password):
        raise ValidationError("Password must contain at least one letter.")
        
    if not re.search(r'[\d!@#$%^&*()_+\-=\[\]{};:\'",.<>?/|\\]', password):
        raise ValidationError("Password must contain at least one number or special character.")


def validate_email_format(email: str):
    """
    Validates email format using regex.
    """
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not email or not re.match(email_regex, email.strip()):
        raise ValidationError("Please provide a valid email address.")
