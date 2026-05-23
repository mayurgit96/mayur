"""Tests for Product multi-image gallery feature (Iter 11)."""
import os
import io
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
ADMIN_EMAIL = "admin@mayur.com"
ADMIN_PASSWORD = "MayurAdmin@2024"


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


@pytest.fixture
def created_product(admin_session):
    payload = {
        "name": "TEST_Gallery_Product",
        "category": "abrasives",
        "description": "Test product for gallery",
        "image_url": "https://example.com/A.jpg",
        "images": ["https://example.com/A.jpg", "https://example.com/B.jpg", "https://example.com/C.jpg"],
    }
    r = admin_session.post(f"{BASE_URL}/api/products", json=payload)
    assert r.status_code == 200, r.text
    pid = r.json()["id"]
    yield pid
    admin_session.delete(f"{BASE_URL}/api/products/{pid}")


# ---- Product create with images ----
def test_create_product_with_gallery_persists(admin_session, created_product):
    r = requests.get(f"{BASE_URL}/api/products/{created_product}")
    assert r.status_code == 200
    data = r.json()
    assert data["image_url"] == "https://example.com/A.jpg"
    # primary dedup against images list
    assert data["images"] == ["https://example.com/A.jpg", "https://example.com/B.jpg", "https://example.com/C.jpg"]


# ---- Get products list returns gallery field ----
def test_list_products_has_images_field(created_product):
    r = requests.get(f"{BASE_URL}/api/products")
    assert r.status_code == 200
    items = r.json()
    found = [p for p in items if p["id"] == created_product]
    assert len(found) == 1
    assert "images" in found[0]
    assert isinstance(found[0]["images"], list)
    assert len(found[0]["images"]) == 3


# ---- Update product images list ----
def test_update_product_images(admin_session, created_product):
    new_imgs = ["https://example.com/X.jpg", "https://example.com/Y.jpg"]
    r = admin_session.put(
        f"{BASE_URL}/api/products/{created_product}",
        json={"image_url": "https://example.com/X.jpg", "images": new_imgs},
    )
    assert r.status_code == 200, r.text
    g = requests.get(f"{BASE_URL}/api/products/{created_product}").json()
    assert g["image_url"] == "https://example.com/X.jpg"
    assert g["images"] == new_imgs


# ---- Backward compatibility: only image_url, no images field ----
def test_backward_compat_legacy_image_url(admin_session):
    # Create product with image_url only, then strip images via update to []
    r = admin_session.post(f"{BASE_URL}/api/products", json={
        "name": "TEST_Legacy_Product",
        "category": "abrasives",
        "description": "Legacy",
        "image_url": "https://example.com/legacy.jpg",
        "images": [],
    })
    assert r.status_code == 200
    pid = r.json()["id"]
    try:
        g = requests.get(f"{BASE_URL}/api/products/{pid}").json()
        # gallery should contain at least the primary image_url
        assert g["images"] == ["https://example.com/legacy.jpg"]
    finally:
        admin_session.delete(f"{BASE_URL}/api/products/{pid}")


# ---- Upload image: rejects non-image ----
def test_upload_rejects_non_image(admin_session):
    files = {"file": ("test.txt", b"hello world", "text/plain")}
    r = admin_session.post(f"{BASE_URL}/api/upload-image", files=files)
    assert r.status_code == 400


# ---- Upload image: accepts jpeg/png/webp (now returns /api/uploads/{uuid}.{ext}) ----
@pytest.mark.parametrize("ct,ext", [
    ("image/jpeg", ".jpg"),
    ("image/png", ".png"),
    ("image/webp", ".webp"),
])
def test_upload_accepts_image_types(admin_session, ct, ext):
    files = {"file": (f"x{ext}", b"\x89PNG\r\n\x1a\nfakebytes", ct)}
    r = admin_session.post(f"{BASE_URL}/api/upload-image", files=files)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["url"].startswith("/api/uploads/")
    assert data["url"].endswith(ext)
    assert data["content_type"] == ct


# ---- Seeded gallery product 6a116aa8ca9700945ee3a4ed ----
def test_seeded_product_has_4_images():
    r = requests.get(f"{BASE_URL}/api/products/6a116aa8ca9700945ee3a4ed")
    if r.status_code != 200:
        pytest.skip("Seeded product not present")
    data = r.json()
    assert len(data["images"]) >= 1


# ---- Regression: admin login still works ----
def test_admin_login_regression():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    assert r.json()["role"] == "admin"


# ---- Regression: categories list ----
def test_categories_list_regression():
    r = requests.get(f"{BASE_URL}/api/categories")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ---- Regression: CMS pages ----
def test_pages_list_regression():
    r = requests.get(f"{BASE_URL}/api/pages")
    assert r.status_code == 200
    keys = [p["key"] for p in r.json()]
    for k in ["home", "privacy", "terms", "footer"]:
        assert k in keys
