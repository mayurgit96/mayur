"""Backend tests for Categories CRUD, subcategories, and footer inquiry endpoint."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fall back to frontend .env
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().strip('"').rstrip("/")
                    break
    except Exception:
        pass

ADMIN_EMAIL = "admin@mayur.com"
ADMIN_PASSWORD = "MayurAdmin@2024"


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                      timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ============ Categories: GET ============
class TestCategoriesGet:
    def test_get_categories_returns_list(self):
        r = requests.get(f"{BASE_URL}/api/categories", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 6
        slugs = {c["slug"] for c in data}
        for expected in ["cutting-wheels", "grinding-wheels", "flap-discs",
                         "saw-blades", "non-woven-wheels", "buffing-polishing"]:
            assert expected in slugs, f"Missing seeded slug: {expected}"

    def test_category_shape(self):
        r = requests.get(f"{BASE_URL}/api/categories", timeout=15)
        c = r.json()[0]
        for key in ["id", "name", "slug", "description", "image_url",
                    "subcategories", "sort_order", "created_at"]:
            assert key in c, f"Missing key: {key}"
        assert isinstance(c["subcategories"], list)
        if c["subcategories"]:
            assert "name" in c["subcategories"][0] and "slug" in c["subcategories"][0]


# ============ Categories: Auth ============
class TestCategoriesAuth:
    def test_create_unauthenticated_rejected(self):
        r = requests.post(f"{BASE_URL}/api/categories",
                          json={"name": "TEST_unauth"}, timeout=15)
        assert r.status_code in (401, 403)

    def test_update_unauthenticated_rejected(self):
        r = requests.put(f"{BASE_URL}/api/categories/000000000000000000000000",
                         json={"name": "x"}, timeout=15)
        assert r.status_code in (401, 403)

    def test_delete_unauthenticated_rejected(self):
        r = requests.delete(f"{BASE_URL}/api/categories/000000000000000000000000",
                            timeout=15)
        assert r.status_code in (401, 403)

    def test_add_sub_unauthenticated_rejected(self):
        r = requests.post(f"{BASE_URL}/api/categories/000000000000000000000000/subcategories",
                          json={"name": "x"}, timeout=15)
        assert r.status_code in (401, 403)


# ============ Categories: CRUD ============
class TestCategoriesCRUD:
    def test_full_crud_flow(self, admin_headers):
        # CREATE without explicit slug (auto-slugify)
        # Note: backend slugify strips underscores entirely (regex bug), so avoid _ in name
        uniq = str(int(time.time()))
        payload = {
            "name": f"TESTDiamond Tools {uniq}",
            "description": "Test category",
            "image_url": "https://example.com/a.jpg",
            "sort_order": 99,
            "subcategories": [{"name": "Sub One"}, {"name": "Sub Two", "slug": "sub-two-custom"}]
        }
        expected_slug = f"testdiamond-tools-{uniq}"
        r = requests.post(f"{BASE_URL}/api/categories", json=payload,
                          headers=admin_headers, timeout=15)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created["slug"] == expected_slug
        assert created["name"] == payload["name"]
        assert created["sort_order"] == 99
        assert len(created["subcategories"]) == 2
        sub_slugs = [s["slug"] for s in created["subcategories"]]
        assert "sub-one" in sub_slugs
        assert "sub-two-custom" in sub_slugs
        cat_id = created["id"]

        # GET verifies persistence
        r = requests.get(f"{BASE_URL}/api/categories", timeout=15)
        found = next((c for c in r.json() if c["id"] == cat_id), None)
        assert found is not None
        assert found["name"] == payload["name"]

        # Duplicate slug should 400
        r = requests.post(f"{BASE_URL}/api/categories",
                          json={"name": "Other", "slug": expected_slug},
                          headers=admin_headers, timeout=15)
        assert r.status_code == 400

        # UPDATE name + slug + sort_order
        new_slug = f"test-diamond-updated-{uniq}"
        r = requests.put(f"{BASE_URL}/api/categories/{cat_id}",
                         json={"name": "TESTDiamond Updated",
                               "slug": new_slug,
                               "sort_order": 50},
                         headers=admin_headers, timeout=15)
        assert r.status_code == 200, r.text
        updated = r.json()
        assert updated["name"] == "TESTDiamond Updated"
        assert updated["slug"] == new_slug
        assert updated["sort_order"] == 50

        # Add subcategory via endpoint
        r = requests.post(f"{BASE_URL}/api/categories/{cat_id}/subcategories",
                          json={"name": "Extra Sub"},
                          headers=admin_headers, timeout=15)
        assert r.status_code == 200, r.text
        after_add = r.json()
        sub_slugs2 = [s["slug"] for s in after_add["subcategories"]]
        assert "extra-sub" in sub_slugs2

        # Remove subcategory
        r = requests.delete(f"{BASE_URL}/api/categories/{cat_id}/subcategories/extra-sub",
                            headers=admin_headers, timeout=15)
        assert r.status_code == 200, r.text
        after_remove = r.json()
        sub_slugs3 = [s["slug"] for s in after_remove["subcategories"]]
        assert "extra-sub" not in sub_slugs3

        # Update with duplicate slug from another existing seeded cat -> 400
        r = requests.put(f"{BASE_URL}/api/categories/{cat_id}",
                         json={"slug": "cutting-wheels"},
                         headers=admin_headers, timeout=15)
        assert r.status_code == 400

        # DELETE
        r = requests.delete(f"{BASE_URL}/api/categories/{cat_id}",
                            headers=admin_headers, timeout=15)
        assert r.status_code == 200

        # Verify deleted
        r = requests.get(f"{BASE_URL}/api/categories", timeout=15)
        assert all(c["id"] != cat_id for c in r.json())


# ============ Footer Inquiry ============
class TestFooterInquiry:
    def test_inquiry_with_email(self):
        r = requests.post(f"{BASE_URL}/api/inquiries",
                          json={
                              "name": "TEST_Footer User",
                              "phone": "+919999999999",
                              "email": "test@example.com",
                              "message": "Footer test with email",
                              "inquiry_type": "general"
                          }, timeout=15)
        assert r.status_code == 200, r.text
        assert "id" in r.json()

    def test_inquiry_without_email(self):
        # Footer allows email to be optional
        r = requests.post(f"{BASE_URL}/api/inquiries",
                          json={
                              "name": "TEST_Footer NoEmail",
                              "phone": "+919999999998",
                              "message": "Footer test without email",
                              "inquiry_type": "general"
                          }, timeout=15)
        assert r.status_code == 200, r.text
        assert "id" in r.json()
