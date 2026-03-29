from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, UploadFile, File, BackgroundTasks
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
import secrets

# Sora 2 Video Generation
from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

# Create the main app
app = FastAPI(title="Mayur Abrasives API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

# Product Models
class ProductCreate(BaseModel):
    name: str
    category: str
    subcategory: Optional[str] = None
    size: Optional[str] = None
    thickness: Optional[str] = None
    grit: Optional[str] = None
    description: str
    use_cases: List[str] = []
    image_url: Optional[str] = None
    specifications: dict = {}
    is_featured: bool = False
    is_active: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    size: Optional[str] = None
    thickness: Optional[str] = None
    grit: Optional[str] = None
    description: Optional[str] = None
    use_cases: Optional[List[str]] = None
    image_url: Optional[str] = None
    specifications: Optional[dict] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    subcategory: Optional[str] = None
    size: Optional[str] = None
    thickness: Optional[str] = None
    grit: Optional[str] = None
    description: str
    use_cases: List[str] = []
    image_url: Optional[str] = None
    specifications: dict = {}
    is_featured: bool = False
    is_active: bool = True
    created_at: str

# Dealer Models
class DealerApplicationCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    city: str
    state: Optional[str] = None
    business_type: str
    business_name: Optional[str] = None
    message: Optional[str] = None

class DealerApplicationResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    city: str
    state: Optional[str] = None
    business_type: str
    business_name: Optional[str] = None
    message: Optional[str] = None
    status: str
    created_at: str

# Inquiry Models
class InquiryCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    message: str
    inquiry_type: str = "general"  # general, quote, contact

class InquiryResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    company: Optional[str] = None
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    message: str
    inquiry_type: str
    status: str
    created_at: str

# Catalog Models
class CatalogCreate(BaseModel):
    name: str
    category: str
    file_url: str
    preview_image: Optional[str] = None

class CatalogResponse(BaseModel):
    id: str
    name: str
    category: str
    file_url: str
    preview_image: Optional[str] = None
    created_at: str

# Settings Models
class SettingsUpdate(BaseModel):
    whatsapp_number: Optional[str] = None
    company_email: Optional[str] = None
    company_phone: Optional[str] = None
    company_address: Optional[str] = None
    google_maps_embed: Optional[str] = None
    hero_video_url: Optional[str] = None

class SettingsResponse(BaseModel):
    whatsapp_number: str
    company_email: str
    company_phone: str
    company_address: str
    google_maps_embed: str
    hero_video_url: str

# Video Generation Models
class VideoGenerateRequest(BaseModel):
    prompt: str

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "role": user.get("role", "user")
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/login")
async def login(data: UserLogin, response: Response):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=86400, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": user.get("role", "user"),
        "access_token": access_token
    }

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

# ==================== PRODUCTS ROUTES ====================

@api_router.get("/products")
async def get_products(
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    size: Optional[str] = None,
    grit: Optional[str] = None,
    is_featured: Optional[bool] = None,
    is_active: Optional[bool] = True,
    search: Optional[str] = None
):
    query = {}
    if category:
        query["category"] = category
    if subcategory:
        query["subcategory"] = subcategory
    if size:
        query["size"] = size
    if grit:
        query["grit"] = grit
    if is_featured is not None:
        query["is_featured"] = is_featured
    if is_active is not None:
        query["is_active"] = is_active
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query, {"_id": 0, "id": {"$toString": "$_id"}}).to_list(1000)
    # Re-fetch with proper ID conversion
    cursor = db.products.find(query)
    products = []
    async for doc in cursor:
        products.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", ""),
            "category": doc.get("category", ""),
            "subcategory": doc.get("subcategory"),
            "size": doc.get("size"),
            "thickness": doc.get("thickness"),
            "grit": doc.get("grit"),
            "description": doc.get("description", ""),
            "use_cases": doc.get("use_cases", []),
            "image_url": doc.get("image_url"),
            "specifications": doc.get("specifications", {}),
            "is_featured": doc.get("is_featured", False),
            "is_active": doc.get("is_active", True),
            "created_at": doc.get("created_at", datetime.now(timezone.utc).isoformat())
        })
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    try:
        doc = await db.products.find_one({"_id": ObjectId(product_id)})
    except:
        raise HTTPException(status_code=404, detail="Product not found")
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "category": doc.get("category", ""),
        "subcategory": doc.get("subcategory"),
        "size": doc.get("size"),
        "thickness": doc.get("thickness"),
        "grit": doc.get("grit"),
        "description": doc.get("description", ""),
        "use_cases": doc.get("use_cases", []),
        "image_url": doc.get("image_url"),
        "specifications": doc.get("specifications", {}),
        "is_featured": doc.get("is_featured", False),
        "is_active": doc.get("is_active", True),
        "created_at": doc.get("created_at", datetime.now(timezone.utc).isoformat())
    }

