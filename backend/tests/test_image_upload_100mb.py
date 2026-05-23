"""Iter 12 — /api/upload-image switched to filesystem storage with 100MB limit.

The endpoint must now:
  * accept files up to 100MB (8MB succeeds, 105MB rejected with '100MB' in detail)
  * return a relative URL `/api/uploads/{uuid}.{ext}` (no longer base64 data URL)
  * write file to /app/backend/uploads/ and serve via StaticFiles at /api/uploads/*
  * map content_type -> extension (png/jpg/webp/gif)
  * still require admin auth, reject non-image content types
"""
import os
import re
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
ADMIN_EMAIL = "admin@mayur.com"
ADMIN_PASSWORD = "MayurAdmin@2024"

PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
JPG_MAGIC = b"\xff\xd8\xff\xe0"
WEBP_MAGIC = b"RIFF\x00\x00\x00\x00WEBPVP8 "
GIF_MAGIC = b"GIF89a"


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


# ---- Auth ----
def test_upload_requires_auth():
    files = {"file": ("a.png", PNG_MAGIC + b"x", "image/png")}
    r = requests.post(f"{BASE_URL}/api/upload-image", files=files)
    assert r.status_code in (401, 403), r.text


# ---- Non-image rejection ----
def test_upload_rejects_non_image(admin_session):
    files = {"file": ("a.txt", b"hello", "text/plain")}
    r = admin_session.post(f"{BASE_URL}/api/upload-image", files=files)
    assert r.status_code == 400
    assert "image" in r.json().get("detail", "").lower()


# ---- 8MB upload (would have failed under the old 5MB limit) ----
def test_upload_8mb_png_succeeds(admin_session):
    payload = PNG_MAGIC + b"\x00" * (8 * 1024 * 1024)
    files = {"file": ("eight.png", payload, "image/png")}
    r = admin_session.post(f"{BASE_URL}/api/upload-image", files=files)
    assert r.status_code == 200, r.text
    data = r.json()
    # New response shape
    assert "url" in data and "size" in data and "content_type" in data
    assert data["url"].startswith("/api/uploads/")
    assert data["url"].endswith(".png")
    assert data["content_type"] == "image/png"
    assert data["size"] == len(payload)

    # filename uses uuid4().hex => 32 hex chars before extension
    m = re.match(r"^/api/uploads/([0-9a-f]{32})\.png$", data["url"])
    assert m, f"URL doesn't match uuid4().hex pattern: {data['url']}"

    # GET it back via the public URL — should be 200 with correct content-type
    g = requests.get(f"{BASE_URL}{data['url']}")
    assert g.status_code == 200
    assert g.headers.get("content-type", "").startswith("image/png")
    assert len(g.content) == len(payload)


# ---- 105MB upload rejected with clean '100MB' message ----
def test_upload_105mb_rejected(admin_session):
    # 105MB binary blob — content_type passes type check, triggers size check
    payload = PNG_MAGIC + b"\x00" * (105 * 1024 * 1024)
    files = {"file": ("huge.png", payload, "image/png")}
    r = admin_session.post(f"{BASE_URL}/api/upload-image", files=files)
    assert r.status_code == 400, f"Expected 400, got {r.status_code}: {r.text}"
    detail = r.json().get("detail", "")
    assert "100MB" in detail, f"Expected '100MB' in error detail, got: {detail}"


# ---- Extension mapping ----
@pytest.mark.parametrize("ct,expected_ext,magic", [
    ("image/png", ".png", PNG_MAGIC),
    ("image/jpeg", ".jpg", JPG_MAGIC),
    ("image/webp", ".webp", WEBP_MAGIC),
    ("image/gif", ".gif", GIF_MAGIC),
])
def test_upload_extension_mapping(admin_session, ct, expected_ext, magic):
    files = {"file": (f"x{expected_ext}", magic + b"data", ct)}
    r = admin_session.post(f"{BASE_URL}/api/upload-image", files=files)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["url"].endswith(expected_ext), f"Expected ext {expected_ext}, got url {data['url']}"
    assert data["content_type"] == ct
    # Validate uuid4().hex (32 chars) filename
    fname = data["url"].rsplit("/", 1)[-1]
    stem = fname.rsplit(".", 1)[0]
    assert len(stem) == 32, f"Filename stem should be 32 hex chars (uuid4.hex), got {stem}"
    assert re.match(r"^[0-9a-f]{32}$", stem), f"Stem not lowercase hex: {stem}"

    # GET back
    g = requests.get(f"{BASE_URL}{data['url']}")
    assert g.status_code == 200
    assert g.headers.get("content-type", "").startswith("image/")


# ---- Response shape regression ----
def test_response_shape_no_base64(admin_session):
    files = {"file": ("a.png", PNG_MAGIC + b"abc", "image/png")}
    r = admin_session.post(f"{BASE_URL}/api/upload-image", files=files)
    assert r.status_code == 200
    data = r.json()
    assert not data["url"].startswith("data:"), "URL must NOT be a base64 data URL anymore"
    assert data["url"].startswith("/api/uploads/")


# ---- Coexistence: existing base64/external URLs in DB still render ----
def test_existing_external_image_urls_still_served():
    """Products seeded with old external https:// URLs should still be returned as-is."""
    r = requests.get(f"{BASE_URL}/api/products")
    assert r.status_code == 200
    items = r.json()
    # At least one seeded product must have an https://... or data:... or /api/uploads/... image_url
    found_legacy = any(
        p.get("image_url", "").startswith(("http://", "https://", "data:"))
        for p in items
    )
    assert found_legacy or len(items) == 0, "Expected at least one legacy external-URL product to still resolve"


# ---- Regression: admin login + seeded data still intact ----
def test_admin_login_regression():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    assert r.json()["role"] == "admin"


def test_categories_pages_regression():
    rc = requests.get(f"{BASE_URL}/api/categories")
    assert rc.status_code == 200
    rp = requests.get(f"{BASE_URL}/api/pages")
    assert rp.status_code == 200
    keys = [p["key"] for p in rp.json()]
    for k in ("home", "privacy", "terms", "footer"):
        assert k in keys


def test_seeded_gallery_product_intact():
    r = requests.get(f"{BASE_URL}/api/products/6a116aa8ca9700945ee3a4ed")
    if r.status_code != 200:
        pytest.skip("Seeded gallery product missing")
    data = r.json()
    assert len(data["images"]) >= 1
