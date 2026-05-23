"""Backend tests for new image slider, upload-image endpoint, and is_new product field."""
import os
import io
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://precision-abrasives.preview.emergentagent.com').rstrip('/')
ADMIN_EMAIL = "admin@mayur.com"
ADMIN_PASSWORD = "MayurAdmin@2024"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    return data["access_token"]


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------- Settings: slider_images + slider_interval ----------

class TestSettings:
    def test_get_settings_has_slider_fields(self):
        r = requests.get(f"{BASE_URL}/api/settings", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert "slider_images" in d
        assert "slider_interval" in d
        assert isinstance(d["slider_images"], list)
        assert isinstance(d["slider_interval"], int)
        assert d["slider_interval"] >= 2

    def test_update_slider_settings_requires_admin(self):
        r = requests.put(f"{BASE_URL}/api/settings", json={"slider_interval": 5}, timeout=30)
        assert r.status_code == 401

    def test_update_slider_settings_admin(self, admin_headers):
        new_images = [
            "https://example.com/a.jpg",
            "https://example.com/b.jpg",
            "https://example.com/c.jpg",
            "https://example.com/d.jpg",
            "https://example.com/e.jpg",
        ]
        r = requests.put(f"{BASE_URL}/api/settings",
                         json={"slider_images": new_images, "slider_interval": 4},
                         headers=admin_headers, timeout=30)
        assert r.status_code == 200, r.text

        # Verify persistence
        r2 = requests.get(f"{BASE_URL}/api/settings", timeout=30)
        d = r2.json()
        assert d["slider_interval"] == 4
        assert d["slider_images"] == new_images

        # Restore default 5 seeded images for frontend testing
        seeded = [
            "https://images.pexels.com/photos/13296066/pexels-photo-13296066.jpeg",
            "https://images.pexels.com/photos/50691/drill-milling-milling-machine-drilling-50691.jpeg",
            "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg",
            "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
            "https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg",
        ]
        requests.put(f"{BASE_URL}/api/settings",
                     json={"slider_images": seeded, "slider_interval": 3},
                     headers=admin_headers, timeout=30)


# ---------- Upload Image endpoint ----------

class TestUploadImage:
    def test_upload_image_requires_admin(self):
        files = {"file": ("test.png", b"\x89PNG\r\n\x1a\n" + b"0" * 100, "image/png")}
        r = requests.post(f"{BASE_URL}/api/upload-image", files=files, timeout=30)
        assert r.status_code == 401

    def test_upload_image_rejects_non_image(self, admin_headers):
        files = {"file": ("test.txt", b"hello world", "text/plain")}
        r = requests.post(f"{BASE_URL}/api/upload-image", files=files, headers=admin_headers, timeout=30)
        assert r.status_code == 400
        assert "image" in r.json().get("detail", "").lower()

    def test_upload_image_success(self, admin_headers):
        png_bytes = b"\x89PNG\r\n\x1a\n" + b"0" * 2048
        files = {"file": ("test.png", png_bytes, "image/png")}
        r = requests.post(f"{BASE_URL}/api/upload-image", files=files, headers=admin_headers, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "url" in d
        assert d["url"].startswith("data:image/png;base64,")
        assert d["content_type"] == "image/png"
        assert d["size"] == len(png_bytes)

    def test_upload_image_rejects_too_large(self, admin_headers):
        big = b"\x89PNG\r\n\x1a\n" + b"0" * (6 * 1024 * 1024)
        files = {"file": ("big.png", big, "image/png")}
        r = requests.post(f"{BASE_URL}/api/upload-image", files=files, headers=admin_headers, timeout=60)
        assert r.status_code == 400
        assert "5mb" in r.json().get("detail", "").lower()


# ---------- Product is_new field ----------

class TestProductIsNew:
    def test_filter_is_new_true(self):
        r = requests.get(f"{BASE_URL}/api/products?is_new=true&is_active=true", timeout=30)
        assert r.status_code == 200
        products = r.json()
        assert isinstance(products, list)
        # All returned products must have is_new == True
        for p in products:
            assert p.get("is_new") is True
        # There should be at least 1 (seeded 3 per request)
        assert len(products) >= 1

    def test_create_and_update_is_new(self, admin_headers):
        payload = {
            "name": "TEST_NewProduct_isnew",
            "category": "cutting-wheels",
            "description": "Test product for is_new flag",
            "is_new": True,
            "is_featured": False,
            "is_active": True,
        }
        r = requests.post(f"{BASE_URL}/api/products", json=payload, headers=admin_headers, timeout=30)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created["is_new"] is True
        assert "id" in created
        pid = created["id"]

        # GET to verify persistence
        g = requests.get(f"{BASE_URL}/api/products/{pid}", timeout=30)
        assert g.status_code == 200
        assert g.json()["is_new"] is True

        # Toggle is_new off
        u = requests.put(f"{BASE_URL}/api/products/{pid}",
                        json={"is_new": False}, headers=admin_headers, timeout=30)
        assert u.status_code == 200
        g2 = requests.get(f"{BASE_URL}/api/products/{pid}", timeout=30)
        assert g2.json()["is_new"] is False

        # Cleanup
        d = requests.delete(f"{BASE_URL}/api/products/{pid}", headers=admin_headers, timeout=30)
        assert d.status_code == 200