@api_router.post("/products")
async def create_product(data: ProductCreate, request: Request):
    await require_admin(request)
    doc = data.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.products.insert_one(doc)
    
    # Return the created product with proper ID conversion
    created_product = {
        "id": str(result.inserted_id),
        "name": doc.get("name", ""),
        "category": doc.get("category", ""),
        "subcategory": doc.get("subcategory"),
        "size": doc.get("size"),
        "thickness": doc.get("thickness"),
        "grit": doc.get("grit"),
        "description": doc.get("description", ""),
        "use_cases": doc.get("use_cases", []),
        "image_url": doc.get("image_url"),
        "specifications": doc.get("specifications", {}),
        "is_featured": doc.get("is_featured", False),
        "is_active": doc.get("is_active", True),
        "created_at": doc.get("created_at", "")
    }
    return created_product

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, data: ProductUpdate, request: Request):
    await require_admin(request)
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    try:
        result = await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
    except:
        raise HTTPException(status_code=404, detail="Product not found")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated successfully"}

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    await require_admin(request)
    try:
        result = await db.products.delete_one({"_id": ObjectId(product_id)})
    except:
        raise HTTPException(status_code=404, detail="Product not found")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@api_router.get("/categories")
async def get_categories():
    categories = [
        {"id": "cutting-wheels", "name": "Cutting Wheels", "sizes": ["4\"", "5\"", "7\"", "10\"", "12\"", "14\""]},
        {"id": "grinding-wheels", "name": "Grinding Wheels", "sizes": ["4\"", "5\"", "6\"", "7\""]},
        {"id": "flap-discs", "name": "Flap Discs", "types": ["Metal Flap", "Fiber Flap", "Vertical", "Flexible"]},
        {"id": "saw-blades", "name": "Saw Blades", "types": ["TCT", "Diamond", "Marble & Granite"]},
        {"id": "non-woven-wheels", "name": "Non-Woven Wheels", "types": ["Standard", "Fine", "Ultra Fine"]},
        {"id": "buffing-polishing", "name": "Buffing & Polishing", "types": ["Felt Buff", "Polishing Compound", "Abrasive Paper"]}
    ]
    return categories

# ==================== DEALER ROUTES ====================

@api_router.post("/dealers/apply")
async def apply_dealer(data: DealerApplicationCreate):
    doc = data.model_dump()
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.dealer_applications.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Application submitted successfully"}

@api_router.get("/dealers")
async def get_dealers(request: Request, status: Optional[str] = None):
    await require_admin(request)
    query = {}
    if status:
        query["status"] = status
    cursor = db.dealer_applications.find(query).sort("created_at", -1)
    dealers = []
    async for doc in cursor:
        dealers.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", ""),
            "phone": doc.get("phone", ""),
            "email": doc.get("email"),
            "city": doc.get("city", ""),
            "state": doc.get("state"),
            "business_type": doc.get("business_type", ""),
            "business_name": doc.get("business_name"),
            "message": doc.get("message"),
            "status": doc.get("status", "pending"),
            "created_at": doc.get("created_at", "")
        })
    return dealers

@api_router.put("/dealers/{dealer_id}/status")
async def update_dealer_status(dealer_id: str, status: str, request: Request):
    await require_admin(request)
    if status not in ["pending", "approved", "rejected", "contacted"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    try:
        result = await db.dealer_applications.update_one(
            {"_id": ObjectId(dealer_id)},
            {"$set": {"status": status}}
        )
    except:
        raise HTTPException(status_code=404, detail="Application not found")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Status updated successfully"}

@api_router.delete("/dealers/{dealer_id}")
async def delete_dealer(dealer_id: str, request: Request):
    await require_admin(request)
    try:
        result = await db.dealer_applications.delete_one({"_id": ObjectId(dealer_id)})
    except:
        raise HTTPException(status_code=404, detail="Application not found")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Application deleted successfully"}

# ==================== INQUIRY ROUTES ====================

@api_router.post("/inquiries")
async def create_inquiry(data: InquiryCreate):
    doc = data.model_dump()
    doc["status"] = "new"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.inquiries.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Inquiry submitted successfully"}

@api_router.get("/inquiries")
async def get_inquiries(request: Request, status: Optional[str] = None, inquiry_type: Optional[str] = None):
    await require_admin(request)
    query = {}
    if status:
        query["status"] = status
    if inquiry_type:
        query["inquiry_type"] = inquiry_type
    cursor = db.inquiries.find(query).sort("created_at", -1)
    inquiries = []
    async for doc in cursor:
        inquiries.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", ""),
            "phone": doc.get("phone", ""),
            "email": doc.get("email"),
            "company": doc.get("company"),
            "product_id": doc.get("product_id"),
            "product_name": doc.get("product_name"),
            "message": doc.get("message", ""),
            "inquiry_type": doc.get("inquiry_type", "general"),
            "status": doc.get("status", "new"),
            "created_at": doc.get("created_at", "")
        })
    return inquiries

