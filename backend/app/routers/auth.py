from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import schemas, models, auth
from app.database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Проверяем есть ли пользователь
    db_user = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()
    if db_user:
        return {"error": "User exists"}
    
    # Создаем пользователя
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=user.password  # Пока так
    )
    db.add(db_user)
    db.commit()
    return {"success": True, "user": db_user.username}

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Ищем пользователя
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or user.hashed_password != form_data.password:  # Простая проверка
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    # Создаем токен
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_me(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    user = await auth.get_current_user(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user