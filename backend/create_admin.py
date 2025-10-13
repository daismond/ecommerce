import asyncio
import sys
from app.database import SessionLocal
from app.schemas.user import UserCreate
from app.models.user import UserRole

async def create_admin_user():
    """
    Creates an admin user from command-line arguments.
    """
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <email> <password>")
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]

    db = SessionLocal()
    try:
        print(f"Creating admin user for email: {email}...")
        
        user_in = UserCreate(email=email, password=password, first_name="Admin", last_name="User")
        
        # Check if user already exists
        from app.crud.user import get_user_by_email
        db_user = get_user_by_email(db, email=email)
        if db_user:
            print(f"User with email {email} already exists.")
            # Ask if they want to update the role
            if db_user.role != UserRole.admin:
                update_role = input("Do you want to update this user to be an admin? (y/n): ").lower()
                if update_role == 'y':
                    db_user.role = UserRole.admin
                    db.commit()
                    print(f"User {email} updated to admin successfully.")
                else:
                    print("Aborting.")
            else:
                 print(f"User {email} is already an admin.")
            return

        # If user does not exist, create new one
        from app.core.security import get_password_hash
        from app.models.user import User

        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            email=user_in.email,
            password_hash=hashed_password,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            role=UserRole.admin,  # Set role to admin
            is_active=True,
            is_verified=True, # Assuming admin is verified
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        print(f"Admin user {email} created successfully.")
        
    finally:
        db.close()

if __name__ == "__main__":
    # This is a workaround to avoid creating a separate async main function
    # as we are calling it from a sync context
    from app.database import SessionLocal
    from app.crud.user import get_user_by_email
    from app.models.user import UserRole
    from app.core.security import get_password_hash
    from app.models.user import User
    
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <email> <password>")
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]

    db = SessionLocal()
    try:
        print(f"Creating admin user for email: {email}...")
        
        # Check if user already exists
        db_user = get_user_by_email(db, email=email)
        if db_user:
            print(f"User with email {email} already exists.")
            if db_user.role != UserRole.admin:
                print("Updating user to admin...")
                db_user.role = UserRole.admin
                db.commit()
                print(f"User {email} updated to admin successfully.")
            else:
                print(f"User {email} is already an admin.")
            sys.exit(0)

        # If user does not exist, create new one
        hashed_password = get_password_hash(password)
        db_user = User(
            email=email,
            password_hash=hashed_password,
            first_name="Admin",
            last_name="User",
            role=UserRole.admin,  # Set role to admin
            is_active=True,
            is_verified=True, # Assuming admin is verified
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        print(f"Admin user {email} created successfully.")
        
    finally:
        db.close()