@api_router.put("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, status: str, request: Request):
    await require_admin(request)
    if status not in ["new", "contacted", "resolved", "closed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    try:
        result = await db.inquiries.update_one(
            {"_id": ObjectId(inquiry_id)},
            {"$set": {"status": status}}
        )
    except:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Status updated successfully"}

@api_router.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, request: Request):
    await require_admin(request)
    try:
        result = await db.inquiries.delete_one({"_id": ObjectId(inquiry_id)})
    except:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Inquiry deleted successfully"}

# ==================== SETTINGS ROUTES ====================

@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"type": "global"}, {"_id": 0})
    if not settings:
        settings = {
            "whatsapp_number": "+919876543210",
            "company_email": "info@mayurabrasives.com",
            "company_phone": "+91-141-2345678",
            "company_address": "Industrial Area, Jaipur, Rajasthan, India - 302001",
            "google_maps_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.758977432432!2d75.78745297640383!3d26.91243777665686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db50c6c2e5a7d%3A0x8b7c0c6c6c6c6c6c!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin",
            "hero_video_url": ""
        }
    return settings

@api_router.put("/settings")
async def update_settings(data: SettingsUpdate, request: Request):
    await require_admin(request)
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    await db.settings.update_one(
        {"type": "global"},
        {"$set": update_data},
        upsert=True
    )
    return {"message": "Settings updated successfully"}

# ==================== CATALOG ROUTES ====================

@api_router.get("/catalogs")
async def get_catalogs():
    cursor = db.catalogs.find({}).sort("created_at", -1)
    catalogs = []
    async for doc in cursor:
        catalogs.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", ""),
            "category": doc.get("category", ""),
            "file_url": doc.get("file_url", ""),
            "preview_image": doc.get("preview_image"),
            "created_at": doc.get("created_at", "")
        })
    return catalogs

@api_router.post("/catalogs")
async def create_catalog(data: CatalogCreate, request: Request):
    await require_admin(request)
    doc = data.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.catalogs.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Catalog created successfully"}

@api_router.delete("/catalogs/{catalog_id}")
async def delete_catalog(catalog_id: str, request: Request):
    await require_admin(request)
    try:
        result = await db.catalogs.delete_one({"_id": ObjectId(catalog_id)})
    except:
        raise HTTPException(status_code=404, detail="Catalog not found")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Catalog not found")
    return {"message": "Catalog deleted successfully"}

# ==================== VIDEO GENERATION ====================

@api_router.post("/generate-video")
async def generate_video(data: VideoGenerateRequest, request: Request, background_tasks: BackgroundTasks):
    await require_admin(request)
    
    # Generate video with Sora 2
    try:
        video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
        output_path = f"/app/frontend/public/videos/hero_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        video_bytes = video_gen.text_to_video(
            prompt=data.prompt,
            model="sora-2",
            size="1280x720",
            duration=4,
            max_wait_time=600
        )
        
        if video_bytes:
            video_gen.save_video(video_bytes, output_path)
            video_url = f"/videos/hero_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
            
            # Update settings with new video URL
            await db.settings.update_one(
                {"type": "global"},
                {"$set": {"hero_video_url": video_url}},
                upsert=True
            )
            
            return {"video_url": video_url, "message": "Video generated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Video generation failed")
    except Exception as e:
        logger.error(f"Video generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Video generation error: {str(e)}")

# ==================== STATS (DASHBOARD) ====================

@api_router.get("/stats")
async def get_stats(request: Request):
    await require_admin(request)
    
    products_count = await db.products.count_documents({})
    dealers_count = await db.dealer_applications.count_documents({})
    pending_dealers = await db.dealer_applications.count_documents({"status": "pending"})
    inquiries_count = await db.inquiries.count_documents({})
    new_inquiries = await db.inquiries.count_documents({"status": "new"})
    
    return {
        "products": products_count,
        "dealers": dealers_count,
        "pending_dealers": pending_dealers,
        "inquiries": inquiries_count,
        "new_inquiries": new_inquiries
    }

# ==================== HEALTH CHECK ====================

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router in the main app
app.include_router(api_router)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000"), "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== STARTUP EVENTS ====================

@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.products.create_index("category")
    await db.products.create_index("is_featured")
    await db.dealer_applications.create_index("status")
    await db.inquiries.create_index("status")
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@mayur.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "MayurAdmin@2024")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info(f"Admin password updated: {admin_email}")
    
    # Seed default settings
    settings = await db.settings.find_one({"type": "global"})
    if not settings:
        await db.settings.insert_one({
            "type": "global",
            "whatsapp_number": "+919876543210",
            "company_email": "info@mayurabrasives.com",
            "company_phone": "+91-141-2345678",
            "company_address": "Industrial Area, Jaipur, Rajasthan, India - 302001",
            "google_maps_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.758977432432!2d75.78745297640383!3d26.91243777665686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db50c6c2e5a7d%3A0x8b7c0c6c6c2e5a7d!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin",
            "hero_video_url": ""
        })
        logger.info("Default settings created")
    
    # Seed sample products
    products_count = await db.products.count_documents({})
    if products_count == 0:
        sample_products = [
            {
                "name": "Mayur Pro Cutting Wheel 4\"",
                "category": "cutting-wheels",
                "size": "4\"",
                "thickness": "1.2mm",
                "description": "High-performance cutting wheel for metal cutting. Ideal for precision cuts on steel, iron, and stainless steel.",
                "use_cases": ["Metal Cutting", "Steel Fabrication", "Pipe Cutting"],
                "image_url": "https://images.pexels.com/photos/50691/drill-milling-milling-machine-drilling-50691.jpeg",
                "specifications": {"max_rpm": "13300", "arbor_size": "16mm", "material": "Aluminum Oxide"},
                "is_featured": True,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Mayur Plus Grinding Wheel 7\"",
                "category": "grinding-wheels",
                "size": "7\"",
                "thickness": "6mm",
                "description": "Heavy-duty grinding wheel for aggressive metal removal. Perfect for weld grinding and surface preparation.",
                "use_cases": ["Weld Grinding", "Surface Prep", "Metal Removal"],
                "image_url": "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg",
                "specifications": {"max_rpm": "8500", "arbor_size": "22mm", "material": "Zirconia Alumina"},
                "is_featured": True,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Mayur Flap Disc 4\" - 80 Grit",
                "category": "flap-discs",
                "subcategory": "metal-flap",
                "size": "4\"",
                "grit": "80",
                "description": "Premium flap disc for blending and finishing. Provides smooth finish on metal surfaces.",
                "use_cases": ["Blending", "Finishing", "Deburring"],
                "image_url": "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
                "specifications": {"max_rpm": "13300", "arbor_size": "16mm", "backing": "Fiberglass"},
                "is_featured": True,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Mayur TCT Saw Blade 12\"",
                "category": "saw-blades",
                "subcategory": "tct",
                "size": "12\"",
                "description": "Tungsten Carbide Tipped saw blade for wood and metal cutting. Long-lasting and precise cuts.",
                "use_cases": ["Wood Cutting", "Aluminum Cutting", "Composite Materials"],
                "image_url": "https://images.pexels.com/photos/1205434/pexels-photo-1205434.jpeg",
                "specifications": {"teeth": "60T", "arbor_size": "25.4mm", "material": "TCT"},
                "is_featured": False,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Mayur Diamond Blade 4\"",
                "category": "saw-blades",
                "subcategory": "diamond",
                "size": "4\"",
                "description": "Premium diamond blade for cutting concrete, marble, and granite. Superior cutting performance.",
                "use_cases": ["Concrete Cutting", "Tile Cutting", "Stone Work"],
                "image_url": "https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg",
                "specifications": {"segment_height": "10mm", "arbor_size": "20mm", "type": "Segmented"},
                "is_featured": True,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Mayur Non-Woven Wheel 6\"",
                "category": "non-woven-wheels",
                "size": "6\"",
                "grit": "Fine",
                "description": "Non-woven finishing wheel for polishing and surface conditioning. Creates satin finish.",
                "use_cases": ["Polishing", "Surface Conditioning", "Rust Removal"],
                "image_url": "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
                "specifications": {"max_rpm": "6000", "arbor_size": "25mm", "grade": "Fine"},
                "is_featured": False,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.products.insert_many(sample_products)
        logger.info(f"Seeded {len(sample_products)} sample products")
    
    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"""# Test Credentials

## Admin Account
- Email: {admin_email}
- Password: {admin_password}
- Role: admin

## Auth Endpoints
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
""")
    logger.info("Test credentials written to /app/memory/test_credentials.md")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
